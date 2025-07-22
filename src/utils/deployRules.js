// This file contains the Firebase rules to be manually applied
// Copy and paste these rules directly into Firebase Console

export const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to classes for all users (for public courses)
    match /classes/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write their own user documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write their own progress documents
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write activities
    match /activities/{document} {
      allow read, write: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Allow read access to community posts for authenticated users
    match /community_posts/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Allow forms collection for contact forms (public access)
    match /forms/{document=**} {
      allow read, write: if true;
    }
    
    // Test collection for debugging
    match /test/{document=**} {
      allow read, write: if true;
    }
  }
}`;

console.log('Firebase Firestore Rules:');
console.log('========================');
console.log(firestoreRules);
console.log('========================');
console.log('Copy these rules to Firebase Console > Firestore Database > Rules tab');