# 🎴 Wikigacha Bot

![Node.js](https://img.shields.io/badge/node.js-24-green)
![Playwright](https://img.shields.io/badge/Playwright-Patchwright-orange)
![Docker](https://img.shields.io/badge/Docker-WIP-2496ED)

Automation bot for **https://wikigacha.com** that automatically opens packs, manages saves, and maintains available pack balance.

The bot uses [**Patchright**](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright), Stealth version of Playwright to interact with the game just like a real user while handling dialogs, backups, and imports automatically bypassing Cloudflare Turnstile.

# 📽️ Demo

In this demo you can see the bot running in real time.

At the beginning, the **pack balance is reset**, allowing the bot to continue opening packs.
Shortly after, the **automatic backup system triggers**, exporting the current progression to the save file `wikigachasave.json` so the user can later explore their Collection.

This demonstration highlights the **speed of the pack opening process**, the **pack reset feature**, and the **auto-save mechanism** working together.

![wikigacha](https://github.com/user-attachments/assets/1354fa78-d510-4ee5-9ec4-02af61272210)


# 📂 Project Structure

```
wikigacha-bot
├── wikigacha.js
├── package.json
├── package-lock.json
├── Dockerfile
└── patchright_profile/
```

## 📦 Demo Save

Want to explore a large collection without running the bot for hours?

You can download **my current save file** used in the demo.

**Clic Here** ⬇️
[![Download Save](https://img.shields.io/badge/download-demo_save-blue)](https://github.com/Thomega35/WikigachaBot/releases/latest)

![Unique Cards](https://img.shields.io/badge/unique_cards-177,555-purple)
![Total Pulls](https://img.shields.io/badge/total_pulls-35,992-orange)
![Collection](https://img.shields.io/badge/collection-2.63%25-blue)

### How to use

1. Download `wikigachasave.json`
2. Place it at the **root of the project**
3. Delete the `patchright_profile` folder if it already exists
4. Start the bot — the save will be **automatically loaded**

---

# 🚀 Installation

## 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/wikigacha-bot.git
cd wikigacha-bot
```

---

## 2️⃣ Paste existing save (Optional)

Export your `wikigachasave.json` at the root of the project

```
wikigacha-bot
└── wikigachasave.json
```

---

## 3️⃣ Install dependencies

```bash
npm install
```

---

## 4️⃣ Install Chrome browser (if needed)

```bash
npx patchright install chrome
```

---

## 5️⃣ Run the bot

```bash
node ./wikigacha.js
```

The bot will:

1. Open the browser
2. Navigate to Wikigacha
3. Automatically open packs
4. Export backups periodically
5. Restore saves if needed

---

# 🐳 Docker Usage

The project includes a **Dockerfile** with a virtual display environment to run the bot in containers.

## Build the image

```bash
docker build -t wikigacha-bot .
```

---

## Run the container

```bash
docker run wikigacha-bot
```

This mounts the browser profile so login sessions persist.

---

# ✨ Features

🎴 **Automatic pack opening**  
♻️ **Auto save / restore system**  
📦 **Backup export every 2 minutes**  
🤖 **Dialog & alert auto-handling**  
🧠 **Smart retry system for navigation**  
🧀 **Infinite pack throught IndexedDB edit**  
🐳 **Docker support with virtual display (WIP)**

---

# ⚙️ Tech Stack

- **Node.js**
- **Patchright**
- **Chrome**
- **Docker**
- **XVFB** for virtual display

---
