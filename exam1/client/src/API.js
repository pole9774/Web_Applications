import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost:3001/api/';


/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
    // server API always return JSON, in case of error the format is the following { error: <message> } 
    return new Promise((resolve, reject) => {
        httpResponsePromise
            .then((response) => {
                if (response.ok) {

                    // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
                    response.json()
                        .then(json => resolve(json))
                        .catch(err => reject({ error: "Cannot parse server response" }))

                } else {
                    // analyzing the cause of error
                    response.json()
                        .then(obj =>
                            reject(obj)
                        ) // error msg in the response body
                        .catch(err => reject({ error: "Cannot parse server response" })) // something else
                }
            })
            .catch(err =>
                reject({ error: "Cannot communicate" })
            ) // connection error
    });
}

/**
 * Getting from the server side and returning the list of pages.
 */
const getPages = async () => {
    return getJson(
        fetch(SERVER_URL + 'pages')
    ).then(json => {
        return json.map((page) => {
            const clientPage = {
                id: page.id,
                title: page.title,
                author: page.author,
                date_c: dayjs(page.date_c),
                user: page.user
            }
            if (page.date_pub)
                clientPage.date_pub = dayjs(page.date_pub);
            return clientPage;
        })
    })
}

/**
 * Getting from the server side and returning the list of pages of the user.
 */
const getUserPages = async () => {
    return getJson(
        fetch(SERVER_URL + 'pages/user', { credentials: 'include' })
    ).then(json => {
        return json.map((page) => {
            const clientPage = {
                id: page.id,
                title: page.title,
                author: page.author,
                date_c: dayjs(page.date_c),
                user: page.user
            }
            if (page.date_pub)
                clientPage.date_pub = dayjs(page.date_pub);
            return clientPage;
        })
    })
}

/**
 * Getting and returing a page, specifying its pageId.
 */
const getPage = async (pageId) => {
    return getJson(fetch(SERVER_URL + 'pages/' + pageId))
        .then(page => {
            const clientPage = {
                id: page.id,
                title: page.title,
                author: page.author,
                date_c: dayjs(page.date_c),
                user: page.user
            }
            if (page.date_pub != null)
                clientPage.date_pub = dayjs(page.date_pub);
            return clientPage;
        })
}

const getInfoById = async (infoId) => {
    return getJson(fetch(SERVER_URL + 'info/' + infoId))
        .then(i => {
            const clientInfo = {
                id: i.id,
                name: i.name
            }
            return clientInfo;
        })
}

const getInfo = async () => {
    return getJson(
        fetch(SERVER_URL + 'info')
    ).then(json => {
        return json.map((i) => {
            const clientInfo = {
                id: i.id,
                name: i.name
            }
            return clientInfo;
        })
    })
}

function updateInfo(info) {
    return getJson(
        fetch(SERVER_URL + "info/" + info.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(info) // dayjs date is serialized correctly by the .toJSON method override
        })
    )
}

/**
 * This function wants a page object as parameter. If the pageId exists, it updates the page in the server side.
 */
function updatePage(page) {
    if (page && (page.date_c instanceof dayjs))
        page.date_c = page.date_c.format("YYYY-MM-DD");
    if (page && page.date_pub && (page.date_pub instanceof dayjs))
        page.date_pub = page.date_pub.format("YYYY-MM-DD");
    return getJson(
        fetch(SERVER_URL + "pages/" + page.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(page) // dayjs date is serialized correctly by the .toJSON method override
        })
    )
}

/**
 * This function adds a new page in the back-end library.
 */
function addPage(page) {
    return getJson(
        fetch(SERVER_URL + "pages/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(page)
        })
    )
}

/**
 * This function deletes a page from the back-end library.
 */
function deletePage(pageId) {
    return getJson(
        fetch(SERVER_URL + "pages/" + pageId, {
            method: 'DELETE',
            credentials: 'include'
        })
    )
}

/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
    return getJson(fetch(SERVER_URL + 'sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
        body: JSON.stringify(credentials),
    })
    )
};

/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
    return getJson(fetch(SERVER_URL + 'sessions/current', {
        // this parameter specifies that authentication cookie must be forwared
        credentials: 'include'
    })
    )
};

/**
 * This function destroy the current user's session and execute the log-out.
 */
const logOut = async () => {
    return getJson(fetch(SERVER_URL + 'sessions/current', {
        method: 'DELETE',
        credentials: 'include'  // this parameter specifies that authentication cookie must be forwared
    })
    )
}

const API = { logIn, getUserInfo, logOut, getPages, getUserPages, updatePage, deletePage, addPage, getPage, getInfo, getInfoById, updateInfo };
export default API;