import { Injectable, inject, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { UserInterface } from '../interfaces/userInterfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * YouTube guide fro auth: https://www.youtube.com/watch?v=586O934xrhQ&t=841s
   */
  firebaseAuth = inject(Auth)
  user$ = user(this.firebaseAuth);
  currentUserSignal = signal<UserInterface | null | undefined>(undefined)

  constructor() { }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
    .then(() => {});
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }
}
