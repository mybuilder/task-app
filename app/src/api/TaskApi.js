import taskServerActions from 'actions/TaskServerActions';

let endpoint = null;

export function setEndpoint(url) {
    endpoint = url;
}

function parseJson(response) {
    return response.json();
}

class TaskApi {
    serverActions;

    constructor(serverActions) {
        this.serverActions = serverActions;
    }

    fetchAll() {
        fetch(endpoint)
            .then(parseJson)
            .then(tasks => this.serverActions.refreshAll(tasks));
    }

    add(id, message) {
        fetch(endpoint, {
                method: 'post',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, message })
            })
            .then(parseJson)
            .then(task => this.serverActions.refresh(task));
    }
}

export default new TaskApi(taskServerActions);
