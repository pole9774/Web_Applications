# Exam #1: "CMSmall"
## Student: s314818 POLETTI ALESSANDRO 

## React Client Application Routes

- Route `/`: pagina principale, per utenti non autenticati mostra la lista delle pagine, per utenti autenticati mostra la lista delle pagine e la lista 
  delle proprie pagine
- Route `/pages/:id`: pagina di visualizzazione di una singola pagina
- Route `/pages/add`: pagina per creare una nuova pagina
- Route `/edit/:id`: pagina di modifica di una pagina
- Route `/login`: pagina per fare il login

## API Server

### Autenticazione

- POST `/api/sessions`
  - Descrizione: autentica l'utente che sta provando a fare il login
  - Request body: credenziali di chi sta provando a fare il login

  ``` JSON
  {
    "username": "username",
    "password": "password"
  }
  ```

  - Response: `200 OK` (success)
  - Responde body: utente autenticato

  ``` JSON
  {
    "id": 1,
    "username": "marco@polito.it",
    "name": "Marco"
  }
  ```

  - Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)

- GET `/api/sessions/current`
  - Descrizione: controlla se l'utente corrente ha fato il login e i suoi dati
  - Request body: nessuno
  - Response: `200 OK` (success)

  - Response body: utente autenticato

  ``` JSON
  {
    "id": 1,
    "username": "marco@polito.it",
    "name": "Marco"
  }
  ```

  - Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)

- DELETE `/api/sessions/current`
  - Descrizione: logout dell'utente corrente
  - Request body: nessuno
  - Response: `200 OK` (success)
  - Response body: nessuno
  - Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)

### Altre

- GET `api/pages`
  - Descrizione: ottiene la lista di tutte le pagine, non autenticata
  - Request body: nessuno
  - Request query parameter: nessuno
  - Response: `200 OK` (success)
  - Response body: vettore di oggetti ciascuno descrivente una pagina:

  ``` JSON
  [
    {
      "id": 1,
      "title": "aaa",
      "author": "Marco",
      "date_c": "date_c",
      "date_pub": "date_pub",
      "user": 1
    },
    {
      "id": 2,
      "title": "bbb",
      "author": "Luca",
      "date_c": "date_c",
      "date_pub": "date_pub",
      "user": 2
    },
    ...
  ]
  ```

  - Error responses:  `500 Internal Server Error` (generic error)

- GET `api/pages/user`
  - Descrizione: ottiene la lista di tutte le pagine dell'utente che ha fatto login
  - Request body: nessuno
  - Request query parameter: nessuno
  - Response: `200 OK` (success)
  - Response body: vettore di oggetti ciascuno descrivente una pagina:

  ``` JSON
  [
    {
      "id": 1,
      "title": "aaa",
      "author": "Marco",
      "date_c": "date_c",
      "date_pub": "date_pub",
      "user": 1
    },
    {
      "id": 4,
      "title": "ddd",
      "author": "Marco",
      "date_c": "date_c",
      "date_pub": "date_pub",
      "user": 1
    },
    ...
  ]
  ```

  - Error responses:  `500 Internal Server Error` (generic error)

- GET `api/pages/:id`
  - Descrizione: ritorna la pagina corrispondente all'id, non autenticata
  - Request body: nessuno
  - Response: `200 OK` (success)
  - Response body: un oggett corrispondente alla pagina richiesta:

  ``` JSON
  [
    {
      "id": 2,
      "title": "bbb",
      "author": "Luca",
      "date_c": "date_c",
      "date_pub": "date_pub",
      "user": 2
    }
  ]
  ```

  - Error responses:  `500 Internal Server Error` (generic error), `404 Not Found` (not present or unavailable)

- GET `api/info`
  - Descrizione: ritorna le informazioni del sito
  - Request body: nessuno
  - Response `200 OK` (success)
  - Response body:
  
  ``` JSON
  [
    {
      "id": 1,
      "name": "sitename"
    },
    ...
  ]
  ```

  - Error responses:  `500 Internal Server Error` (generic error), `404 Not Found` (not present or unavailable)

- GET `api/info/:id`
  - Descrizione: ritorna la info corrispondente all'id, non autenticata
  - Request body: nessuno
  - Response: `200 OK` (success)
  - Response body: un oggett corrispondente alla pagina richiesta:

  ``` JSON
  [
    {
      "id": 2,
      "name": "aaa"
    }
  ]
  ```

  - Error responses:  `500 Internal Server Error` (generic error), `404 Not Found` (not present or unavailable)

- POST `/api/pages`
  - Descrizione: aggiunge una nuova pagina dello user 1
  - Request body: descrizione dell'oggetto da aggiungere

  ``` JSON
  {
    "id": 1,
      "title": "aaa",
      "author": "Marco",
      "date_c": "date_c",
      "date_pub": "date_pub",
      "user": 1
  }
  ```

  - Response: `200 OK` (success)
  - Response body: oggetto come rappresentato nel db
  - Error responses: `503 Service Unavailable` (database error)

- PUT `/api/pages/:id`
  - Descrizione: modifica una pagina esistente
  - Request body: descrizione dell'oggetto da modificare

  ``` JSON
  {
    "id": 1,
    "title": "aaa",
    "author": "Marco",
    "date_c": "date_c",
    "date_pub": "date_pub",
    "user": 1
  }
  ```

  - Response: `200 OK` (success)
  - Response body: oggetto come rappresentato nel db
  - Error responses: `503 Service Unavailable` (database error)

- PUT `/api/info/:id`
  - Descrizione: modifica una info del sito, solo admin
  - Request body: descrizione dell'oggetto da modificare (nome sito -> id=1)

  ``` JSON
  {
    "id": 1,
    "name": "nuovonome"
  }
  ```

  - Response: `200 OK` (success)
  - Response body: oggetto come rappresentato nel db
  - Error responses: `503 Service Unavailable` (database error)

- DELETE `api/pages/:id`
  - Descrizione: elimina una pagina esistente
  - Request body: nessuno
  - Response: `200 OK` (success)
  - Error responses:  `503 Service Unavailable` (database error)


## Database Tables

- Table `users` - (id, name, email, hash, salt)
- Table `pages` - (id, author, date_c, date_pub, user)
- ...

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

