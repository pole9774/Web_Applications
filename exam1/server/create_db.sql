BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "pages" (
	"id"	    INTEGER PRIMARY KEY AUTOINCREMENT,
	"title"	    TEXT,
	"author"	TEXT,
	"date_c"	TEXT,
	"date_pub"	TEXT,
	"user"		INTEGER
);

CREATE TABLE IF NOT EXISTS "blocks" (
	"id"	    INTEGER PRIMARY KEY AUTOINCREMENT,
	"id_page"	INTEGER,
	"type"	    INTEGER,
	"content"	TEXT,
    "index"     INTEGER
);

CREATE TABLE IF NOT EXISTS "users" (
	"id"	    INTEGER PRIMARY KEY AUTOINCREMENT,
	"name"	    TEXT,
	"email"		TEXT,
	"hash"		TEXT,
	"salt"		TEXT,
	"admin"		INTEGER
);

CREATE TABLE IF NOT EXISTS "info" (
	"id"	    INTEGER PRIMARY KEY AUTOINCREMENT,
	"name"	    TEXT
);

INSERT INTO "pages" (title, author, date_c, date_pub, user) VALUES ("aaa", "Marco", "2023-03-01", "2023-04-12", 1);
INSERT INTO "pages" (title, author, date_c, date_pub, user) VALUES ("bbb", "Pippo", "2021-03-10", "2023-01-12", 5);
INSERT INTO "pages" (title, author, date_c, date_pub, user) VALUES ("ccc", "Marco", "2022-03-05", "2022-03-12", 1);
INSERT INTO "pages" (title, author, date_c, date_pub, user) VALUES ("ddd", "Alice", "2020-02-10", "2021-12-12", 4);
INSERT INTO "pages" (title, author, date_c, date_pub, user) VALUES ("zee", "Alice", "2023-04-23", "2023-05-25", 4);
INSERT INTO "pages" (title, author, date_c, date_pub, user) VALUES ("fff", "Marco", "2023-03-10", "2023-03-12", 1);
INSERT INTO "pages" (title, author, date_c, date_pub, user) VALUES ("qqq", "Matteo", "2021-03-10", "2023-01-12", 3);
INSERT INTO "pages" (title, author, date_c, date_pub, user) VALUES ("cmm", "Marco", "2022-03-10", "2022-03-12", 1);
INSERT INTO "pages" (title, author, date_c, date_pub, user) VALUES ("nnd", "Pippo", "2022-02-10", "2023-02-10", 5);
INSERT INTO "pages" (title, author, date_c, date_pub, user) VALUES ("epe", "Alice", "2023-11-21", "2023-12-25", 4);

INSERT INTO "users" (name, email, hash, salt, admin) VALUES ("Marco", "marco@polito.it", "0d049138518bb1ef8ad03ee82c3ae58dbbbaa91580f9201a77bf786fff19f920fcd53f1c4adf577af69a09535e920ffa4bbf5f7c9011dbebb2eb6182703034df", "72e4eeb14def3b21", 1);
INSERT INTO "users" (name, email, hash, salt, admin) VALUES ("Luca", "luca@polito.it", "a622dce857c8ee5c455743974d2b578473e63dd331d577525ac635c5e3c398980f7f5455c1ac05072ae9d254c53a8210cdf9e36342f80894468ec5f693785c86", "a8b618c717683608", 0);
INSERT INTO "users" (name, email, hash, salt, admin) VALUES ("Matteo", "matteo@polito.it", "96cfb378bf553874c95d1c932ac9deeb9251961b07cd5a9af67643af26ccb1f4ca35c82c91b5e706be8523306b56fe8c937c23436bb731cf06d18af250c3065c", "e818f0647b4e1fe0", 0);
INSERT INTO "users" (name, email, hash, salt, admin) VALUES ("Alice", "alice@polito.it", "51bfdcf3d7f5382a62e1bfb282ad347df413f1cf9cc1e44b004c7abe080851735da08c4fd709c72bdee6cf1f4755239eda58a3db10baa82f19cd37d8f07f908c", "3ne8dn3iem29smwj", 0);
INSERT INTO "users" (name, email, hash, salt, admin) VALUES ("Pippo", "pippo@polito.it", "5e5f3e89da657f0553dd61d75cbbed3d67edcd8448c4720aa9d4d7af35c7530068b9848ffcf8d563819fb7684f170052f6d56d47710a9f4a63fdda1bfabaf406", "3me9dkwma110smdp", 0);

INSERT INTO "info" (name) VALUES ("PageShare");
INSERT INTO "info" (name) VALUES ("nientediimportante");

COMMIT;

-- sqlite3 pages.db