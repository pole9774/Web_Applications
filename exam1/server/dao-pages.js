'use strict';

/* Data Access Object (DAO) module for accessing pages data */

const db = require('./db');
const dayjs = require("dayjs");


/** NOTE:
 * return error messages as json object { error: <string> }
 */


// This function retrieves the whole list of pages from the database.
exports.listPages = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM pages';
    db.all(sql, (err, rows) => {
      if (err) { reject(err); }

      const pages = rows.map((e) => {
        const page = Object.assign({}, e);
        return page;
      });

      resolve(pages);
    });
  });
};

// This function retrieves the list of pages of the user from the database.
exports.listUserPages = (user) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM pages WHERE user=?';
    db.all(sql, [user], (err, rows) => {
      if (err) { reject(err); }

      const pages = rows.map((e) => {
        const page = Object.assign({}, e);
        return page;
      });

      resolve(pages);
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

// This function retrieves the info of the site
exports.getInfo = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM info';
    db.all(sql, (err, rows) => {
      if (err) { reject(err); }

      const info = rows.map((e) => {
        const i = Object.assign({}, e);
        return i;
      });

      resolve(info);
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
      resolve(exports.getPage(page.user, this.lastID));
    });
  });
};

// This function updates an existing page given its id and the new properties.
exports.updatePage = (user, admin, id, page) => {
  if (page.date_pub == "")
    page.date_pub = null;

  if (admin == 1) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE pages SET title=?, author=?, date_c=?, date_pub=?, user=? WHERE id=?';
      db.run(sql, [page.title, page.author, page.date_c, page.date_pub, page.user, id], function (err) {
        if (err) {
          reject(err);
        }
        if (this.changes !== 1) {
          resolve({ error: 'No page was updated.' });
        } else {
          resolve(exports.getPage(id));
        }
      });
    });
  }
  else {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE pages SET title=?, author=?, date_c=?, date_pub=? WHERE id=? and user=?';
      db.run(sql, [page.title, page.author, page.date_c, page.date_pub, id, user], function (err) {
        if (err) {
          reject(err);
        }
        if (this.changes !== 1) {
          resolve({ error: 'No page was updated.' });
        } else {
          resolve(exports.getPage(user, id));
        }
      });
    });
  }
};

exports.getInfoById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM info WHERE id=?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      }
      if (row == undefined) {
        resolve({ error: 'Info not found.' });
      } else {
        const info = Object.assign({}, row);
        resolve(info);
      }
    });
  });
};

exports.updateInfo = (id, info) => {
  
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE info SET name=? WHERE id=?';
      db.run(sql, [info.name, id], function (err) {
        if (err) {
          reject(err);
        }
        if (this.changes !== 1) {
          resolve({ error: 'No info was updated.' });
        } else {
          resolve(exports.getInfoById(id));
        }
      });
    });
};

// This function deletes an existing page given its id.
exports.deletePage = (user, admin, id) => {
  if (admin == 1) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM pages WHERE id=?';
      db.run(sql, [id], function (err) {
        if (err) {
          reject(err);
        }
        if (this.changes !== 1)
          resolve({ error: 'No page deleted.' });
        else
          resolve(null);
      });
    });
  }
  else {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM pages WHERE id=? and user=?';
      db.run(sql, [id, user], function (err) {
        if (err) {
          reject(err);
        }
        if (this.changes !== 1)
          resolve({ error: 'No page deleted.' });
        else
          resolve(null);
      });
    });
  }

}