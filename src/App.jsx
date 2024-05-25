import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { auth } from './routes/firebase';
import 'materialize-css/dist/css/materialize.min.css';
import "./App.scss";

import { Sidebar, Signin, Signup, Homepage } from './components/script';

function App() {
  const [isAuth, setisAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setisAuth(true);
      } else {
        setisAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/" element={isAuth ? <Homepage /> : <Signin />} />
      <Route path="/login" element={isAuth? <Navigate to="/" /> : <Signin />} />
      <Route path="/signup" element={isAuth? <Navigate to="/" /> : <Signup />} />
    </Routes>
  );
}

export default App;
