import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, doc } from "firebase/firestore";
import { db } from "../firebase";
import { User, Sitter, Booking, Review, AppNotification, BlogPost } from "../types";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function useFirestoreRealtime() {
  const [users, setUsers] = useState<User[]>([]);
  const [sitters, setSitters] = useState<Sitter[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
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
    let unsubscribeNotifications: () => void;
    let unsubscribeBlogPosts: () => void;
    let unsubscribeUserDoc: (() => void) | null = null;
    let unsubscribeSitterDoc: (() => void) | null = null;

    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      // Cleanup previous listeners if auth state changes
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribeSitters) unsubscribeSitters();
      if (unsubscribeBookings) unsubscribeBookings();
      if (unsubscribeReviews) unsubscribeReviews();
      if (unsubscribeNotifications) unsubscribeNotifications();
      if (unsubscribeBlogPosts) unsubscribeBlogPosts();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
      if (unsubscribeSitterDoc) unsubscribeSitterDoc();

      if (authUser) {
        // 1. Current user's profile documents
        unsubscribeUserDoc = onSnapshot(
          doc(db, "users", authUser.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data() as User;
              setCurrentUser(userData);

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
                setCurrentSitterUser(null);
              }
            } else {
              setCurrentUser(null);
              setCurrentSitterUser(null);
            }
            setAuthLoading(false);
          },
        );

        // 2. Data Listeners (Admin vs Regular User)
        const isAdmin = authUser.email === 'aeazzaoui@gmail.com';
        
        if (isAdmin) {
          unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
            const usersList: User[] = [];
            snapshot.forEach((doc) => usersList.push(doc.data() as User));
            setUsers(usersList);
          });

          unsubscribeBookings = onSnapshot(collection(db, "bookings"), (snapshot) => {
            const bookingsList: Booking[] = [];
            snapshot.forEach((doc) => bookingsList.push(doc.data() as Booking));
            setBookings(bookingsList);
          });
        } else {
          // Regular user filters
          const q1 = query(collection(db, "bookings"), where("ownerId", "==", authUser.uid));
          const q2 = query(collection(db, "bookings"), where("sitterId", "==", authUser.uid));

          const u1 = onSnapshot(q1, (snap) => {
            const list = snap.docs.map(d => d.data() as Booking);
            setBookings(prev => [...list, ...prev.filter(b => b.sitterId === authUser.uid)]);
          });
          const u2 = onSnapshot(q2, (snap) => {
            const list = snap.docs.map(d => d.data() as Booking);
            setBookings(prev => [...list, ...prev.filter(b => b.ownerId === authUser.uid)]);
          });
          unsubscribeBookings = () => { u1(); u2(); };

          unsubscribeUsers = onSnapshot(doc(db, "users", authUser.uid), (docSnap) => {
            if (docSnap.exists()) setUsers([docSnap.data() as User]);
          });
        }

        // 3. User-specific notifications listener (securely filtered)
        const notifTargets = [authUser.uid, "all"];
        if (isAdmin) {
          notifTargets.push("admin");
        }
        const qNotif = query(
          collection(db, "notifications"),
          where("userId", "in", notifTargets)
        );
        unsubscribeNotifications = onSnapshot(qNotif, (snapshot) => {
          const notificationsList: AppNotification[] = [];
          snapshot.forEach((doc) => {
            notificationsList.push(doc.data() as AppNotification);
          });
          // Sort descending by date
          notificationsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setNotifications(notificationsList);
        }, (error) => {
          console.error("Notifications listener error:", error);
        });
      } else {
        // Not logged in
        setCurrentUser(null);
        setCurrentSitterUser(null);
        setUsers([]);
        setBookings([]);
        setNotifications([]);
        setAuthLoading(false);
      }

      // Public listeners (always active)
      unsubscribeSitters = onSnapshot(collection(db, "sitters"), (snapshot) => {
        const sittersList: Sitter[] = [];
        snapshot.forEach((doc) => sittersList.push(doc.data() as Sitter));
        setSitters(sittersList);
      });

      unsubscribeReviews = onSnapshot(collection(db, "reviews"), (snapshot) => {
        const reviewsList: Review[] = [];
        snapshot.forEach((doc) => reviewsList.push(doc.data() as Review));
        setReviews(reviewsList);
        setLoading(false);
      }, (error) => {
        console.error("Reviews listener error:", error);
        setLoading(false);
      });

      unsubscribeBlogPosts = onSnapshot(collection(db, "blogPosts"), (snapshot) => {
        const list: BlogPost[] = [];
        snapshot.forEach((doc) => list.push(doc.data() as BlogPost));
        setBlogPosts(list);
      });
    });

    return () => {
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribeSitters) unsubscribeSitters();
      if (unsubscribeBookings) unsubscribeBookings();
      if (unsubscribeReviews) unsubscribeReviews();
      if (unsubscribeNotifications) unsubscribeNotifications();
      if (unsubscribeBlogPosts) unsubscribeBlogPosts();
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
    notifications,
    blogPosts,
    currentUser,
    currentSitterUser,
    loading,
    authLoading,
  };
}
