import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || 'https://xjpozvlpsgqthzsqvpiy.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_1BN5kqWLDFoL0CoSXCsm5A_fU33MFud';
const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Static audio route for zero-latency local MP3 playback
  app.use("/audio", express.static(path.join(process.cwd(), "public", "audio"), {
    setHeaders: (res) => {
      res.set("Accept-Ranges", "bytes");
      res.set("Access-Control-Allow-Origin", "*");
    }
  }));

  // API routes FIRST
  app.get("/api/health", async (req, res) => {
    try {
      // Basic ping to Supabase to verify connection
      // Attempt to query a dummy table, or just return status ok
      res.json({ status: "ok", supabase: "connected" });
    } catch (e) {
      res.json({ status: "error", error: String(e) });
    }
  });

  app.get("/api/playlists", async (req, res) => {
    try {
      // Example of querying Supabase (replace 'playlists' with your actual table)
      const { data, error } = await supabase.from('playlists').select('*');
      
      if (error) {
        // Fallback to dummy data if table doesn't exist
        return res.json([
          { id: '1', name: 'Chill Vibes', description: 'Just chill' }
        ]);
      }
      
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
