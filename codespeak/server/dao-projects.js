'use strict';

/* Data Access Object (DAO) module for accessing projects data */

const db = require('./db');

// This function retrieves the whole list of projects from the database.
exports.listProjects = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM projects';
        db.all(sql, (err, rows) => {
            if (err) { reject(err); }

            const projects = rows.map((e) => {
                const p = Object.assign({}, e);
                return p;
            });

            resolve(projects);
        });
    });
};

// This function retrieves the whole list of questions from the database.
exports.listQuestions = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM questions';
        db.all(sql, (err, rows) => {
            if (err) { reject(err); }

            const questions = rows.map((e) => {
                const q = Object.assign({}, e);
                return q;
            });

            resolve(questions);
        });
    });
};

/**
 * This function adds a new question in the database.
 * The question id is added automatically by the DB, and it is returned as this.lastID.
 */
exports.createQuestion = (question) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO questions (title, description, userid, projectid) VALUES(?, ?, ?, ?)';
        db.run(sql, [question.title, question.description, question.userid, question.projectid], function (err) {
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
};

// This function retrieves the whole list of solutions from the database.
exports.listSolutions = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM solutions';
        db.all(sql, (err, rows) => {
            if (err) { reject(err); }

            const solutions = rows.map((e) => {
                const s = Object.assign({}, e);
                return s;
            });

            resolve(solutions);
        });
    });
};

/**
 * This function adds a new solution in the database.
 * The solution id is added automatically by the DB, and it is returned as this.lastID.
 */
exports.createSolution = (solution) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO solutions (text, userid, questionid) VALUES(?, ?, ?, ?)';
        db.run(sql, [solution.text, solution.userid, solution.questionid], function (err) {
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
};