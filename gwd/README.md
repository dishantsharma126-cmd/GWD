# GWD — Grind With Dishant 🔥
> Your 90-Day Transformation Tracker

---

## 🚀 Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Recharts + Framer Motion
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas (free cloud DB)
- **Charts**: Recharts (area, bar, radar)
- **Excel Export**: SheetJS (xlsx)

---

## 📁 Project Structure
```
gwd/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/   (Sidebar, TopBar, SplashScreen, StatCard, CircularProgress)
│   │   ├── pages/        (Dashboard, TodayPage, CalendarPage, RoutinesPage, GrowthPage, GoalsPage)
│   │   └── services/     (api.js)
│   └── ...
├── backend/           # Express API
│   ├── models/        (Goal, Routine, DayLog)
│   ├── routes/        (goals, routines, logs)
│   └── server.js
└── README.md
```

---

## ⚡ Local Setup

### 1. MongoDB Atlas (Free Cloud Database)
1. Go to https://cloud.mongodb.com → Sign up free
2. Create a **free M0 cluster**
3. Under "Database Access" → Add user (remember username/password)
4. Under "Network Access" → Add IP: `0.0.0.0/0` (allow all)
5. Click "Connect" → "Drivers" → copy the connection string

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env — paste your MongoDB URI
npm install
npm run dev      # runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # runs on http://localhost:5173
```

Open http://localhost:5173 → See the GWD splash screen → Click "LET'S DIVE INTO THE GRIND MODE, SIR"

---

## 🌐 LIVE DEPLOYMENT (Your Own Domain)

### Option A: Render (FREE — Recommended for beginners)

**Deploy Backend:**
1. Go to https://render.com → Sign up with GitHub
2. Push your `gwd/` folder to a GitHub repo
3. New → Web Service → Connect repo
4. **Root Directory**: `backend`
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. Add Environment Variables:
   - `MONGO_URI` = your MongoDB Atlas URI
   - `FRONTEND_URL` = https://yourdomain.com
8. Deploy → copy your backend URL (e.g. `https://gwd-api.onrender.com`)

**Deploy Frontend:**
1. New → Static Site → Same repo
2. **Root Directory**: `frontend`
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist`
5. Environment Variable: `VITE_API_URL` = `https://gwd-api.onrender.com`

> Update `frontend/src/services/api.js` line 3:
> `baseURL: import.meta.env.VITE_API_URL || '/api'`

### Option B: VPS (Hostinger / DigitalOcean) with Custom Domain

**Step 1 — Buy domain** (GoDaddy / Namecheap / Hostinger — ~₹500/year)

**Step 2 — Get a VPS** (Hostinger KVM1 — ~₹200/month OR DigitalOcean Droplet $6/mo)

**Step 3 — SSH into your server**
```bash
ssh root@YOUR_SERVER_IP
```

**Step 4 — Install dependencies**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
npm install -g pm2
```

**Step 5 — Upload your code**
```bash
# On your local machine:
scp -r gwd/ root@YOUR_SERVER_IP:/var/www/gwd
```

**Step 6 — Start backend with PM2**
```bash
cd /var/www/gwd/backend
cp .env.example .env && nano .env   # paste your MONGO_URI
npm install
pm2 start server.js --name gwd-api
pm2 save && pm2 startup
```

**Step 7 — Build frontend**
```bash
cd /var/www/gwd/frontend
npm install
npm run build
```

**Step 8 — Configure Nginx**
```bash
nano /etc/nginx/sites-available/gwd
```
Paste:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/gwd/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
ln -s /etc/nginx/sites-available/gwd /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx
```

**Step 9 — Point domain to server**
- In your domain registrar DNS settings:
  - Add **A Record**: `@` → `YOUR_SERVER_IP`
  - Add **A Record**: `www` → `YOUR_SERVER_IP`
- Wait 5-30 min for DNS propagation

**Step 10 — Free SSL (HTTPS)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Your site is now live at `https://yourdomain.com` 🎉

---

## 📊 Features
- ✅ Animated splash screen with GWD branding
- ✅ Daily routine tracker with points system
- ✅ Calendar heatmap (green = 100%, orange = 80%+, red = 50%+)
- ✅ Growth graphs (area chart, bar chart, radar chart)
- ✅ Excel export of all progress data
- ✅ Goal management (set any duration, change anytime)
- ✅ Mood tracker + daily journal
- ✅ Streak counter
- ✅ MongoDB persistence

---

## 🔥 Usage Flow
1. First visit → Splash screen → Click "LET'S DIVE INTO THE GRIND MODE, SIR"
2. Go to **Goals** → Create your goal (e.g. "90-Day Transformation")
3. Go to **Routines** → Add all your daily activities with times + points
4. Every day → Go to **Today's Grind** → Check off completed routines → Save
5. Check **Calendar** to see your history heatmap
6. Check **Growth Graph** → Export Excel for deep analysis

---

Built with 🔥 for Dishant | GWD (grind_with_dishant)
