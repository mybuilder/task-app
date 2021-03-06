import appDispatcher from 'dispatcher/AppDispatcher';
import taskApi from 'api/TaskApi';
import guid from 'lite-guid';

export class TaskClientActions {
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
        const clientId = guid.create();

        this.dispatcher.dispatch({
            type: 'ADDING_TASK',
            id: clientId,
            message
        });

        this.api.add(clientId, message);
    }

    remove(self, id) {
        this.dispatcher.dispatch({
            type: 'REMOVING_TASK',
            id
        });

        this.api.remove(self, id);
    }

    update(self, id, message) {
        this.dispatcher.dispatch({
            type: 'UPDATING_TASK',
            id,
            message
        });

        this.api.update(self, id, message);
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
