'use strict';

/* Data Access Object (DAO) module for accessing films data */

const db = require('./db');
const dayjs = require("dayjs");

const filters = {
    'filter-all': { label: 'All', url: '', filterFunction: () => true },
    'filter-user': { label: 'Mine', url: '/filter/filter-user', filterFunction: page => page.author === "Marco" }
};

/** WARNING: 
 * When you are retrieving pages, you should not consider the value of the “user” column. When you are creating new pages, you should assign all of them to the same user (e.g., user with id=1).
 */

/** NOTE:
 * return error messages as json object { error: <string> }
 */


// This function retrieves the whole list of pages from the database.
exports.listPages = (filter) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM pages';
        db.all(sql, (err, rows) => {
            if (err) { reject(err); }

            const pages = rows.map((e) => {
                const page = Object.assign({}, e);
                return page;
            });

            // WARNING: if implemented as if(filters[filter]) returns true also for filter = 'constructor' but then .filterFunction does not exists
            if (filters.hasOwnProperty(filter))
                resolve(pages.filter(filters[filter].filterFunction));
            else resolve(pages);
        });
    });
};

// This function retrieves a page given its id and the associated user id.
exports.getPage = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM pages WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            }
            if (row == undefined) {
                resolve({ error: 'Page not found.' });
            } else {
                const page = Object.assign({}, row);
                resolve(page);
            }
        });
    });
};


/**
 * This function adds a new page in the database.
 * The page id is added automatically by the DB, and it is returned as this.lastID.
 */
exports.createPage = (page) => {
    if (page.date_pub == "")
        page.date_pub = null;

    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO pages (title, author, date_c, date_pub, user) VALUES(?, ?, ?, ?, ?)';
        db.run(sql, [page.title, page.author, page.date_c, page.date_pub, page.user], function (err) {
            if (err) {
                reject(err);
            }
            // Returning the newly created object with the DB additional properties to the client.
            resolve(exports.getPage(this.lastID));
        });
    });
};

// This function updates an existing page given its id and the new properties.
exports.updatePage = (id, page) => {
    if (page.date_pub == "")
        page.date_pub = null;

    return new Promise((resolve, reject) => {
        const sql = 'UPDATE pages SET title = ?, author = ?, date_c = ?, date_pub = ? WHERE id = ?';
        db.run(sql, [page.title, page.author, page.date_c, page.date_pub, id], function (err) {
            if (err) {
                reject(err);
            }
            if (this.changes !== 1) {
                resolve({ error: 'Page not found.' });
            } else {
                resolve(exports.getPage(id));
            }
        });
    });
};

// This function deletes an existing page given its id.
exports.deletePage = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM pages WHERE id = ?';
        db.run(sql, [id], (err) => {
            if (err) {
                reject(err);
            } else
                resolve(null);
        });
    });
}