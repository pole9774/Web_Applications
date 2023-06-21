BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "pages" (
	"id"	    INTEGER PRIMARY KEY AUTOINCREMENT,
	"title"	    TEXT,
	"author"	TEXT,
	"date_c"	DATE,
	"date_pub"	DATE,
	"user"		INTEGER
);

CREATE TABLE IF NOT EXISTS "blocks" (
	"id"	    INTEGER PRIMARY KEY AUTOINCREMENT,
	"id_page"	INTEGER,
	"type"	    INTEGER,
	"content"	TEXT,
    "index"     INTEGER
);

INSERT INTO "pages" (title, author, date_c, date_pub, user) VALUES ("aaa", "Marco", "2023-03-10", "2023-03-12", 1);
INSERT INTO "pages" (title, author, date_c, date_pub, user) VALUES ("bbb", "Giulio", "2021-03-10", "2023-01-12", 1);
INSERT INTO "pages" (title, author, date_c, date_pub, user) VALUES ("ccc", "Marco", "2022-03-10", "2022-03-12", 1);
INSERT INTO "pages" (title, author, date_c, date_pub, user) VALUES ("ddd", "Bob", "2023-02-10", "2023-02-12", 1);
INSERT INTO "pages" (title, author, date_c, date_pub, user) VALUES ("eee", "Alice", "2023-03-23", "2023-03-25", 1);

COMMIT;

-- sqlite3 pages.db