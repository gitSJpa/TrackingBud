# YOUR PROJECT TITLE: TrackingBud - Fitness Tracking App

#### Video Demo: <[URL HERE](https://youtu.be/VekcKgCpMKM)>

#### Description:

Hello! Welcome to TrackingBud, my fitness tracking app I built using React Native and Firebase. This app helps people like me log their workouts, see their progress, and check statistics about their fitness. It uses Firebase to keep user data safe in the cloud and lets you use it on different devices. I am proud of this project because it mixes modern tools to make something useful and nice to use.  
The idea of TrackingBud is simple but strong. You can save your workouts with details like exercise name, weight, and reps. You can also start routines, see your total workouts, time spent, and even your best lifts.

### What the Project Does

TrackingBud has five big pages: Home, Profile, Workout, Routine, and Login. Every page is made with React Native, and I use Firebase to save and get data. Here is what they do:

- **Home Page:** When you open the app, you see a welcome message, how many workouts you did, and buttons to start a workout or look at your history. It gets the workout count from Firebase, so it’s always up to date.

- **Profile Page:** This page shows your stats—like total workouts, total time, reps, and your best lifts. It also has a weekly summary to see which days you exercised. It takes data from Firestore and has some functions to show these numbers.

- **Workout Page (Quick Start):** Here, you can log a single workout. You type the exercise name, weight, and reps, and it figures out how long the workout took. Then it saves everything to Firestore under your user ID.

- **Routine Page:** This one shows you the routines you have saved, so you can start a workout with all your regular exercises already loaded. It takes the data from Firestore.

- **Login:** Basically just a login/signup page.

### Files and What They Do

I organized my project into folders so it’s easy to find things. Here are the main ones:

#### 1. **App (main stuff)**

- `home.tsx`: This is the home screen code. It shows the welcome message and workout count.
- `profile.tsx`: This file has the logic for showing your stats and weekly summary.
- `start.tsx`: This is where you log "quick start" workouts. It has inputs for details and saves them to Firestore.
- `createroutine`: This file handles the creation of the routines.
- `routineStart.tsx`: This file handles starting and finishing routines. It saves the routine as a workout when you’re done.
- `routines.tsx`: This file shows you the routines you've got.
- `workout.tsx`: This file gives you the option to choose between quick starting a workout, creating a routine, or starting one.
- `layout.tsx`: Initializes global components like the tab bar and navigation container, applies consistent styling (padding, background, etc.), and wraps children so all pages render consistently.
- `index.tsx`: This file handles the initial logic to redirect users based on login status.
- `login.tsx`: This file is the login/sign-up page and all its logic.

#### 2. **Utilities (src/utils)**

- `dateUtils.ts`: This has a function called `formatDate` that makes all dates the same format (like "YYYY-MM-DD"). I used it to fix some irregularities.

#### 3. **Configuration**

- `firebase-config.js`: This sets up Firebase.
- `theme-config.tsx`: This file has the app’s colors and styles so everything looks nice and uniform (inspired by the YouTube Mobile App).

### Choices I Made and Why

When I built TrackingBud, I had to think about some big decisions. Here’s what I chose and why:

1. **Using React Native:** I chose this framework because a friend recommended it, and I liked the idea of coding for Android and iOS in one. Although I didn't have a Mac to test on, so I was limited to Android testing.
2. **Using Firebase:** I picked Firebase for login and saving data because it’s fast, safe, and easy. It also lets the app update data in real time.
3. **React Navigation:** I used this for moving between pages. It works great with React Native and was featured in many tutorials.
4. **Folder Structure:** I grouped files by purpose. This makes it easier to add more features later without a mess.
5. **Theme File:** I created `theme-config.js` so the app looks consistent everywhere. It’s better for uniformity and easier to maintain.

I also added error messages if something fails, like saving a workout, so users know what went wrong. And I used `useCallback` to make the app faster by not repeating work it doesn’t need to.

## 🚀 How to Start

1. **Clone the repository:**

   ```bash
   git clone https://github.com/gitSJpa/TrackingBud.git
   cd TrackingBud
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Install Expo CLI (if you don't have it):**

   ```bash
   npm install -g expo-cli
   ```

4. **Set up Firebase:**

   > If you're only testing and not deploying, skip this step and ask the repo owner for access.

   If you want to use your own Firebase:

   - Go to the Firebase console and create a new project.
   - Add a **web app**.
   - Enable **Authentication > Email/Password**.
   - Enable **Firestore Database**.
   - Copy your config into `config/firebase-config.ts`:

     ```ts
     import { initializeApp } from "firebase/app";

     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
     };

     export const app = initializeApp(firebaseConfig);
     ```

5. **Start the app:**

   ```bash
   npx expo start
   ```

6. **Run it:**
   - Scan the QR code with the **Expo Go** app, or
   - Press `a` for Android emulator, `i` for iOS simulator (Mac only).

✅ You’re ready to test TrackingBud!

### Final Thoughts

TrackingBud is a project I really like! It’s a working fitness app that uses React Native and Firebase. I learned a lot making it, and I think it shows good coding ideas—like keeping things organized and making it easy to grow later (this was very important since I want to add features later). A friend told me React Native would be fun, but since I was new, I used LLMs to help with syntax and answer many questions.  
I hope you enjoy exploring it as much as I enjoyed building it!
