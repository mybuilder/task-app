import taskServerActions from 'actions/TaskServerActions';

let endpoint = null;
export const setEndpoint = (url) => endpoint = url;

const parseJson = (response) => response.json();
const followLocation = (response) => fetch(response.headers.get('Location'));
const handleError = (response) => {
    if (!response.ok) {
        const error = new Error(response.statusText);
        error.response = response;

        throw error;
    }

    return response;
};

class TaskApi {
    serverActions;

    constructor(serverActions) {
        this.serverActions = serverActions;
    }

    fetchAll() {
        fetch(endpoint)
            .then(parseJson)
            .then(response => this.serverActions.refreshAll(response.tasks))
            .catch(error => this.serverActions.listError(error));
    }

    add(dispatch, message) {
        fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            })
            .then(handleError)
            .then(followLocation)
            .then(parseJson)
            .then(task => dispatch({
                type: 'ADD_TASK',
                raw: task
            }))
            .catch(error => dispatch({
                type: 'ADD_TASK_ERROR',
                message,
                error
            }));
    }

    update(dispatch, self, id, message) {
        fetch(self, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            })
            .then(handleError)
            .then(followLocation)
            .then(parseJson)
            .then(task => dispatch({
                type: 'REFRESH_TASK',
                raw: task
            }))
            .catch(error => dispatch({
                type: 'UPDATE_TASK_ERROR',
                id,
                message
            }));
    }

    remove(dispatch, self, id) {
        fetch(self, { method: 'DELETE' })
            .then(handleError)
            .then(task => dispatch({
                type: 'REMOVE_TASK',
                id
            }))
            .catch(error => dispatch({
                type: 'REMOVE_TASK_ERROR',
                id
            }));
    }
}

export default new TaskApi(taskServerActions);
