# MovieRate 🎬

A premium movie rating app built with Expo, featuring glassmorphism and real-time interactions.

## 🚀 Quick Start

Follow these steps to get the app running on your machine:

1. **Clone & Enter**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `frontend` directory and add your Firebase API key:
   ```bash
   cp .env.example .env
   ```
   Ensure the following variable is set:
   - `EXPO_PUBLIC_FIREBASE_API`: Your Firebase API key.

4. **Launch**
   ```bash
   npx expo start
   ```

### 📱 How to View
- **Physical Device**: Scan the QR code with your camera (iOS) or Expo Go app (Android).
- **Simulator**: Press `i` for iOS or `a` for Android in the terminal.

---

## 🛠 Tech Stack
- **Framework**: Expo (React Native) + Expo Router
- **State**: Zustand (Global Store)
- **Animation**: Reanimated 
- **Styling**: Native StyleSheet + Expo Blur (Glassmorphism)
- **Icons**: Feather & MaterialCommunityIcons

---

## 📂 Project Structure
- `/app`: File-based routes (Home, Leaders, Search, Profile, Auth).
- `/components`: Reusable UI (MovieCard, ScoreBar, VoteButtons).
- `/store`: Global state management (`useAppStore.ts`).
- `/utils`: Data hydration layer (`movieMapper.ts`).

---

## 💡 Troubleshooting
If you see an "Unknown Module" error or styling issues, restart with a clear cache:
```bash
npx expo start --clear
```

---
**Developed with ❤️ for the movie community.**
