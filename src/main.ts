import localeEs from '@angular/common/locales/es';
import { bootstrapApplication, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';

import { appConfig } from './app/app.config';
import { App } from './app/app';

registerLocaleData(localeEs);

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideClientHydration(withEventReplay()), provideFirebaseApp(() => initializeApp({ projectId: "celebra-app-5958f", appId: "1:40186183176:web:7fb93a140662ab165fdbbd", storageBucket: "celebra-app-5958f.firebasestorage.app", apiKey: "AIzaSyASSG2DdZb4KiqwVLPih2h6nwuM3cguEnY", authDomain: "celebra-app-5958f.firebaseapp.com", messagingSenderId: "40186183176", measurementId: "G-WFRZHJGQPD" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage()), { provide: LOCALE_ID, useValue: 'es' }
  ]
})
  .catch((err) => console.error(err));
