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
            type: 'ADDING_TASK',
            id,
            message
        });

        this.api.add(id, message);
    }

    remove(id) {
        this.dispatcher.dispatch({
            type: 'REMOVING_TASK',
            id
        });

        this.api.remove(id);
    }

    update(id, message) {
        this.dispatcher.dispatch({
            type: 'UPDATING_TASK',
            id,
            message
        });

        this.api.update(id, message);
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
