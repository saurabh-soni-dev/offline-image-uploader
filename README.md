# 📷 Offline Image Uploader — React Native & Node.js

This project demonstrates an **offline-first React Native app** that allows users to capture or pick images, add captions, and view them offline. When online, the app syncs images and metadata with a minimal Node.js server so they are available across devices.

---

## 🚀 Features
- 📸 Take or pick a photo from the gallery  
- 📝 Save with a short caption  
- 📴 Fully offline support (capture, save, view without internet)  
- 🔄 Sync images and metadata when online  
- ⚡ Conflict resolution (latest `modifiedAt` wins)  
- 🗄️ Minimal Express server for uploads & listing images  
- 📋 FlatList optimization for smooth rendering  

---

## 📂 Project Structure
offline-image-uploader/
│── client/
│ ├── App.tsx
│ ├── components/
│ │ └── PhotoCard.tsx
| |-- screens/
| | └── HomeScreen.tsx
│ |-- services/
│ └── api.ts
| └── storage.ts
| └── sync.ts
│
│── server/ 
│ ├── index.js
│ ├── uploads/
│
└── README.md

---

## 🛠 Setup Instructions

### 1️⃣ Clone Repo
```bash
git clone https://github.com/your-username/offline-image-uploader.git
cd offline-image-uploader

Server Setup
cd server
npm init -y
npm install express multer cors
node index.js

Server runs at: http://localhost:3000
```

APIs:
POST /upload → Uploads image + metadata
GET /list → Returns all uploaded items

Client Setup:
cd client
npm install
npm run start

npm run android
# or
npm run ios


📱 React Native Client (Key Decisions):
AsyncStorage → Store images & metadata locally while offline
UUID → Generate unique IDs for offline entries
NetInfo → Detect network status & trigger sync
FlatList → Optimized for performance
Conflict Handling → If the same image exists both locally & remotely, the version with the latest modifiedAt timestamp is kept

🌐 Minimal Server
Built with Express.js
Stores images in the/uploads folder
Handles multipart/form-data via Multer

🔮 Possible Enhancements:
User authentication
Image compression before upload
Background sync with retry logic
Cloud storage integration (AWS S3, Firebase Storage)
