import React, { useState, useEffect } from "react";
import "./EditUser.scss";
import { auth, db } from "../../firebase/firebase";
import { collection, doc, getDoc } from "firebase/firestore";

const EditUser = ({ editUser, toggleEditUser }) => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
        setUsername(docSnap.data().username);
        setFullname(docSnap.data().fullname);
        setEmail(docSnap.data().email);
      } else {
        console.log("No such document!");
      }
    };

    fetchUserData();
  }, []);

  const handleEditUser = async (e) => {
    e.preventDefault();
    setError("");

    // Update email and password in Firebase Authentication
    if (newPassword) {
      try {
        const credential = await auth.currentUser.reauthenticateWithCredential(
          firebase.auth.EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
        );

        await auth.currentUser.updateEmail(email);
        await auth.currentUser.updatePassword(newPassword);
      } catch (error) {
        setError("Failed to update email and password. Please check your current password and try again.");
        return;
      }
    } else {
      try {
        await auth.currentUser.updateEmail(email);
      } catch (error) {
        setError("Failed to update email. Please try again.");
        return;
      }
    }

    // Update username, fullname, and email in Firestore
    try {
      await db.collection("users").doc(auth.currentUser.uid).update({
        username,
        fullname,
        email,
      });

      toggleEditUser();
    } catch (error) {
      setError("Failed to update user data in Firestore. Please try again.");
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {editUser && (
        <div className="edit_user_container requires-no-scroll">
          <div className="bg" onClick={toggleEditUser}></div>
          <div className="edit_user_card">
            <h1 className="center">Edit</h1>
            <form onSubmit={handleEditUser} className="container">
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="newPassword"
              />
              <input
                type="password"
                placeholder="current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="currentPassword"
                required={!!newPassword}
              />
              {error && <p className="error">{error}</p>}
              <button type="submit" className="btn center">
                Edit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUser;
