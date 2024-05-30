import "./Signup.scss";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { query, where, getDocs, doc, setDoc, collection } from "firebase/firestore";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameValid, setUsernameValid] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const navigate = useNavigate();

  const checkUniqueUsername = async (username) => {
    setCheckingUsername(true);
    const usernameQuery = query(collection(db, "Users"), where("userName", "==", username));
    const usernameQuerySnapshot = await getDocs(usernameQuery);

    if ((username !== "") && !(/^[a-zA-Z0-9]{1,20}$/.test(username))) {
      setUsernameValid(false);
      setError("There must be only letters and numbers in your username");
    } else if (!usernameQuerySnapshot.empty) {
      setUsernameValid(false);
      setError("This username is already in use");
    } else {
      setUsernameValid(true);
      setError("");
    }
    setCheckingUsername(false);
  };

  const registr = async (e) => {
    e.preventDefault();

    const emailQuery = query(collection(db, "Users"), where("email", "==", email));
    const emailQuerySnapshot = await getDocs(emailQuery);
    if (!emailQuerySnapshot.empty) {
      setError("Error: This email is already in use");
      return;
    }

    if (usernameValid) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: username,
        });

        const user = auth.currentUser;
        if (user) {
          await setDoc(doc(db, "Users", user.uid), {
            avatar: "",
            fullName: name,
            userName: username,
            email: email,
            darkTheme: false,
            userId: user.uid,
            followers: [],
            following: [],
          });
        }
        setError("");
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
        navigate("/");
      } catch (error) {
        console.log(error);
        setError("Error: This email already exists");
      }
    } else {
      setError("Are you stupid? This USERNAME is ALREADY in USE");
    }
  };

  return (
    <form data-theme="white" className="Signin_container" onSubmit={registr}>
      <div className="container">
        <div className="row">
          <div className="col s12 m6 l4 offset-m3 offset-l4">
            <a href="/" className="logo_text">
              Instagram
            </a>
            <div className="input-field">
              <input
                type="email"
                placeholder="Email"
                className="browser-default"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-field">
              <input
                type="text"
                placeholder="Name and Surname"
                className="browser-default"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-field">
              <input
                type="text"
                placeholder="Username"
                className={`browser-default ${!usernameValid && "red"}`}
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  checkUniqueUsername(e.target.value);
                }}
              />
            </div>
            <div className="input-field">
              <input
                type="password"
                placeholder="Password"
                className="browser-default"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-field">
              <input type="submit" value="Signup" />
            </div>
          </div>
          <div className="col s12 m6 l4 offset-m3 offset-l4 center">
            Already have an account? <Link to="/login">Login</Link>
          </div>
          {error && (
            <div className="col s12 m6 l4 offset-m3 offset-l4 center red lighten-2">
              {error}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default Signup;
