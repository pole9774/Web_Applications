import 'bootstrap/dist/css/bootstrap.min.css';

import { React, useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import API from './API';

function App() {

  const [dirty, setDirty] = useState(true);

  // This state keeps track if the user is currently logged-in.
  const [loggedIn, setLoggedIn] = useState(false);
  // This state contains the user's info.
  const [user, setUser] = useState(null);

  // This state contains the list of all the projects (it is initialized from a predefined array).
  const [projects, setProjects] = useState([]);

  const [message, setMessage] = useState('');

  // If an error occurs, the error message will be shown in a toast.
  const handleErrors = (err) => {
    let msg = '';
    if (err.error) msg = err.error;
    else if (String(err) === "string") msg = String(err);
    else msg = "Unknown Error";
    setMessage(msg); // WARN: a more complex application requires a queue of messages. In this example only last error is shown.
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        // NO need to do anything: user is simply not yet authenticated
        //handleErrors(err);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (dirty) {
      API.getProjects()
        .then((projects) => {
          setProjects(projects);
          setDirty(false);
        })
        .catch((err) => handleErrors(err));
    }
  }, [dirty]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={loggedIn ? <MainLayout project={projects} /> : <Navigate replace to='/login' />} />
        <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
