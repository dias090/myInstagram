import "./Signup.scss";
import { Link } from "react-router-dom";


import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../routes/firebase";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

  const registr = async (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        await updateProfile(userCredential.user, {
          displayName: username,
        }).then(() => {
          console.log("User profile updated successfully");
        }).catch((error) => {
          setError("Error updating user profile", error);
        });
        const user = auth.currentUser;
        if (user) {
          await setDoc(doc(db, "Users", user.uid), {
            name: name,
            userName: username,
            email: email,
            darkTheme: true,
          });
        }
        setError("");
        setUsername("");
        setEmail("");
        setPassword("");
        navigate("/");
      }).catch((error) => {
        setError("Error: This email already exists");
      });
    }
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
                        placeholder="email"
                        className="browser-default"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                    <div className="input-field">
                    <input
                        type="text"
                        placeholder="name and surename"
                        className="browser-default"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    </div>
                    <div className="input-field">
                    <input
                        type="text"
                        placeholder="username"
                        className="browser-default"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    </div>
                    <div className="input-field">
                    <input
                        type="password"
                        placeholder="password"
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
                    Allready an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    </form>
  );
};

export default Signup;
