import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import OutCall "http-outcalls/outcall";

actor {
  // =================== COMPONENTS ===================
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  // =================== TYPES ===================
  type BuyerId = Nat;

  type FarmerProfile = {
    name : Text;
    farmName : Text;
    location : Text;
    crops : [Text];
    contactEmail : Text;
  };

  type CropScan = {
    farmer : Principal;
    image : Storage.ExternalBlob;
    cropType : Text;
    diagnosis : Text;
    treatmentAdvice : Text;
    timestamp : Time.Time;
  };

  type Buyer = {
    id : BuyerId;
    name : Text;
    company : Text;
    location : Text;
    cropsBought : [Text];
    contactEmail : Text;
    contactPhone : Text;
  };

  type ContactMessage = {
    farmer : Principal;
    buyerId : BuyerId;
    message : Text;
    timestamp : Time.Time;
    farmerName : Text;
    farmerContactEmail : Text;
  };

  type AiDiagnosis = {
    cropType : Text;
    symptoms : Text;
    diagnosis : Text;
    confidence : Nat;
    treatmentAdvice : Text;
    preventionTips : Text;
  };

  type DashboardData = {
    farmerProfile : ?FarmerProfile;
    recentScans : [CropScan];
    messageCount : Nat;
  };

  // =================== DATA STORAGE ===================
  let farmerProfiles = Map.empty<Principal, FarmerProfile>();
  let cropScans = List.empty<CropScan>();
  let buyers = Map.empty<BuyerId, Buyer>();

  let messages = List.empty<ContactMessage>();
  var nextBuyerId : BuyerId = 1;

  // =================== SEED BUYERS ===================

  let sampleBuyers = [
    {
      name = "AgroFresh";
      company = "AgroFresh Inc.";
      location = "Nairobi";
      cropsBought = ["Maize", "Beans", "Tomatoes"];
      contactEmail = "info@agrofresh.com";
      contactPhone = "+254701234567";
    },
    {
      name = "GreenMarket";
      company = "GreenMarket Ltd.";
      location = "Kisumu";
      cropsBought = ["Cabbage", "Onions", "Carrots"];
      contactEmail = "contact@greenmarket.com";
      contactPhone = "+254701987654";
    },
    {
      name = "TechHarvest";
      company = "TechHarvest PLC";
      location = "Eldoret";
      cropsBought = ["Maize", "Wheat", "Barley"];
      contactEmail = "support@techharvest.com";
      contactPhone = "+254701456789";
    },
    {
      name = "FarmDirect";
      company = "FarmDirect Ltd.";
      location = "Nairobi";
      cropsBought = ["Tomatoes", "Potatoes", "Carrots"];
      contactEmail = "sales@farmdirect.com";
      contactPhone = "+254701112233";
    },
    {
      name = "AgroConnect";
      company = "AgroConnect Inc.";
      location = "Mombasa";
      cropsBought = ["Onions", "Garlic", "Cabbage"];
      contactEmail = "info@agroconnect.com";
      contactPhone = "+254701445566";
    },
    {
      name = "FreshFields";
      company = "FreshFields Ltd.";
      location = "Nakuru";
      cropsBought = ["Beans", "Maize", "Wheat"];
      contactEmail = "contact@freshfields.com";
      contactPhone = "+254701778899";
    },
  ];

  // Seed buyers helper
  var buyersSeeded = false;

  // Comparison function for ContactMessage by timestamp (newest first)
  module ContactMessage {
    public func compareByTimestampDescending(a : ContactMessage, b : ContactMessage) : Order.Order {
      if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) { #greater } else { #equal };
    };
  };

  module CropScan {
    public func compareByTimestampDescending(a : CropScan, b : CropScan) : Order.Order {
      if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) { #greater } else { #equal };
    };
  };

  // =================== FARMER PROFILES ===================

  /// Register or update a farmer profile (requires user role)
  public shared ({ caller }) func saveCallerUserProfile(profile : FarmerProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    farmerProfiles.add(caller, profile);
  };

  /// Get your own farmer profile
  public query ({ caller }) func getCallerUserProfile() : async ?FarmerProfile {
    farmerProfiles.get(caller);
  };

  /// Get another farmer's profile (by owner or admin)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?FarmerProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    farmerProfiles.get(user);
  };

  /// Get all farmer profiles (admin only)
  public query ({ caller }) func getAllFarmerProfiles() : async [FarmerProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    farmerProfiles.values().toArray();
  };

  // =================== CROP SCANS ===================

  /// Save a new crop scan record (requires token and profile)
  public shared ({ caller }) func recordCropScan(scan : CropScan) : async () {
    if (scan.farmer != caller) {
      Runtime.trap("Forbidden: You can only submit scans for yourself");
    };
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Forbidden: Only registered farmers can submit scans");
    };
    switch (farmerProfiles.get(scan.farmer)) {
      case (null) { Runtime.trap("Can't find farmer profile") };
      case (?_record) {
        let updatedScan = {
          scan with
          timestamp = Time.now();
        };
        cropScans.add(updatedScan);
      };
    };
  };

  /// Get crop scans for a specific farmer
  public query ({ caller }) func getCropScansForFarmer(farmer : Principal) : async [CropScan] {
    if (caller != farmer and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Forbidden: Can only view your own scans");
    };
    cropScans.toArray().filter(func(scan) { scan.farmer == farmer });
  };

  /// Get all crop scans (admin only)
  public query ({ caller }) func getAllCropScans() : async [CropScan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Forbidden: Only admins can view all scans");
    };
    cropScans.toArray();
  };

  // =================== BUYER DIRECTORY ===================

  /// Get all buyers (users only)
  public query ({ caller }) func getBuyers() : async [Buyer] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view buyers");
    };
    if (not buyersSeeded) { seedBuyers() };
    buyers.values().toArray();
  };

  /// Add a new buyer (admin only)
  public shared ({ caller }) func addBuyer(
    name : Text,
    company : Text,
    location : Text,
    cropsBought : [Text],
    contactEmail : Text,
    contactPhone : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Forbidden: Only admins can add buyers");
    };
    if (not buyersSeeded) { seedBuyers() };
    let id = nextBuyerId;
    let newBuyer : Buyer = {
      id;
      name;
      company;
      location;
      cropsBought;
      contactEmail;
      contactPhone;
    };
    buyers.add(id, newBuyer);
    nextBuyerId += 1;
  };

  // Helper function to seed buyers
  func seedBuyers() {
    if (not buyersSeeded) {
      var i = 0;
      while (i < sampleBuyers.size()) {
        let buyerData = sampleBuyers[i];
        let id = nextBuyerId;
        let buyer : Buyer = {
          id;
          name = buyerData.name;
          company = buyerData.company;
          location = buyerData.location;
          cropsBought = buyerData.cropsBought;
          contactEmail = buyerData.contactEmail;
          contactPhone = buyerData.contactPhone;
        };
        buyers.add(id, buyer);
        nextBuyerId += 1;
        i += 1;
      };
      buyersSeeded := true;
    };
  };

  // =================== CONTACT MESSAGES ===================

  /// Send a message to a buyer (requires profile)
  public shared ({ caller }) func sendContactMessage(buyerId : BuyerId, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be registered to send messages");
    };
    if (not buyersSeeded) { seedBuyers() };
    let farmerProfile = switch (farmerProfiles.get(caller)) {
      case (null) { Runtime.trap("Farmer profile not found") };
      case (?profile) { profile };
    };
    let buyer : Buyer = switch (buyers.get(buyerId)) {
      case (null) { Runtime.trap("Buyer not found") };
      case (?b) { b };
    };
    let newMessage : ContactMessage = {
      farmer = caller;
      buyerId;
      message;
      timestamp = Time.now();
      farmerName = farmerProfile.name;
      farmerContactEmail = farmerProfile.contactEmail;
    };
    messages.add(newMessage);
  };

  /// Get all messages for a specific farmer
  public query ({ caller }) func getMessagesForFarmer() : async [ContactMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to view your messages");
    };
    let filteredMessages = messages.toArray().filter(
      func(msg) { msg.farmer == caller }
    );
    filteredMessages.sort(ContactMessage.compareByTimestampDescending);
  };

  /// Get all messages (admin only)
  public query ({ caller }) func getAllMessages() : async [ContactMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Forbidden: Only admins can view all messages");
    };
    messages.toArray().sort(ContactMessage.compareByTimestampDescending);
  };

  // =================== NOTIFICATIONS ===================

  /// Get recent activity for a farmer (profile, recent scans, message count)
  public query ({ caller }) func getDashboardData(principal : Principal) : async DashboardData {
    if (caller != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own dashboard");
    };
    let filteredScans = cropScans.toArray().filter(
      func(scan) { scan.farmer == principal }
    );
    let sortedScans = filteredScans.sort(
      CropScan.compareByTimestampDescending
    );
    let recentScans = Array.tabulate(
      if (sortedScans.size() < 5) { sortedScans.size() } else { 5 },
      func(i) { sortedScans[i] },
    );

    // Use foldLeft to count messages
    let count = messages.toArray().foldLeft(
      0,
      func(count, msg) {
        if (msg.farmer == principal) { count + 1 } else { count };
      },
    );

    {
      farmerProfile = farmerProfiles.get(principal);
      recentScans;
      messageCount = count;
    };
  };

  // =================== AI DISEASE DETECTION ===================

  /// Analyze symptoms and return a diagnosis (simulated)
  public query ({ caller }) func analyzeSymptoms(cropType : Text, symptoms : Text) : async AiDiagnosis {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can analyze symptoms");
    };
    {
      cropType;
      symptoms;
      diagnosis = "Leaf blight detected";
      confidence = 85;
      treatmentAdvice = "Apply fungicide and remove affected leaves";
      preventionTips = "Rotate crops and improve soil drainage";
    };
  };

  // =================== Blob Storage ===================
  public shared ({ caller }) func storeExternalBlob(blob : Storage.ExternalBlob) : async Storage.ExternalBlob {
    blob;
  };

  // =================== HTTP Outcalls ===================
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func fetchExternalData(url : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch external data");
    };
    await OutCall.httpGetRequest(url, [], transform);
  };
};
