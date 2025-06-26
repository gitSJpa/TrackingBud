import 'dotenv/config';

export default {
expo: {
name: "Tracking_Bud",
slug: "trackingbud",
version: "1.0.0",
orientation: "portrait",
icon: "./assets/images/icon.png",
scheme: "myapp",
userInterfaceStyle: "automatic",
runtimeVersion: {
policy: "appVersion"
},
newArchEnabled: true,
ios: {
supportsTablet: true
},
android: {
adaptiveIcon: {
foregroundImage: "./assets/images/adaptive-icon.png",
backgroundColor: "#ffffff"
},
package: "com.sjpa.trackingbud"
},
web: {
bundler: "metro",
output: "static",
favicon: "./assets/images/favicon.png"
},
plugins: [
"expo-router",
[
"expo-splash-screen",
{
image: "./assets/images/splash-icon.png",
imageWidth: 200,
resizeMode: "contain",
backgroundColor: "#ffffff"
}
],
"expo-secure-store",
"expo-font",
[
"expo-build-properties",
{
android: {
kotlinVersion: "1.9.25"
}
}
]
],
experiments: {
typedRoutes: true
},
extra: {
firebase: {
apiKey: process.env.FIREBASE_API_KEY,
authDomain: process.env.FIREBASE_AUTH_DOMAIN,
projectId: process.env.FIREBASE_PROJECT_ID,
storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
appId: process.env.FIREBASE_APP_ID
},
router: {
origin: false
},
eas: {
projectId: "9298d4bd-067f-4b12-9336-89af4ff511aa"
}
},
owner: "sjpa"
}
};
