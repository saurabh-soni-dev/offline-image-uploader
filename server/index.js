const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Upload folder
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Simple JSON database
const DB_FILE = path.join(__dirname, "db.json");
let db = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE)) : [];

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Upload API
app.post("/upload", upload.single("image"), (req, res) => {
  try {
    const metadata = JSON.parse(req.body.metadata || "{}");
    const file = req.file;

    const remoteId = Date.now() + "-" + Math.random().toString(36).slice(2, 8);

    const record = {
      remoteId,
      clientId: metadata.id,
      caption: metadata.caption,
      path: file.filename,
      createdAt: new Date().toISOString(),
      modifiedAt: metadata.modifiedAt,
      version: metadata.version,
    };

    db.push(record);
    saveDB();

    return res.json({ ok: true, remoteId });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// List all uploaded items
app.get("/list", (req, res) => {
  res.json({ ok: true, items: db });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
