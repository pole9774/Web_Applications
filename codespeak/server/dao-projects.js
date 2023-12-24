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
