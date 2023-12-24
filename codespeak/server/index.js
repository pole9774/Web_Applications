'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { check, validationResult, } = require('express-validator');

const projectsDao = require('./dao-projects');
const userDao = require('./dao-users');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));

const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDao.getUser(username, password)
    if (!user)
        return callback(null, false, 'Incorrect username or password');

    return callback(null, user);
}));

passport.serializeUser(function (user, callback) {
    callback(null, user);
});

passport.deserializeUser(function (user, callback) {
    return callback(null, user);
});

const session = require('express-session');

app.use(session({
    secret: "shhhhh... it's a secret!",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Not authorized' });
}


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
            return res.status(401).json({ error: info });
        }
        req.login(user, (err) => {
            if (err)
                return next(err);

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


/*** Projects APIs ***/

// 1. Retrieve the list of all projects.
// GET /api/projects
app.get('/api/projects',
    isLoggedIn,
    (req, res) => {
        projectsDao.listProjects()
            .then(projects => res.json(projects))
            .catch((err) => res.status(500).json(err));
    }
);


const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
