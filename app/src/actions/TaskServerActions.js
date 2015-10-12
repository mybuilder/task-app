import appDispatcher from 'dispatcher/AppDispatcher';

class TaskServerActions {
    dispatcher;

    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }

    refreshAll(tasks) {
        tasks.forEach(t => this.refresh(t));
    }

    refresh(task) {
        this.dispatcher.dispatch({
            type: 'REFRESH_TASK',
            task
        });
    }

    add(clientId, task) {
        this.dispatcher.dispatch({
            type: 'ADD_TASK',
            clientId,
            task
        });
    }

    remove(id) {
        this.dispatcher.dispatch({
            type: 'REMOVE_TASK',
            id
        })
    }

    error(id, error) {
        this.dispatcher.dispatch({
            type: 'TASK_ERROR',
            id,
            error
        });
    }
}

export default new TaskServerActions(appDispatcher);
