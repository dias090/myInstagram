import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";

import "./Signin.scss";
import Loading from "../Loading/Loading";

const Signin = () => {
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const login = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password)
            .then(()=>{
                setError("");
                setEmail("");
                setPassword("");
                navigate("/");
            }).catch((error)=>{
                console.log(error)
                setError("Error: Couldn't find your account")
            })
        } catch (error) {
            console.log(error);
        }
    }

    if (loading) {
        return <Loading/>;
    }

  return (
    <form data-theme="white" className="Signin_container" onSubmit={login}>
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
                        value={email} 
                        onChange={(e)=>{setEmail(e.target.value)}}
                        required
                        autoComplete="email"
                    />
                    </div>
                    <div className="input-field">
                    <input
                        type="password"
                        placeholder="password"
                        className="browser-default"
                        value={password}
                        onChange={(e)=>{setPassword(e.target.value)}}
                        required
                        autoComplete="password"
                    />
                    </div>
                    <div className="input-field">
                    <input type="submit" value="Signup" />
                    </div>
                </div>
                <div className="col s12 m6 l4 offset-m3 offset-l4 center">
                    Don't have an account yet? <Link to="/signup">signup</Link>
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

export default Signin;
