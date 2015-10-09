import appDispatcher from 'dispatcher/AppDispatcher';

class TaskClientActions {
    dispatcher;

    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }

    add(message) {
        this.dispatcher.dispatch({
            type: 'ADD_TASK',
            message
        });
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

export default new TaskClientActions(appDispatcher);
