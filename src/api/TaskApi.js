import taskServerActions from 'actions/TaskServerActions';

let endpoint = null;
export const setEndpoint = (url) => endpoint = url;

const parseJson = (response) => response.json();
const followLocation = (response) => fetch(response.headers.get('Location'));

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

    add(id, message) {
        fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            })
            .then(followLocation)
            .then(parseJson)
            .then(task => this.serverActions.add(id, task))
            .catch(error => this.serverActions.taskError(id, error));
    }

    update(self, id, message) {
        fetch(self, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            })
            .then(followLocation)
            .then(parseJson)
            .then(task => this.serverActions.refresh(task))
            .catch(error => this.serverActions.taskError(id, error));
    }

    remove(self, id) {
        fetch(self, { method: 'DELETE' })
            .then(_ => this.serverActions.remove(id))
            .catch(error => this.serverActions.taskError(id, error));
    }
}

export default new TaskApi(taskServerActions);
