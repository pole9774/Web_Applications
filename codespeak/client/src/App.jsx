import 'bootstrap/dist/css/bootstrap.min.css';

import { React, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { MainLayout, ProjectDetailsLayout, QuestionForm, QuestionPage, QuestionsLayout, SolutionPage, MyQuestionsLayout, LoginLayout } from './components/Layout';

import API from './API';

function App() {

  const [p_dirty, setPDirty] = useState(true);
  const [q_dirty, setQDirty] = useState(true);
  const [s_dirty, setSDirty] = useState(true);

  // This state keeps track if the user is currently logged-in.
  const [loggedIn, setLoggedIn] = useState(false);
  // This state contains the user's info.
  const [user, setUser] = useState(null);

  // This state contains the list of all the projects (it is initialized from a predefined array).
  const [projects, setProjects] = useState([]);

  // This state contains the list of all the questions (it is initialized from a predefined array).
  const [questions, setQuestions] = useState([]);

  // This state contains the list of all the solutions (it is initialized from a predefined array).
  const [solutions, setSolutions] = useState([]);

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
    if (p_dirty && loggedIn) {
      API.getProjects()
        .then((projects) => {
          setProjects(projects);
          setPDirty(false);
        })
        .catch((err) => handleErrors(err));
    }
  }, [p_dirty, loggedIn]);

  useEffect(() => {
    if (q_dirty && loggedIn) {
      API.getQuestions()
        .then((questions) => {
          setQuestions(questions);
          setQDirty(false);
        })
        .catch((err) => handleErrors(err));
    }
  }, [q_dirty, loggedIn]);

  useEffect(() => {
    if (s_dirty && loggedIn) {
      API.getSolutions()
        .then((solutions) => {
          setSolutions(solutions);
          setSDirty(false);
        })
        .catch((err) => handleErrors(err));
    }
  }, [s_dirty, loggedIn]);

  /**
   * This function handles the login process.
   * It requires a username and a password inside a "credentials" object.
   */
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      throw err;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={loggedIn ? <MainLayout projects={projects} user={user} /> : <Navigate replace to='/login' />} />
        <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/' />} />
        <Route path="/projects/:id" element={<ProjectDetailsLayout projects={projects} user={user} />} />
        <Route path="/projects/:id/make-question" element={<QuestionForm projects={projects} user={user} setQDirty={setQDirty} />} />
        <Route path="/questions/:qid" element={<QuestionPage projects={projects} questions={questions} solutions={solutions} user={user} />} />
        <Route path="/projects/:id/questions" element={<QuestionsLayout projects={projects} questions={questions} user={user} />} />
        <Route path="/projects/:id/myquestions" element={<MyQuestionsLayout projects={projects} questions={questions} user={user} />} />
        <Route path="/solutions/:sid" element={<SolutionPage projects={projects} questions={questions} solutions={solutions} user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
