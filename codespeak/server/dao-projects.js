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