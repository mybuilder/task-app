import taskServerActions from 'actions/TaskServerActions';

let endpoint = null;
export const setEndpoint = (url) => endpoint = url;

const parseJson = (response) => response.json();
const delay = (fn) => setTimeout(fn, 500);

class TaskApi {
    serverActions;

    constructor(serverActions) {
        this.serverActions = serverActions;
    }

    fetchAll() {
        fetch(endpoint)
            .then(parseJson)
            .then(tasks => this.serverActions.refreshAll(tasks))
            .catch(error => this.serverActions.listError(error));
    }

    add(id, message) {
        fetch(endpoint, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, message })
            })
            .then(parseJson)
            .then(task => delay(() => this.serverActions.add(id, task)))
            .catch(error => this.serverActions.taskError(id, error));
    }

    update(id, message) {
        fetch(endpoint + '/' + id, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, message })
            })
            .then(parseJson)
            .then(task => delay(() => this.serverActions.refresh(task)))
            .catch(error => this.serverActions.taskError(id, error));
    }

    remove(id) {
        fetch(endpoint + '/' + id, { method: 'delete' })
            .then(parseJson)
            .then(_ => delay(() => this.serverActions.remove(id)))
            .catch(error => this.serverActions.taskError(id, error));
    }
}

export default new TaskApi(taskServerActions);
