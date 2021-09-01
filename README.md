# Podchoosee

A simple, cross-platform podcatcher.

NOTE: While search works, fetching podcasts does not as it requires a back-end that is no longer operational. This repo is purely for portfolio reasons and does not contain complete functionality.

### Building and running
Built on React Native, Podchoosee requires [NodeJS](https://nodejs.org/en/) (Version 8 or above), [Yarn](https://yarnpkg.com/) and the SDKs/tools for the specific OSs you're planning to test/deploy on. Check out the official [documentation](https://reactnative.dev/docs/environment-setup) for more information on how to setup your enviorment.

Install the app's dependencies using yarn:

```
yarn install
```

To debug on an emulator and/or device:

```
npx react-native run-[platform-name-here]
```

At this time, only Android has been tested, though as it doesn't use any OS specific packages it should run fine on iOS. If you encounter any problems, feel free to submit an issue.