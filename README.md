# Ratul Krishna Mojumder — Portfolio

## 🚀 Setup Instructions (বাংলায়)

### Step 1: Firebase Setup

1. **Firebase Console** → https://console.firebase.google.com
2. "Create a project" → Project name দাও (e.g. `ratul-portfolio`)
3. Google Analytics **skip** করো
4. Project তৈরি হলে **Firestore Database** → Create Database → **Start in test mode** → Next → Enable
5. বাম মেনু থেকে ⚙️ (Project Settings) → **Your apps** → Web icon `</>` click করো
6. App nickname দাও → Register app
7. `firebaseConfig` টা copy করো

### Step 2: Firebase Config যোগ করো

`src/firebase.js` ফাইল খোলো এবং `YOUR_API_KEY` etc. গুলো তোমার real config দিয়ে replace করো:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "ratul-portfolio.firebaseapp.com",
  projectId: "ratul-portfolio",
  storageBucket: "ratul-portfolio.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 3: GitHub এ Code দাও

1. GitHub এ নতুন repo তৈরি করো (e.g. `portfolio`)
2. এই folder টা push করো:
```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

### Step 4: Photo যোগ করো

- তোমার photo এর নাম `Ratul.jpeg` রাখো (অথবা যেকোনো নাম)
- GitHub repo এর root এ upload করো
- Dev login করে Home page → Photo Settings → তোমার GitHub username, repo name, branch, file name দাও

### Step 5: CV যোগ করো

- CV টা Google Drive এ upload করো
- Share → Anyone with link can view
- Link থেকে file ID copy করো: `drive.google.com/file/d/**FILE_ID**/view`
- Dev login করে CV page → Edit CV Links → দুটো link দাও:
  - Preview: `https://drive.google.com/file/d/FILE_ID/preview`
  - Download: `https://drive.google.com/uc?export=download&id=FILE_ID`

### Step 6: Netlify Deploy (Recommended — Mobile data এ কাজ করে!)

1. https://netlify.com → Sign up (GitHub দিয়ে)
2. "Add new site" → "Import from Git" → GitHub → তোমার repo select করো
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. "Deploy site" → কিছুক্ষণ পরে live হয়ে যাবে! 🎉
5. চাইলে custom domain ও দিতে পারো

---

## 🔐 Dev Login

Password: **092418**

Dev mode এ যা করা যাবে:
- ✅ Photo edit/zoom/drag
- ✅ Education add/edit/delete
- ✅ Awards add/edit/delete  
- ✅ Skills add/edit/delete
- ✅ Quick Links (switches) add/edit/delete
- ✅ Projects add/edit/delete
- ✅ Footer contacts add/edit/delete
- ✅ CV links set করা
- ✅ Icon search করে যেকোনো icon লাগানো

---

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── App.jsx          — Router
│   ├── AuthContext.jsx  — Dev login state
│   ├── firebase.js      — Firebase config (তোমার config দাও)
│   ├── index.css        — Global styles
│   ├── main.jsx         — Entry point
│   ├── Navbar.jsx       — Top navigation
│   ├── Footer.jsx       — Contact section
│   ├── IconSearch.jsx   — MDI icon picker
│   ├── Home.jsx         — Home page (photo, education, awards)
│   ├── CV.jsx           — CV viewer
│   ├── Skills.jsx       — Skills + Quick links
│   ├── Research.jsx     — Research (placeholder)
│   └── Projects.jsx     — Projects
├── index.html
├── vite.config.js
├── netlify.toml         — Netlify SPA routing
└── package.json
```

---

## 🎨 Design Features

- Dark glassmorphism theme (EEE/Tech বায়িব!)
- Orbitron font (circuit board feel)
- Animated gradient hero section
- Spinning ring photo frame
- Glowing progress bars
- Particle/orb background effects
- Fully responsive mobile design
- Smooth animations & hover effects

---

Made with ⚡ by Claude for Ratul Krishna Mojumder
