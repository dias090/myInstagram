import { db, auth } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const handleFollow = async (userId, setUserListLoading, callback) => {
  const currentUserId = auth.currentUser.uid;
  setUserListLoading(true);
  try {
    const userDocRef = doc(db, "Users", userId);
    const userDocSnap = await getDoc(userDocRef);
    const currentUserDocRef = doc(db, "Users", currentUserId);
    const currentUserDocSnap = await getDoc(currentUserDocRef);

    if (userDocSnap.exists() && currentUserDocSnap.exists()) {
      await setDoc(
        userDocRef,
        {
          followers: [...(userDocSnap.data().followers || []), currentUserId],
        },
        { merge: true }
      );
      await setDoc(
        currentUserDocRef,
        {
          following: [...(currentUserDocSnap.data().following || []), userId],
        },
        { merge: true }
      );
    }
    callback();
    setUserListLoading(false);
  } catch (error) {
    setUserListLoading(false);
    console.log(error.message);
  }
};

export { handleFollow }