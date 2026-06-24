import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, doc } from "firebase/firestore";
import { db } from "../firebase";
import { User, Sitter, Booking, Review } from "../types";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function useFirestoreRealtime() {
  const [users, setUsers] = useState<User[]>([]);
  const [sitters, setSitters] = useState<Sitter[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // For current auth state sync
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSitterUser, setCurrentSitterUser] = useState<Sitter | null>(
    null,
  );
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUsers: () => void;
    let unsubscribeSitters: () => void;
    let unsubscribeBookings: () => void;
    let unsubscribeReviews: () => void;
    let unsubscribeUserDoc: (() => void) | null = null;
    let unsubscribeSitterDoc: (() => void) | null = null;

    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // Subscribe to current user's document
        unsubscribeUserDoc = onSnapshot(
          doc(db, "users", authUser.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data() as User;
              setCurrentUser(userData);

              // If they are a sitter, subscribe to sitter doc
              if (userData.role === "sitter") {
                unsubscribeSitterDoc = onSnapshot(
                  doc(db, "sitters", authUser.uid),
                  (sitterSnap) => {
                    if (sitterSnap.exists()) {
                      setCurrentSitterUser(sitterSnap.data() as Sitter);
                    } else {
                      setCurrentSitterUser(null);
                    }
                  },
                );
              } else {
                if (unsubscribeSitterDoc) unsubscribeSitterDoc();
                setCurrentSitterUser(null);
              }
            } else {
              setCurrentUser(null);
              setCurrentSitterUser(null);
            }
            setAuthLoading(false);
          },
        );
      } else {
        setCurrentUser(null);
        setCurrentSitterUser(null);
        if (unsubscribeUserDoc) unsubscribeUserDoc();
        if (unsubscribeSitterDoc) unsubscribeSitterDoc();
        setAuthLoading(false);
      }
    });

    try {
      unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
        const usersList: User[] = [];
        snapshot.forEach((doc) => {
          usersList.push(doc.data() as User);
        });
        setUsers(usersList);
      });

      unsubscribeSitters = onSnapshot(collection(db, "sitters"), (snapshot) => {
        const sittersList: Sitter[] = [];
        snapshot.forEach((doc) => {
          sittersList.push(doc.data() as Sitter);
        });
        setSitters(sittersList);
      });

      unsubscribeBookings = onSnapshot(
        collection(db, "bookings"),
        (snapshot) => {
          const bookingsList: Booking[] = [];
          snapshot.forEach((doc) => {
            bookingsList.push(doc.data() as Booking);
          });
          setBookings(bookingsList);
        },
      );

      unsubscribeReviews = onSnapshot(collection(db, "reviews"), (snapshot) => {
        const reviewsList: Review[] = [];
        snapshot.forEach((doc) => {
          reviewsList.push(doc.data() as Review);
        });
        setReviews(reviewsList);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      });
    } catch (err) {
      console.error("Error setting up real-time listeners:", err);
      setLoading(false);
    }

    return () => {
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribeSitters) unsubscribeSitters();
      if (unsubscribeBookings) unsubscribeBookings();
      if (unsubscribeReviews) unsubscribeReviews();
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
      if (unsubscribeSitterDoc) unsubscribeSitterDoc();
    };
  }, []);

  return {
    users,
    sitters,
    bookings,
    reviews,
    currentUser,
    currentSitterUser,
    loading,
    authLoading,
  };
}
