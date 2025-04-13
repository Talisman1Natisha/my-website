# Firebase Setup Guide

If you're experiencing infinite loading issues with your Talisman Series website, follow these steps to fix Firebase CORS and security rules issues:

## Firebase Storage CORS Configuration

1. Install the Google Cloud CLI if you haven't already: https://cloud.google.com/sdk/docs/install

2. After installation, authenticate with:

   ```
   gcloud auth login
   ```

3. Set the current project:

   ```
   gcloud config set project talisman-series
   ```

4. Upload the updated CORS configuration (using the cors.json file in this project):
   ```
   gsutil cors set cors.json gs://talisman-series.appspot.com
   ```

## Firebase Security Rules

Make sure your Firebase security rules allow the following:

1. **Firestore Database Rules**:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read;
         allow write: if request.auth != null;
       }
     }
   }
   ```

2. **Storage Rules**:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read;
         allow write: if request.auth != null;
       }
     }
   }
   ```

You can set these rules in the Firebase Console:

1. Go to https://console.firebase.google.com/project/talisman-series
2. Navigate to "Firestore Database" > "Rules" and update
3. Navigate to "Storage" > "Rules" and update

## Testing Firebase Connectivity

If you're still having issues, check the browser console for specific error messages.

Common issues include:

- CORS errors: Look for messages about cross-origin requests being blocked
- Authentication errors: Make sure your Firebase project is properly set up
- Security rules errors: You'll see messages about permission denied if rules are too restrictive

## Browser Cache

Try clearing your browser cache and cookies if you continue to experience issues after making these changes.
