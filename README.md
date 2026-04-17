# Happy Anniversary — Anoj Sir & Sandhya Ma'am

A premium, emotional, single-page anniversary tribute built with vanilla **HTML, CSS & JavaScript**. Cinematic dark theme with gold + soft pink accents, glassmorphism, smooth scroll animations, floating hearts, sparkle background, auto-playing soundtrack, lightbox gallery, typing-effect message, QR code to the live domain, and a confetti finale.

> A heartfelt digital gift from **Manish** for his mentor.

**Live concept domain:** [sandhyanooj.life](https://sandhyanooj.life)

---

## Live Demo

Just open `index.html` in any modern browser, or host the folder on:

- **GitHub Pages** (recommended — free)
- **Netlify Drop**
- **Vercel**
- Any static host

---

## File Structure

```
anooj_sir_anniversary/
├── index.html                       # All sections + QR + audio
├── styles.css                       # Premium theme, glass cards, timeline, masonry, QR card
├── script.js                        # AOS, locked autoplay music, hearts, sparkles, lightbox, typing, QR, confetti
├── happy_anniversary.mp3            # Background soundtrack (auto-plays, looped, no controls)
├── details.txt                      # Family details (provided)
├── .gitignore
├── README.md
│
├── anooj sandhya.jpeg               # Hero background (the couple)
├── anooj anaya.jpeg                 # Anoj Sir card
├── sandhya anaya.jpeg               # Sandhya Ma'am card
├── anaya.jpeg                       # Anaya card
├── ayansh.jpeg                      # Ayansh card
├── all family photo.jpeg
├── last anniversary family photo.jpeg
├── last anniversary photo.jpeg
├── last anniversary photo 2.jpeg
├── last anniversary photo 3.jpeg
├── last anniversary photo 4.jpeg
├── anaya 2.jpeg
├── anaya ayansh.jpeg
├── anaya car window.jpeg
├── ayansh 2.jpeg
├── sandhya ayansh anaya.jpeg
└── sandhya ayansh anaya 2.jpeg
```

---

## Sections

| # | Section            | Highlights                                                                  |
|---|--------------------|-----------------------------------------------------------------------------|
| 1 | **Hero**           | Full-screen Ken-Burns couple photo, animated headline, gold/pink gradient   |
| 2 | **Love Story**     | Vertical timeline with glass cards, alternating left/right, scroll reveal   |
| 3 | **Family**         | 4-card grid: Anoj Sir, Sandhya Ma'am, Anaya, Ayansh                         |
| 4 | **Memories**       | Masonry gallery, hover zoom + glow, click-to-open lightbox (← → / Esc)      |
| 5 | **Special Message**| Glass card, typing effect for Manish's note, "Great Vibes" handwritten sign |
| 6 | **Visit (QR)**     | Polaroid-style QR card linking to **sandhyanooj.life**                      |
| 7 | **Forever Together**| Confetti on view + celebrate button, footer credit                         |

---

## Background Music

The page plays `happy_anniversary.mp3` automatically on load — looped, with **no UI controls** (no play/pause).

> ⚠ Browsers block autoplay until the user interacts with the page once.
> The script handles this gracefully: it tries autoplay first, and if blocked, automatically starts the song on the **first scroll, click, key press, or touch**. The audio element itself is invisible.

To replace the music, just swap the file `happy_anniversary.mp3` with another MP3 of the same name (or update the `<source>` in `index.html`).

---

## QR Code

The "Visit Your Special Page" section renders a QR code (generated client-side via `qrcodejs`) that links to **https://sandhyanooj.life** — the personalized anniversary domain. Anyone can scan it from their phone camera.

Change the URL by editing the `text:` field in `initQRCode()` inside `script.js`.

---

## Premium Touches

- Floating hearts drift up subtly across the screen
- Twinkling gold/pink sparkle canvas (uses devicePixelRatio for crispness)
- Glassmorphism cards with gradient borders
- Animated gradient text for names & section titles
- Smooth scroll + AOS reveal animations
- Auto-playing locked background music
- Preloader with pulsing heart
- Mobile-first responsive layout
- Polaroid-style QR card with subtle tilt + hover straighten
- Multi-burst confetti on the finale
- `prefers-reduced-motion` fully respected

---

## Run Locally

The site is fully static — **no build step required**.

### Option 1 — Just double-click
Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2 — Local server (recommended; ensures audio + QR load cleanly)

From the project folder (PowerShell / Terminal):

```powershell
python -m http.server 8080
```

Then open: <http://localhost:8080>

Or with Node:

```bash
npx serve .
```

---

## Push to GitHub

From this folder:

```powershell
git init
git add .
git commit -m "Initial commit: Anoj & Sandhya anniversary tribute"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### Enable GitHub Pages

1. Open the repo on GitHub → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** · Folder: **/ (root)**
4. Save — your site will be live at `https://<your-username>.github.io/<repo-name>/`

---

## Customization

- **Replace music**: drop a new MP3 named `happy_anniversary.mp3` (or update the `<source>` in `index.html`).
- **Edit message**: update the `lines` array inside `initTyping()` in `script.js`.
- **Edit timeline / family text**: just edit the relevant blocks in `index.html`.
- **Change accents**: tweak `--gold`, `--pink`, etc. in `:root` of `styles.css`.
- **Change QR target**: edit the URL in `initQRCode()` in `script.js`.

---

Made with ❤ for **Anoj Sir & Sandhya Ma'am**.
