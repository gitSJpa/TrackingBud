TrackingBud - Fitness Tracking App
Hello! Welcome to TrackingBud, my fitness tracking app I built using React Native and Firebase. This app helps people like me to log their workouts, see their progress, and check statistics about their fitness. It uses Firebase to keep user data safe in the cloud and let you use it on different devices. I am proud of this project because it mixes modern tools to make something useful and nice to use.
The idea of TrackingBud is simple but strong. You can save your workouts with details like exercise name, weight, and reps. You can also start routines, see your total workouts, time spent, and even your best lifts.

What the Project Does
TrackingBud has five big pages: Home, Profile, Workout, Routine, and Login. Every page is made with React Native, and I use Firebase to save and get data. Here is what they do:

Home Page: When you open the app, you see a welcome message, how many workouts you did, and buttons to start a workout or look at your history. It gets the workout count from Firebase, so it’s always up to date.

Profile Page: This page shows your stats—like total workouts, total time, reps, and your best lifts. It also has a weekly summary to see which days you exercised. It takes data from Firestore and has some functions to show these numbers.

Workout Page: Here, you can log a single workout. You type the exercise name, weight, and reps, and it figures out how long the workout took. Then it saves everything to Firestore under your user ID.

Routine Page: This one lets you start a workout routine you made before. You can add exercises and sets, and when you finish, it saves the routine as a normal workout in Firestore.

Login: Basically just a login/signup page.

Files and What They Do
I organized my project into folders so it’s easy to find things. Here are the main ones:

1. Pages (src/pages)

Home.js: This is the home screen code. It shows the welcome stuff and workout count.
Profile.js: This file has the logic for showing your stats and weekly summary.
Workout.js: This is where you log workouts. It has inputs for details and saves them to Firestore.
RoutineStart.js: This file handles starting and finishing routines. It saves the routine as a workout when you’re done.

2. Utilities (src/utils)

dateUtils.js: This has a function called formatDate that makes all dates the same format (like "YYYY-MM-DD"). Used it to fix some irregularities.

3. Configuration (config)

firebase-config.js: This sets up Firebase.
theme-config.js: This file has the app’s colors and styles so everything looks nice and uniform (Inspires by the YouUbe Mobile App).

Choices I Made and Why
When I built TrackingBud, I had to think about some big decisions. Here’s what I chose and why:

Using Firebase: I picked Firebase for login and saving data because it’s fast and safe and easy. It also lets the app update data right away.
React Navigation: I used this for moving between pages. It works great with React Native and was used in many tutorials.
Folder Structure: I put files in groups by what they do. This makes it easier to add more stuff later without a mess.
Dates with formatDate: I made one function to handle dates because I didn’t want problems with wrong dates. It keeps everything neat.
Theme File: I made a theme-config.js so the app looks the same everywhere. It’s better for consistency and easier to use.

I also added error messages if something fails—like saving a workout—so users know what’s wrong. And I used tricks like useCallback to make the app faster by not redoing work it doesn’t need to.

Final Thoughts
TrackingBud is a project I really like! It’s a working fitness app that uses React Native and Firebase. I learned a lot making it, and I think it shows good coding ideas—like keeping things organized and making it easy to grow later (this was very important for me since i want to add some stuff later). I chose React Native because a friend of mine told me it would be fun, but since I didn’t know it, i used LLMs to give a hand with sintaxe and answer many MANY questions.
I hope you enjoy looking at it as much as I enjoyed building it!
