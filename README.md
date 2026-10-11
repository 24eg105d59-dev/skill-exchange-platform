# Skill Exchange Platform (Peer-to-Peer Learning)

A full-stack web application designed for students to share and learn skills through a peer-to-peer (P2P) reciprocal learning environment. The platform connects students with complementary abilities (e.g., student A teaches Python and learns UI/UX, while student B teaches UI/UX and learns Python), removing financial barriers to skill development.

---

## 🌟 Key Features

1. **Smart Reciprocal Matchmaker ("Golden Swaps")**
   - Automatically cross-matches skills offered against skills desired.
   - Computes compatibility score based on reciprocal alignment, schedule overlap, and trust ratings.
   - Supports 2-way swaps as well as 1-way mentorship search.

2. **Skill Profiles & Schedule Management**
   - Profile with bio, university credentials, offered skills with proficiency levels (Beginner, Intermediate, Advanced, Expert), and desired learning goals.
   - Weekly availability matrix for scheduling sessions.

3. **Learning Requests & Session Scheduling**
   - Propose 1-on-1 skill swaps with custom messages and preferred dates.
   - Accepting requests automatically provisions a virtual meeting room (`https://meet.jit.si/...`).
   - Track scheduled, in-progress, and completed sessions.

4. **Dual-Sided Ratings, Reviews & Peer Trust Score**
   - Post-session 1–5 star reviews with endorsements (Clear Explanations, Super Patient, Punctual, etc.).
   - Dynamically recalculated Peer Trust Score (out of 5.0).

5. **Learning Progress & Reciprocity Tracking**
   - Track hours taught vs. hours learned to ensure balanced give-and-take.
   - Unlock badges: *Student Member*, *First Exchange*, *Knowledge Mentor*, *Master Educator*, *Reciprocal Champion*, *5-Star Peer*.
   - Milestones checklist for personal growth.

6. **Administrative Module & Safety Center**
   - Real-time platform analytics: total users, active sessions, total hours exchanged, and popular skills.
   - Moderation tools: suspend or reinstate accounts.
   - Safety report queue to resolve peer disputes and inappropriate conduct.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons
- **Backend**: Node.js, Express.js REST API, JSONWebToken (JWT), bcryptjs
- **Database**: Dual-mode architecture:
  - Zero-config local JSON persistence (`database.json`) — works out of the box with zero external dependencies.
  - MongoDB Mongoose ready (via optional `MONGO_URI` in `.env`).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm

### 2. Quick Start

From the root project directory (`skill-exchange-platform`):

```bash
# Install backend dependencies
npm run install:server

# Install frontend dependencies
npm run install:client

# Seed the database with demo students, sessions, and reviews
npm run seed

# Start the Backend Server (runs on http://localhost:5000)
npm run server

# In another terminal, start the Frontend Client (runs on http://localhost:3000)
npm run client
```

### 3. Pre-Seeded Test Accounts

Use the **Demo Switcher** in the top navigation or log in with any of these credentials:

| Name | Email | Password | Role & Skill Pair |
| :--- | :--- | :--- | :--- |
| **Aarav Patel** | `aarav@skillexchange.edu` | `student123` | Offers **Python** • Desires **UI/UX & Figma** |
| **Maya Chen** | `maya@skillexchange.edu` | `student123` | Offers **UI/UX & Figma** • Desires **Python** *(Perfect Swap with Aarav!)* |
| **Liam Smith** | `liam@skillexchange.edu` | `student123` | Offers **React.js** • Desires **Spanish** |
| **Sofia Rodriguez** | `sofia@skillexchange.edu` | `student123` | Offers **Spanish** • Desires **React.js** *(Perfect Swap with Liam!)* |
| **Elena Rostova** | `elena@skillexchange.edu` | `student123` | Offers **Algorithms (C++)** • Desires **Public Speaking** |
| **Marcus Johnson** | `marcus@skillexchange.edu` | `student123` | Offers **Public Speaking** • Desires **Algorithms** *(Perfect Swap with Elena!)* |
| **System Admin** | `admin@skillexchange.edu` | `admin123` | Platform Administrator & Safety Hub |

---

## 📁 Project Architecture

```
skill-exchange-platform/
├── server/
│   ├── config/
│   │   └── db.js            # Dual-mode database layer with atomic file persistence
│   ├── middleware/
│   │   └── auth.js          # JWT authentication and admin guard
│   ├── routes/
│   │   ├── auth.js          # Registration, login, and current user
│   │   ├── users.js         # Profile management and learning progress
│   │   ├── match.js         # Reciprocal matchmaking engine & skill exploration
│   │   ├── requests.js      # Learning proposals and state changes
│   │   ├── sessions.js      # Session lifecycle, virtual rooms, completion
│   │   ├── reviews.js       # Star ratings, endorsements, trust score
│   │   ├── admin.js         # Moderation, reports, platform analytics
│   │   └── notifications.js # In-app notification delivery
│   ├── utils/
│   │   └── notify.js        # Notification dispatcher helper
│   ├── data/
│   │   ├── database.json    # Persistent JSON datastore
│   │   └── seed.js          # Database seed script
│   ├── server.js            # Express application entry point
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Responsive navigation with demo switcher
│   │   │   ├── Footer.jsx         # Platform mission and footer
│   │   │   ├── RequestModal.jsx   # Propose 1-on-1 skill exchange
│   │   │   ├── ReviewModal.jsx    # Dual-sided feedback and star ratings
│   │   │   └── ReportModal.jsx    # Safety dispute and moderation form
│   │   ├── pages/
│   │   │   ├── Matches.jsx        # Smart 2-way reciprocal matching hub
│   │   │   ├── Explore.jsx        # Skill directory with category filters
│   │   │   ├── Sessions.jsx       # Video room launcher and session history
│   │   │   ├── Requests.jsx       # Received and outgoing proposals
│   │   │   ├── Progress.jsx       # Hours balance gauge, badges, milestones
│   │   │   ├── Profile.jsx        # Skill offerings, desired skills, bio editor
│   │   │   ├── AdminDashboard.jsx # Admin metrics, user bans, safety reports
│   │   │   ├── Login.jsx          # Quick test login + form
│   │   │   └── Register.jsx       # Student onboarding
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── services/
│   │   │   └── api.js             # REST API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── package.json                   # Root orchestrator
```
