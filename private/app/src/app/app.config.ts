import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKOKato4_tv2e5s2tNPZSGXAWCimGEupM",
  authDomain: "project-x2-0.firebaseapp.com",
  projectId: "project-x2-0",
  storageBucket: "project-x2-0.appspot.com",
  messagingSenderId: "689501773952",
  appId: "1:689501773952:web:a4eb7a02e9733cd8104665",
  measurementId: "G-GTD3ZW2ERZ"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(), 
    provideHttpClient(),

    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideAuth(() => getAuth())
    ])
    
  ]
};

