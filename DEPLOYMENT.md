# SchemeSaathi — Deployment Guide 🚀

SchemeSaathi is a production-ready Next.js 14 application with React 18, Tailwind CSS, Leaflet Maps, and WebGL LightRays.

---

## 📦 Deployment Archive

A ready-to-deploy zip archive (excluding `node_modules` and cache) is located at:
`C:\Users\kalpe\.gemini\antigravity\scratch\schemesaathi_deploy.zip`

---

## ⚡ Option 1: Deploy to Vercel (Recommended & Easiest)

Vercel is the creator of Next.js and provides zero-config automatic deployments.

### Method A: Via Vercel CLI
```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. In the project folder, run:
vercel
```

### Method B: Via GitHub & Vercel Dashboard
1. Push this codebase to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial production commit"
   git remote add origin https://github.com/YOUR_USERNAME/schemesaathi.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository.
4. Click **Deploy**. Vercel will automatically build and deploy the app with global CDN caching.

---

## 🐳 Option 2: Deploy with Docker (Render / Railway / AWS / GCP)

The included `Dockerfile` builds a lightweight production container.

```bash
# 1. Build the Docker container image
docker build -t schemesaathi .

# 2. Run the container on port 3000
docker run -p 3000:3000 schemesaathi
```

---

## 🖥️ Option 3: Traditional Linux VPS / Self-Hosted (PM2 + NGINX)

```bash
# 1. Install dependencies
npm ci

# 2. Build production assets
npm run build

# 3. Start production server with PM2
npm install -g pm2
pm2 start npm --name "schemesaathi" -- start -- -p 3000
```

### NGINX Reverse Proxy Example (`/etc/nginx/sites-available/schemesaathi`):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔑 Environment Variables (Optional)

Configure these in your hosting dashboard if you want live external APIs:
- `GROQ_API_KEY`: *(Optional)* For live Llama 3.3 AI recommendations. (Built-in offline AI rule engine is active by default).
- `NEXT_PUBLIC_MAPBOX_TOKEN`: *(Optional)* Mapbox style token.
- `NEXT_PUBLIC_SUPABASE_URL`: *(Optional)* Supabase PostgreSQL URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: *(Optional)* Supabase public API key.
