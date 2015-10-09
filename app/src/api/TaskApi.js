import taskServerActions from 'actions/TaskServerActions';

let endpoint = null;
export const setEndpoint = (url) => endpoint = url;

const parseJson = (response) => response.json();
const delay = (fn) => setTimeout(fn, 2.5 * 1000);

class TaskApi {
    serverActions;

    constructor(serverActions) {
        this.serverActions = serverActions;
    }

    fetchAll() {
        fetch(endpoint)
            .then(parseJson)
            .then(tasks => this.serverActions.refreshAll(tasks))
    }

    add(id, message) {
        fetch(endpoint, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, message })
            })
            .then(parseJson)
            .then(task => delay(() => this.serverActions.refresh(task)));
    }

    update(id, message) {
        fetch(endpoint + '/' + id, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, message })
            })
            .then(parseJson)
            .then(task => delay(() => this.serverActions.refresh(task)));
    }

    remove(id) {
        fetch(endpoint + '/' + id, { method: 'delete' })
            .then(parseJson)
            .then(_ => delay(() => this.serverActions.remove(id)));
    }
}

export default new TaskApi(taskServerActions);
