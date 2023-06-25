/*** Importing modules ***/
const express = require('express');
const morgan = require('morgan');                                  // logging middleware
const cors = require('cors');

const { check, validationResult, } = require('express-validator'); // validation middleware

const pageDao = require('./dao-pages'); // module for accessing the pages table in the DB
const userDao = require('./dao-users'); // module for accessing the user table in the DB

/*** init express and set-up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());

/**
 * The "delay" middleware introduces some delay in server responses. To change the delay change the value of "delayTime" (specified in milliseconds).
 * This middleware could be useful for debug purposes, to enabling it uncomment the following lines.
 */
/*
const delay = require('express-delay');
app.use(delay(200,2000));
*/

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));


/*** Passport ***/

/** Authentication-related imports **/
const passport = require('passport');                              // authentication middleware
const LocalStrategy = require('passport-local');                   // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUser (i.e., id, username, name).
 **/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await userDao.getUser(username, password)
  if (!user)
    return callback(null, false, 'Incorrect username or password');

  return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUser, i.e, id, username, name)
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name 
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name 
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));

  return callback(null, user); // this will be available in req.user
});

/** Creating the session */
const session = require('express-session');

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
}


/*** Utility Functions ***/

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};


/*** Users APIs ***/

// POST /api/sessions 
// This route is used for performing login.
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json({ error: info });
    }
    // success, perform the login and extablish a login session
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser() in LocalStratecy Verify Fn
      return res.json(req.user);
    });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/sessions/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});


/*** Pages APIs ***/

// 1. Retrieve the list of all the available pages.
// GET /api/pages
// This route returns the PageLibrary.
app.get('/api/pages',
  (req, res) => {
    pageDao.listPages()
      // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
      .then(pages => res.json(pages))
      .catch((err) => res.status(500).json(err)); // always return a json and an error message
  }
);

// 2. Retrieve the list of all the pages of the user
// GET /api/pages/user
app.get('/api/pages/user',
  isLoggedIn || req.user.admin == 1,
  (req, res) => {
    pageDao.listUserPages(req.user.id)
      // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
      .then(pages => res.json(pages))
      .catch((err) => res.status(500).json(err)); // always return a json and an error message
  }
);

// 3. Retrieve a page, given its “id”.
// GET /api/pages/<id>
// Given a page id, this route returns the associated page from the library.
app.get('/api/pages/:id',
  [check('id').isInt({ min: 1 })],    // check: is the id a positive integer?
  async (req, res) => {
    try {
      const result = await pageDao.getPage(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);

// 4. Retrieve a info, given its “id”.
// GET /api/info/<id>
app.get('/api/info/:id',
  [check('id').isInt({ min: 1 })],    // check: is the id a positive integer?
  async (req, res) => {
    try {
      const result = await pageDao.getInfoById(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);

// 5. Retrieve the site info
// GET /api/info
app.get('/api/info',
  (req, res) => {
    pageDao.getInfo()
      .then(info => res.json(info))
      .catch((err) => res.status(500).json(err)); // always return a json and an error message
  }
);


// 6. Create a new page, by providing all relevant information.
// POST /api/pages
// This route adds a new page to page library.
app.post('/api/pages',
  isLoggedIn || req.user.admin == 1,
  [
    check('title').isLength({ min: 1, max: 160 }),
    check('author').isLength({ min: 1, max: 160 }),
    // only date (first ten chars) and valid ISO
    check('date_c').isLength({ min: 10, max: 10 }).isISO8601({ strict: true }),
    check('date_pub').isLength({ min: 10, max: 10 }).isISO8601({ strict: true }).optional({ checkFalsy: true }),
  ],
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    const page = {
      title: req.body.title,
      author: req.body.author,
      date_c: req.body.date_c,
      date_pub: req.body.date_pub,
      user: req.body.user
    };

    try {
      const result = await pageDao.createPage(page); // NOTE: createPage returns the new created object
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the creation of new page: ${err}` });
    }
  }
);

// 7. Update an existing page, by providing all the relevant information
// PUT /api/pages/<id>
// This route allows to modify a page, specifiying its id and the necessary data.
app.put('/api/pages/:id',
  isLoggedIn || req.user.admin == 1,
  [
    check('id').isInt(),
    check('title').isLength({ min: 1, max: 160 }),
    check('author').isLength({ min: 1, max: 160 }),
    // only date (first ten chars) and valid ISO
    check('date_c').isLength({ min: 10, max: 10 }).isISO8601({ strict: true }),
    check('date_pub').isLength({ min: 10, max: 10 }).isISO8601({ strict: true }).optional({ checkFalsy: true }),
  ],
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }
    // Is the id in the body equal to the id in the url?
    if (req.body.id !== Number(req.params.id)) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
    }

    const page = {
      id: req.body.id,
      title: req.body.title,
      author: req.body.author,
      date_c: req.body.date_c,
      date_pub: req.body.date_pub,
      user: req.body.user
    };

    try {
      const result = await pageDao.updatePage(req.user.id, req.user.admin, page.id, page);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the update of page ${req.params.id}: ${err}` });
    }
  }
);

// 8. Update an existing info, by providing all the relevant information
// PUT /api/info/<id>
app.put('/api/info/:id',
  isLoggedIn || req.user.admin == 1,
  [
    check('id').isInt(),
    check('name').isLength({ min: 1, max: 160 }),
  ],
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }
    // Is the id in the body equal to the id in the url?
    if (req.body.id !== Number(req.params.id)) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
    }

    const info = {
      id: req.body.id,
      name: req.body.name
    };

    try {
      const result = await pageDao.updateInfo(req.user.id, info);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the update of info ${req.params.id}: ${err}` });
    }
  }
);


// 9. Delete an existing page, given its “id”
// DELETE /api/pages/<id>
// Given a page id, this route deletes the associated page from the library.
app.delete('/api/pages/:id',
  isLoggedIn || req.user.admin == 1,
  [check('id').isInt()],
  async (req, res) => {
    try {
      // NOTE: if there is no page with the specified id, the delete operation is considered successful.
      const result = await pageDao.deletePage(req.user.id, req.user.admin, req.params.id);
      if (result == null)
        return res.status(200).json({});
      else
        return res.status(404).json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of page ${req.params.id}: ${err} ` });
    }
  }
);


// Activating the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));