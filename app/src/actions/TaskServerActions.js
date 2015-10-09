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

    remove(id) {
        this.dispatcher.dispatch({
            type: 'REMOVE_TASK',
            id
        })
    }
}

export default new TaskServerActions(appDispatcher);
