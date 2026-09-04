# 🎓 Amelia Dwi Oktaviani - Graduation & Thesis Defense Celebration Web Application

A dedicated, romantic interactive web application created by **Ricki** for **Amelia Dwi Oktaviani, S.Ak.** to celebrate passing her Thesis Defense & Yudisium in **Accounting (Akuntansi)** at **Universitas Esa Unggul (Kampus Bekasi)**, and counting down to her **Grand Graduation on 6 October 2026 at Hotel Pullman Jakarta Barat (Podomoro City)**.

---

## ✨ Features & Interactive Modules

- **Graduation Countdown Timer**: Live countdown (Days, Hours, Minutes, Seconds) targeting Grand Graduation in October 2026.
- **Yudisium Passed Celebration**: Reflected status across Hero, Timeline, and Roadmap sections (**Yudisium Officially Passed! 🎓**).
- **Floating Mini Audio Player**: Persistent bottom-left music controller sync'd with local tracks (Ava Max feat. NCT 127, NCT 127, Bruno Mars).
- **Interactive Campus Commute Map**: Built with **Leaflet.js**, sharp **CARTO Voyager tiles**, and **OSRM real-road routing API** (~9 km route from Harapan Jaya, Bekasi Utara to UEU Kampus Bekasi).
- **Photo Lightbox Gallery**: Bento-grid photo gallery with full-screen lightbox image viewer.
- **Dynamic Wish Wall & Guestbook**: Interactive form that saves wishes in browser `localStorage` and renders them on the Wish Wall, while also generating a direct WhatsApp share link.
- **WebGL Shader Ambient Background**: Rose-gold floating petal shader canvas.
- **Interactive Envelope & Secret Letter**: 3D tilt envelope revealing a heartfelt letter upon click.
- **Mobile Responsive Navigation**: Custom hamburger drawer menu for mobile screens.
- **Visual Effects**: Confetti bursts, floating ambient hearts, scroll progress bar, 3D tilt cards, back-to-top button.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Tailwind CSS (CDN with custom Material 3 color palette & fonts)
- **JavaScript Engine**: Modular ES6 JS (`assets/js/main.js`)
- **Maps**: Leaflet 1.9.4, CARTO Voyager Tiles, OSRM Routing Engine
- **Fonts & Icons**: Google Fonts (`Playfair Display`, `Inter`), Google Material Symbols Outlined
- **Graphics**: WebGL GLSL Shaders (Fragment & Vertex Shaders)

---

## 🚀 How to Run Locally (Laragon / Web Server)

1. Clone or place this project in your Laragon web directory (e.g., `C:\laragon\www\amelia`).
2. Start Apache/Nginx in Laragon.
3. Open your browser and navigate to:
   ```
   http://localhost/amelia/
   ```
   or `http://amelia.test` if Laragon auto-virtualhost is enabled.

---

## 📁 File Structure

```
amelia/
├── index.html                 # Main celebration web page
├── README.md                  # Project documentation
├── assets/
│   ├── js/
│   │   └── main.js            # Unified application JavaScript engine
│   ├── audio/                 # Local MP3 tracks
│   └── img/                   # Image assets
├── hero.jpg                   # Hero background photo
├── amel.jpeg                  # Gallery photo 1
├── gallery1.jpg               # Gallery photo 2
├── gallery2.jpg               # Gallery photo 3
└── gallery3.jpg               # Gallery photo 4
```

---

*Crafted with ❤️ by Ricki (2026)*

