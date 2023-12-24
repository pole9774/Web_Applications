BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "projects" (
	"id"	        INTEGER PRIMARY KEY AUTOINCREMENT,
	"name"	        TEXT,
	"description"	TEXT
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

INSERT INTO "users" (name, email, hash, salt) VALUES ("Mario Rossi", "mario.rossi@polito.it", "5e5f3e89da657f0553dd61d75cbbed3d67edcd8448c4720aa9d4d7af35c7530068b9848ffcf8d563819fb7684f170052f6d56d47710a9f4a63fdda1bfabaf406", "3me9dkwma110smdp");

COMMIT;

-- sqlite3 projects.db
-- .databases
-- .quit
