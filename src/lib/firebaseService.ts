/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  addDoc 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { db, auth } from '../firebase';
import { User, Sitter, Booking, Message, Review } from '../types';
import { SITTERS, REVIEWS } from '../data';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Register a new Owner with Firebase Auth and Firestore
 */
export async function signUpOwnerWithAuth(email: string, password: string, userData: Omit<User, 'id'>): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  const newUser: User = {
    ...userData,
    email: normalizedEmail, // Save normalized email
    id: uid,
  };
  await saveUser(newUser);
  return newUser;
}

/**
 * Register a new Sitter with Firebase Auth, and create user + sitter documents in Firestore
 */
export async function signUpSitterWithAuth(email: string, password: string, sitterData: Omit<Sitter, 'id'>): Promise<Sitter> {
  const normalizedEmail = email.trim().toLowerCase();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  
  // Create Sitter Object
  const newSitter: Sitter = {
    ...sitterData,
    id: uid,
  };
  
  // Create User wrapper
  const newUser: User = {
    id: uid,
    firstName: sitterData.firstName,
    lastName: sitterData.lastName,
    email: normalizedEmail, // Save normalized email
    role: 'sitter',
    city: sitterData.city,
    pets: []
  };
  
  await saveUser(newUser);
  await saveSitter(newSitter);
  
  return newSitter;
}

/**
 * Login specifically for admin
 */
export async function adminLoginWithAuth(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        const uid = auth.currentUser?.uid;
        if (uid) {
          await saveUser({
            id: uid,
            firstName: "Admin",
            lastName: "System",
            email,
            role: "owner", // Using standard role, but email gives admin rights via rules
            city: "Casablanca",
            pets: []
          });
        }
      } catch (createErr) {
        throw createErr;
      }
    } else {
      throw err;
    }
  }
}

/**
 * Login with Firebase Auth and fetch User profile from Firestore
 */
export async function loginWithAuth(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  
  // Try to get User document
  let user = await getUser(uid);
  if (!user) {
    // Check if they exist in sitters collection
    const sitterDocSnap = await getDoc(doc(db, 'sitters', uid));
    if (sitterDocSnap.exists()) {
      const sitterData = sitterDocSnap.data() as Sitter;
      user = {
        id: uid,
        firstName: sitterData.firstName,
        lastName: sitterData.lastName,
        email,
        role: 'sitter',
        city: sitterData.city,
        pets: []
      };
      await saveUser(user);
    } else {
      // Fallback profile if user doc is missing
      user = {
        id: uid,
        firstName: email.split('@')[0],
        lastName: 'User',
        email,
        role: 'owner',
        city: 'Casablanca',
        pets: []
      };
      await saveUser(user);
    }
  }
  return user;
}

/**
 * Log out of Firebase
 */
export async function logoutWithAuth(): Promise<void> {
  await signOut(auth);
}

/**
 * Sync / Save User Profile to Firestore
 */
export async function saveUser(user: User): Promise<void> {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, 'users', user.id), user);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch User Profile from Firestore
 */
export async function getUser(userId: string): Promise<User | null> {
  const path = `users/${userId}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return docSnap.data() as User;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
  return null;
}

/**
 * Fetch all Users from Firestore
 */
export async function getAllUsersFromFirestore(): Promise<User[]> {
  const path = 'users';
  try {
    const usersCol = collection(db, 'users');
    const snapshot = await getDocs(usersCol);
    const list: User[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as User);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Update the block status of a user in Firestore
 */
export async function updateUserBlockStatus(userId: string, isBlocked: boolean): Promise<void> {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isBlocked });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch a single Sitter by ID.
 */
export async function getSitter(sitterId: string): Promise<Sitter | null> {
  const path = `sitters/${sitterId}`;
  try {
    const docRef = doc(db, 'sitters', sitterId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Sitter;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Fetch all Sitters.
 */
export async function getSitters(): Promise<Sitter[]> {
  const path = 'sitters';
  try {
    const sittersCol = collection(db, 'sitters');
    const snapshot = await getDocs(sittersCol);
    
    if (snapshot.empty) {
      return [];
    }
    
    const list: Sitter[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as Sitter);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return []; // Fallback unreachable due to throw but kept for TS
  }
}

/**
 * Save or Update Sitter profile
 */
export async function saveSitter(sitter: Sitter): Promise<void> {
  const path = `sitters/${sitter.id}`;
  try {
    await setDoc(doc(db, 'sitters', sitter.id), sitter);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch all Bookings.
 */
export async function getBookings(): Promise<Booking[]> {
  const path = 'bookings';
  try {
    const bookingsCol = collection(db, 'bookings');
    const snapshot = await getDocs(bookingsCol);
    
    if (snapshot.empty) {
      return [];
    }
    
    const list: Booking[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as Booking);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return []; // Fallback unreachable due to throw but kept for TS
  }
}

/**
 * Save booking
 */
export async function saveBooking(booking: Booking): Promise<void> {
  const path = `bookings/${booking.id}`;
  try {
    await setDoc(doc(db, 'bookings', booking.id), booking);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update Booking status
 */
export async function updateBookingInFirestore(bookingId: string, status: 'confirmed' | 'cancelled' | 'completed'): Promise<void> {
  const path = `bookings/${bookingId}`;
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch all Messages.
 */
export async function getMessagesFromFirestore(): Promise<Message[]> {
  const path = 'messages';
  try {
    const messagesCol = collection(db, 'messages');
    const snapshot = await getDocs(messagesCol);
    const list: Message[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as Message);
    });
    
    // Sort chronologically
    return list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return []; // Fallback unreachable due to throw but kept for TS
  }
}

/**
 * Send / Save a Message
 */
export async function sendMessageToFirestore(message: Message): Promise<void> {
  const path = `messages/${message.id}`;
  try {
    await setDoc(doc(db, 'messages', message.id), message);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch Reviews
 */
export async function getReviewsFromFirestore(): Promise<Review[]> {
  const path = 'reviews';
  try {
    const reviewsCol = collection(db, 'reviews');
    const snapshot = await getDocs(reviewsCol);
    
    if (snapshot.empty) {
      console.log('No reviews found in Firestore. Seeding default reviews...');
      for (const rev of REVIEWS) {
        await setDoc(doc(db, 'reviews', rev.id), rev);
      }
      return REVIEWS;
    }
    
    const list: Review[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as Review);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return REVIEWS; // Fallback unreachable due to throw but kept for TS
  }
}

/**
 * Add Sitter Review
 */
export async function addReviewToFirestore(review: Review): Promise<void> {
  const path = `reviews/${review.id}`;
  try {
    await setDoc(doc(db, 'reviews', review.id), review);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

