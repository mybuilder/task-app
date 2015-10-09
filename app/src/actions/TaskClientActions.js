import appDispatcher from 'dispatcher/AppDispatcher';
import taskApi from 'api/TaskApi';
import guid from 'lite-guid';

class TaskClientActions {
    dispatcher;
    api;

    constructor(dispatcher, api) {
        this.dispatcher = dispatcher;
        this.api = api;
    }

    fetchAll() {
        this.api.fetchAll();
    }

    add(message) {
        const id = guid.create();

        this.dispatcher.dispatch({
            type: 'ADD_TASK',
            id,
            message
        });

        this.api.add(id, message);
    }

    remove(id) {
        this.dispatcher.dispatch({
            type: 'REMOVE_TASK',
            id
        });
    }

    update(id, message) {
        this.dispatcher.dispatch({
            type: 'UPDATE_TASK',
            id,
            message
        });
    }

    editMode(id) {
        this.dispatcher.dispatch({
            type: 'TASK_TO_EDIT_MODE',
            id
        });
    }

    viewMode(id) {
        this.dispatcher.dispatch({
            type: 'TASK_TO_VIEW_MODE',
            id
        });
    }
}

export default new TaskClientActions(appDispatcher, taskApi);
