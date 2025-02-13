# WeVolunteer volunteer app

We Volunteer is a platform for matching volunteers with associations.

This is the mobile app for volunteers. It is built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/).

## Requirements

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) app on your phone
- [EAS CLI](https://docs.expo.dev/build/eas-cli/) (optional, for building and deploying to app stores)

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Setup .env file

   Create a `.env.local` file in the root directory of the project and add the following environment variables:

   ```env
   EXPO_PUBLIC_DEV_API_URL=http://<server-ip>:<server-port>
   ```

3. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory.

This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Build and deploy

To build and deploy the app to app stores, you can use [EAS CLI](https://docs.expo.dev/build/eas-cli/).

1. Install EAS CLI

   ```bash
   npm install -g eas-cli
   ```

2. Authenticate with EAS

   ```bash

   eas login
   ```

3. Build the app

   ```bash

   eas build --platform android
   ```

   or

   ```bash

   eas build --platform ios
   ```

4. Deploy the app

   ```bash

   eas submit
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
