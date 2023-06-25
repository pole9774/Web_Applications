import 'bootstrap/dist/css/bootstrap.min.css';

import { React, useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { MainLayout, AddLayout, EditLayout, LoginLayout, ViewLayout } from './components/PageLayout';

import MessageContext from './messageCtx';
import API from './API';

function App() {

  const [dirty, setDirty] = useState(true);
  const [uDirty, setUDirty] = useState(true);
  const [nDirty, setNDirty] = useState(true);

  // This state keeps track if the user is currently logged-in.
  const [loggedIn, setLoggedIn] = useState(false);
  // This state contains the user's info.
  const [user, setUser] = useState(null);

  // This state contains the list of all the pages (it is initialized from a predefined array).
  const [pages, setPages] = useState([]);

  const [siteName, setSiteName] = useState('');

  // This state contains the list of all the user pages (it is initialized from a predefined array).
  const [userPages, setUserPages] = useState([]);

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
      API.getPages()
        .then((pages) => {
          pages.sort((a, b) => a.date_c.isAfter(b.date_c) ? 1 : -1);
          setPages(pages);
          setDirty(false);
        })
        .catch((err) => handleErrors(err));
    }
  }, [dirty]);

  useEffect(() => {
    if (loggedIn && uDirty) {
      API.getUserPages()
        .then((userPages) => {
          userPages.sort((a, b) => a.date_c.isAfter(b.date_c) ? 1 : -1);
          setUserPages(userPages);
          setUDirty(false);
        })
        .catch((err) => handleErrors(err));
    }
  }, [loggedIn, uDirty]);

  useEffect(() => {
    if (nDirty) {
      API.getInfo()
        .then((info) => {
          const infoName = info.find(i => i.id === 1);
          setSiteName(infoName.name);
          setNDirty(false);
        })
        .catch((err) => handleErrors(err));
    }
  }, [nDirty]);


  /**
   * This function handles the login process.
   * It requires a username and a password inside a "credentials" object.
   */
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      setUDirty(true);
    } catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      throw err;
    }
  };

  /**
   * This function handles the logout process.
   */
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setUser(null);
    setUserPages([]);
  };

  const deletePage = (id) => {
    API.deletePage(id)
      .then(() => {
        setDirty(true);
        setUDirty(true);
      })
      .catch((err) => handleErrors(err));
  }

  const addPage = (e) => {
    API.addPage(e)
      .then(() => {
        setDirty(true);
        setUDirty(true);
      })
      .catch((err) => handleErrors(err));
  }


  const editPage = (newEl) => {
    API.updatePage(newEl)
      .then(() => {
        setDirty(true);
        setUDirty(true);
      })
      .catch((err) => handleErrors(err));
  }

  const editSiteName = (newName) => {
    API.updateInfo(newName)
      .then(() => {
        setNDirty(true);
      })
      .catch((err) => handleErrors(err));
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout user={user} logout={handleLogout} siteName={siteName} editSiteName={editSiteName} message={message} resetMessage={() => setMessage('')}
          pages={pages} setPages={setPages} userPages={userPages} setUserPages={setUserPages} deletePage={deletePage} dirty={dirty} setDirty={setDirty} />} />
        <Route path="/add" element={<AddLayout addPage={addPage} user={user} />} />
        <Route path="/edit/:pageId" element={<EditLayout editPage={editPage} handleErrors={handleErrors} user={user} />} />
        <Route path="/pages/:pageId" element={<ViewLayout handleErrors={handleErrors} user={user} />} />
        <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;