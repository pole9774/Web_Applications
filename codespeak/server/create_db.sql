BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "projects" (
	"id"	        INTEGER PRIMARY KEY AUTOINCREMENT,
	"name"	        TEXT,
	"description"	TEXT
);

CREATE TABLE IF NOT EXISTS "questions" (
	"id"	        INTEGER PRIMARY KEY AUTOINCREMENT,
	"title"	        TEXT,
	"description"	TEXT,
	"userid"		INTEGER,
	"projectid"		INTEGER
);

CREATE TABLE IF NOT EXISTS "solutions" (
	"id"	        INTEGER PRIMARY KEY AUTOINCREMENT,
	"text"	        TEXT,
	"userid"		INTEGER,
	"questionid"	INTEGER
);

CREATE TABLE IF NOT EXISTS "users" (
	"id"	    INTEGER PRIMARY KEY AUTOINCREMENT,
	"name"	    TEXT,
	"email"		TEXT,
	"hash"		TEXT,
	"salt"		TEXT
);

INSERT INTO "projects" (name, description) VALUES ("Project A", "Lorem ipsum...");
INSERT INTO "projects" (name, description) VALUES ("Project B", "Lorem ipsum...");
INSERT INTO "projects" (name, description) VALUES ("Project C", "Lorem ipsum...");
INSERT INTO "projects" (name, description) VALUES ("Project D", "Lorem ipsum...");
INSERT INTO "projects" (name, description) VALUES ("Project E", "Lorem ipsum...");

INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question A", "Lorem ipsum...", 1, 1);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question B", "Lorem ipsum...", 1, 2);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question C", "Lorem ipsum...", 2, 3);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question D", "Lorem ipsum...", 3, 4);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question E", "Lorem ipsum...", 4, 1);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question F", "Lorem ipsum...", 2, 1);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question G", "Lorem ipsum...", 5, 2);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question H", "Lorem ipsum...", 3, 2);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question I", "Lorem ipsum...", 4, 2);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question J", "Lorem ipsum...", 1, 3);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question K", "Lorem ipsum...", 5, 4);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question L", "Lorem ipsum...", 5, 4);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question M", "Lorem ipsum...", 2, 1);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question N", "Lorem ipsum...", 4, 1);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question O", "Lorem ipsum...", 4, 2);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question P", "Lorem ipsum...", 2, 2);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question Q", "Lorem ipsum...", 3, 1);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question R", "Lorem ipsum...", 3, 3);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question S", "Lorem ipsum...", 1, 3);
INSERT INTO "questions" (title, description, userid, projectid) VALUES ("Question T", "Lorem ipsum...", 2, 1);

INSERT INTO "solutions" (text, userid, questionid) VALUES ("Lorem ipsum...", 3, 11);
INSERT INTO "solutions" (text, userid, questionid) VALUES ("Lorem ipsum...", 2, 8);
INSERT INTO "solutions" (text, userid, questionid) VALUES ("Lorem ipsum...", 1, 1);
INSERT INTO "solutions" (text, userid, questionid) VALUES ("Lorem ipsum...", 1, 4);
INSERT INTO "solutions" (text, userid, questionid) VALUES ("Lorem ipsum...", 2, 11);
INSERT INTO "solutions" (text, userid, questionid) VALUES ("Lorem ipsum...", 3, 1);
INSERT INTO "solutions" (text, userid, questionid) VALUES ("Lorem ipsum...", 4, 5);
INSERT INTO "solutions" (text, userid, questionid) VALUES ("Lorem ipsum...", 4, 5);
INSERT INTO "solutions" (text, userid, questionid) VALUES ("Lorem ipsum...", 1, 3);
INSERT INTO "solutions" (text, userid, questionid) VALUES ("Lorem ipsum...", 3, 2);

INSERT INTO "users" (name, email, hash, salt) VALUES ("Mario Rossi", "mario.rossi@polito.it", "5e5f3e89da657f0553dd61d75cbbed3d67edcd8448c4720aa9d4d7af35c7530068b9848ffcf8d563819fb7684f170052f6d56d47710a9f4a63fdda1bfabaf406", "3me9dkwma110smdp");

COMMIT;

-- sqlite3 projects.db
-- .databases
-- .quit
