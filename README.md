# Healthy Empower

Healthy Empower is a graduate-level project designed to help users take control of their health journey. It combines a mobile frontend (built with Expo/React Native) and a Node.js backend to track food, exercise, progress, and goals—all in one place. This app is intended for those who want to log their meals, plan workouts, and visualize their progress in a streamlined, distraction-free environment.

## Features

- **Personalized Fitness Assessment**: Fill out a form to get a sense of your current fitness standing.
- **Food Logging**: Add, view, and analyze daily meal entries; track calories, macros, and meal types.
- **Workout Tracking & Plans**: Record exercises, log sets/reps/duration, and create or follow workout plans.
- **Progress & Achievements**: See your achievements and how you’re advancing toward health goals.
- **User Authentication**: Secure sign-in/sign-up and profile management.
- **Guides & Onboarding**: Step-by-step guidance for new users.

## Installation & Local Development

1. **Set Your API URL**
   - Open `/healthy-empower/constants/DBAPI.ts` and set the appropriate `API_URL` for your environment.

2. **Install Dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Start the Backend Service**
   ```
   cd healthy-empower/user-service/src/
   node app.js
   ```

4. **Start the Frontend App**
   ```
   cd healthy-empower/
   npx expo start
   ```
   or
   ```
   yarn start
   ```

   _Note: Stick to either npm or yarn—don’t mix them, or you may run into dependency issues._

## Database

- Uses SQLite for local storage (mobile).
- Food, exercises, meals, achievements, and goals are all stored in tables (see `utils/database.ts`).

## Usage

Once setup is complete, you can:
- Sign in, fill out your profile, and begin tracking food and exercise.
- Create and follow workout plans or log ad-hoc workouts.
- Browse guides and use the app’s suggestions to help build habits.

## Some Pictures

![Screenshot_20251203-115309~2](https://github.com/user-attachments/assets/25a2622e-8fa7-4f8a-a2eb-4d63165a3338)
![Screenshot_20251203-115343~2](https://github.com/user-attachments/assets/939ad893-6210-43d4-b0bc-e1a78df30371)
![Screenshot_20251203-115357~2](https://github.com/user-attachments/assets/5f546303-b559-4857-b96a-35e5fb5fb9d2)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

## License

This project is for educational use. See the LICENSE file for more information.
