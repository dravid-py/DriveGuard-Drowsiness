# DriveGuard

> **Stay Awake. Stay Focused.**

DriveGuard is a privacy-first browser application designed to help **students**, **software developers**, and **working professionals** maintain attentiveness during extended computer sessions. It analyzes visual indicators associated with drowsiness—such as prolonged eye closure—locally in the browser using client-side computer vision and provides timely alerts.

---

## 🎯 Purpose & Primary Users

DriveGuard is built specifically for desktop and laptop computer workstations.

1. **Students & Online Learners:** Staying alert during late-night study sessions, remote lectures, and exam prep.
2. **Software Developers:** Sustaining focus during multi-hour programming and debugging sprints.
3. **Working Professionals:** Maintaining vigilance during intensive screen-based work (spreadsheets, writing, administration).
4. **Knowledge Workers:** Combating afternoon fatigue and prolonged screen lethargy.

> **Important Notice:** DriveGuard is an awareness and assistance tool. It is **not** a medical device, does **not** provide medical diagnosis, and does **not** guarantee fatigue prevention or accident prevention. It does not replace proper sleep, ergonomics, and regular screen breaks.

---

## 🛡️ Privacy by Design

* **Zero Video Uploads:** Your webcam video stream is processed frame-by-frame entirely inside your local browser tab using WebAssembly and GPU acceleration.
* **No Server Storage:** No camera frames, face photos, landmark coordinate streams, or session data are ever transmitted to or stored on external servers.
* **On-Device Storage:** User preferences and session metrics are stored strictly within your browser's `localStorage`.

---

## ⚙️ How It Works (5-Stage Pipeline)

```
Webcam Feed (Local Browser)
       ↓
Face Landmark Detection (@mediapipe/tasks-vision)
       ↓
Eye Openness Analysis (3D Normalized Eye Aspect Ratio)
       ↓
Temporal Drowsiness Engine (Blink vs. Prolonged Closure State Machine)
       ↓
Alert System (Visual Cues + Native Web Audio Chimes)
       ↓
Local Session Report & Timeline
```

### Detection Logic & State Machine
* **Normal Blink ($< 1500\text{ ms}$):** Filtered out safely—no false alerts or event triggers.
* **Prolonged Closure ($\ge 1500\text{ ms}$):** Enters warning state and flags a long eye-closure event.
* **Confirmed Drowsiness ($\ge 2500\text{ ms}$):** Triggers full-screen visual alert, plays Web Audio chime, logs a drowsiness event, and enforces a 5-second cooldown upon acknowledgment.
* **Face Missing / Occluded:** Resets temporal closure timers to prevent false triggers.
* **Tab Visibility:** Automatically pauses detection when the browser tab is hidden.

---

## 🖥️ Operating Modes

* **Study Mode:** Tailored for students during prolonged reading, textbook review, and remote learning.
* **Work Mode:** Optimized for software engineers, data analysts, and knowledge workers on workstation shifts.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+ recommended)
* A modern Chromium-based browser (Chrome, Edge, Brave) with webcam access

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/DriveGuard.git
cd DriveGuard

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open `http://localhost:5173/` in your browser.

### Building for Production

```bash
npm run build
```

The production bundle will be generated in `dist/`.

---

## 🛠️ Technology Stack

* **UI Framework:** React 19 + TypeScript
* **Build Tool:** Vite 8
* **Styling:** Tailwind CSS (Charcoal / Emerald / Amber dark theme)
* **Routing:** React Router 7
* **Computer Vision:** `@mediapipe/tasks-vision` (WebAssembly Face Landmarker)
* **Audio:** Browser Native Web Audio API (zero external audio dependencies)
* **Icons:** Lucide React

---

## 📋 System Requirements & Limitations

* **Lighting:** Adequate front-facing ambient lighting produces the best landmark detection accuracy. Avoid strong backlights or extreme shadows.
* **Webcam Alignment:** Position camera centered at eye or upper monitor level.
* **Eyewear:** Tinted lenses or heavy frames may interfere with eye landmark coordinates.
* **Awareness Reminder:** Always prioritize genuine physical rest and ergonomic breaks.

---

## 📄 License

MIT License. Designed and engineered for private, local computer session vigilance.
