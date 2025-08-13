import { bootstrapApplication, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideClientHydration(withEventReplay()), provideFirebaseApp(() => initializeApp({ projectId: "celebra-app-5958f", appId: "1:40186183176:web:7fb93a140662ab165fdbbd", storageBucket: "celebra-app-5958f.firebasestorage.app", apiKey: "AIzaSyASSG2DdZb4KiqwVLPih2h6nwuM3cguEnY", authDomain: "celebra-app-5958f.firebaseapp.com", messagingSenderId: "40186183176", measurementId: "G-WFRZHJGQPD" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage())
  ]
})
  .catch((err) => console.error(err));
