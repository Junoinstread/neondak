import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getMissingFirebaseConfigKeys() {
  return Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

export function isFirebaseConfigured() {
  return getMissingFirebaseConfigKeys().length === 0;
}

function getFirebaseApp(): FirebaseApp {
  const missingKeys = getMissingFirebaseConfigKeys();

  console.log('NEONDAK_FIREBASE_CONFIG_DEBUG', {
    hasApiKey: Boolean(firebaseConfig.apiKey),
    hasAuthDomain: Boolean(firebaseConfig.authDomain),
    hasProjectId: Boolean(firebaseConfig.projectId),
    hasStorageBucket: Boolean(firebaseConfig.storageBucket),
    hasAppId: Boolean(firebaseConfig.appId),
    missingKeys,
    existingApps: getApps().length,
  });

  if (missingKeys.length > 0) {
    console.error('NEONDAK_FIREBASE_CONFIG_MISSING', {
      missingKeys,
    });
    throw new Error(`Firebase 설정이 없습니다: ${missingKeys.join(', ')}`);
  }

  const existingApp = getApps()[0];

  if (existingApp) {
    console.log('NEONDAK_FIREBASE_APP_REUSE', {
      projectId: firebaseConfig.projectId,
    });
    return existingApp;
  }

  console.log('NEONDAK_FIREBASE_APP_INIT_START', {
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
  });

  const app = initializeApp(firebaseConfig);

  console.log('NEONDAK_FIREBASE_APP_INIT_DONE', {
    projectId: firebaseConfig.projectId,
  });

  return app;
}

export function getFirebaseDb(): Firestore {
  console.log('NEONDAK_FIREBASE_DB_GET_START');
  const db = getFirestore(getFirebaseApp());

  console.log('NEONDAK_FIREBASE_DB_GET_DONE', {
    projectId: firebaseConfig.projectId,
  });

  return db;
}

export function getFirebaseStorage(): FirebaseStorage {
  console.log('NEONDAK_FIREBASE_STORAGE_GET_START');
  const storage = getStorage(getFirebaseApp());

  console.log('NEONDAK_FIREBASE_STORAGE_GET_DONE', {
    storageBucket: firebaseConfig.storageBucket,
  });

  return storage;
}
