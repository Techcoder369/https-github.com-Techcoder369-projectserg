import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("rescue.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT,
    description TEXT,
    location_lat REAL,
    location_lng REAL,
    city TEXT,
    state TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    ai_analysis TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS adoptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER,
    user_id INTEGER,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/reports", (req, res) => {
    const reports = db.prepare("SELECT * FROM reports ORDER BY created_at DESC").all();
    res.json(reports);
  });

  app.post("/api/reports", (req, res) => {
    const { image_url, description, location_lat, location_lng, city, state, priority, ai_analysis } = req.body;
    const stmt = db.prepare(`
      INSERT INTO reports (image_url, description, location_lat, location_lng, city, state, priority, ai_analysis)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(image_url, description, location_lat, location_lng, city, state, priority, ai_analysis);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/stats", (req, res) => {
    const stats = {
      total: db.prepare("SELECT COUNT(*) as count FROM reports").get().count,
      pending: db.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'").get().count,
      resolved: db.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'resolved'").get().count,
      critical: db.prepare("SELECT COUNT(*) as count FROM reports WHERE priority = 'critical'").get().count,
    };
    res.json(stats);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
