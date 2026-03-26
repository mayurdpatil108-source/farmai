import { Facebook, Instagram, Leaf, Mail, Phone, Twitter } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer
      style={{ background: "oklch(0.24 0.07 155)" }}
      className="text-white"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-2xl mb-3">
              <Leaf className="w-6 h-6 text-green-400" />
              FarmAI
            </div>
            <p className="text-sm" style={{ color: "oklch(0.75 0.04 155)" }}>
              Empowering farmers with AI-powered crop intelligence and buyer
              connections.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <div className="space-y-2">
              <a
                href="mailto:hello@farmai.app"
                className="flex items-center gap-2 text-sm"
                style={{ color: "oklch(0.75 0.04 155)" }}
              >
                <Mail className="w-4 h-4" />
                hello@farmai.app
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 text-sm"
                style={{ color: "oklch(0.75 0.04 155)" }}
              >
                <Phone className="w-4 h-4" />
                +1 (234) 567-890
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.32 0.08 155)" }}
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.32 0.08 155)" }}
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.32 0.08 155)" }}
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div
          className="border-t pt-6 text-center text-sm"
          style={{
            borderColor: "oklch(0.32 0.08 155)",
            color: "oklch(0.60 0.04 155)",
          }}
        >
          © {year}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
