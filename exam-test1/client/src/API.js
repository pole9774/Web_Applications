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
 * The list of pages could be filtered in the server-side through the optional parameter: filter.
 */
const getPages = async (filter) => {
    // page.date_pub could be null or a string in the format YYYY-MM-DD
    return getJson(
        filter
            ? fetch(SERVER_URL + 'pages?filter=' + filter, { credentials: 'include' })
            : fetch(SERVER_URL + 'pages', { credentials: 'include' })
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
    return getJson(fetch(SERVER_URL + 'pages/' + pageId, { credentials: 'include' }))
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

/**
 * This function wants a page object as parameter. If the pageId exists, it updates the page in the server side.
 */
function updatePage(page) {
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
 * This funciton adds a new page in the back-end library.
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

const API = { getPages, getPage, addPage, deletePage, updatePage };
export default API;