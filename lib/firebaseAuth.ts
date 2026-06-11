// lib/firebaseAuth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from './firebase';

export const signUpUser = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signInUser = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export { auth };
