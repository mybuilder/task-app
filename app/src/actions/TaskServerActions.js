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
            task: task
        });
    }
}

export default new TaskServerActions(appDispatcher);
