import 'bootstrap/dist/css/bootstrap.min.css';

import { React, useState, useEffect } from 'react';
import { Container, Toast } from 'react-bootstrap/'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { MainLayout, AddLayout, EditLayout, DefaultLayout, NotFoundLayout, LoadingLayout } from './components/Layout';

import MessageContext from './messageCtx';
import API from './API';

//const currentUser = "Marco";

function App() {

  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(true);

  // This state is used for displaying a LoadingLayout while we are waiting an answer from the server.
  const [loading, setLoading] = useState(false);

  // If an error occurs, the error message will be shown in a toast.
  const handleErrors = (err) => {
    let msg = '';
    if (err.error) msg = err.error;
    else if (String(err) === "string") msg = String(err);
    else msg = "Unknown Error";
    setMessage(msg); // WARN: a more complex application requires a queue of messages. In this example only last error is shown.
  }

  const filters = {
    'filter-all': { label: 'All', url: '', filterFunction: () => true },
    'filter-user': { label: 'Mine', url: '/filter/filter-user', filterFunction: page => page.author === "Marco" }
  };

  // This state contains the list of pages (it is initialized from a predefined array).
  const [pages, setPages] = useState([]);

  return (

    <BrowserRouter>

      <MessageContext.Provider value={{ handleErrors }}>

        <Container fluid className='App'>

          <Routes>
            <Route path="/" element={loading ? <LoadingLayout /> : <DefaultLayout pages={pages} filters={filters} />} >
              <Route index element={<MainLayout pages={pages} setPages={setPages} filters={filters} dirty={dirty} setDirty={setDirty} />} />
              <Route path="filter/:filterLabel" element={<MainLayout pages={pages} setPages={setPages} filters={filters} dirty={dirty} setDirty={setDirty} />} />
              <Route path="add" element={<AddLayout />} />
              <Route path="edit/:pageId" element={<EditLayout pages={pages} filters={filters} setDirty={setDirty} />} />
              <Route path="*" element={<NotFoundLayout />} />
            </Route>
          </Routes>

          <Toast show={message !== ''} onClose={() => setMessage('')} delay={4000} autohide>
            <Toast.Body>{message}</Toast.Body>
          </Toast>

        </Container>

      </MessageContext.Provider>

    </BrowserRouter>
  );
}

export default App;
