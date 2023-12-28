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
 * Getting from the server side and returning the list of projects.
 */
const getProjects = async () => {
    return getJson(
        fetch(SERVER_URL + 'projects', { credentials: 'include' })
    ).then(json => {
        return json.map((project) => {
            const clientProject = {
                id: project.id,
                name: project.name,
                description: project.description
            }
            return clientProject;
        })
    })
}

/**
 * Getting from the server side and returning the list of questions.
 */
const getQuestions = async () => {
    return getJson(
        fetch(SERVER_URL + 'questions', { credentials: 'include' })
    ).then(json => {
        return json.map((question) => {
            const clientQuestion = {
                id: question.id,
                title: question.title,
                description: question.description,
                userid: question.userid,
                projectid: question.projectid
            }
            return clientQuestion;
        })
    })
}

/**
 * This function adds a new question in the back-end library.
 */
function addQuestion(question) {
    return getJson(
        fetch(SERVER_URL + "questions/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(question)
        })
    )
}

/**
 * Getting from the server side and returning the list of solutions.
 */
const getSolutions = async () => {
    return getJson(
        fetch(SERVER_URL + 'solutions', { credentials: 'include' })
    ).then(json => {
        return json.map((solution) => {
            const clientSolution = {
                id: solution.id,
                text: solution.text,
                userid: solution.userid,
                questionid: solution.questionid
            }
            return clientSolution;
        })
    })
}

/**
 * This function adds a new solution in the back-end library.
 */
function addSolution(solution) {
    return getJson(
        fetch(SERVER_URL + "solutions/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(solution)
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

const API = { logIn, getUserInfo, logOut, getProjects, getQuestions, addQuestion, getSolutions, addSolution };
export default API;