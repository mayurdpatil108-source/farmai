# FarmAI

## Current State
New project. Empty backend and frontend scaffolding only.

## Requested Changes (Diff)

### Add
- Farmer registration and login (authentication)
- AI crop disease detection: upload or capture a photo, call an AI service to identify disease, return diagnosis + treatment advice
- Crop buyers directory: list of buyers with name, crops they buy, location, contact info
- Farmer dashboard: shows latest crop scan results, field status, recent messages
- Contact form for farmers to reach buyers
- Blob storage for uploaded crop images
- Camera support for in-browser photo capture

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Select components: authorization, blob-storage, camera, http-outcalls
2. Generate Motoko backend: farmer profiles, crop scan records (store image ref + AI result), buyer directory (seeded), buyer contact messages
3. Build frontend: navbar with login, hero section, dashboard, crop disease detection page (camera + upload), buyers directory with search, contact modal, footer
