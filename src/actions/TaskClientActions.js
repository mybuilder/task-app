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
        this.api.add(this.optimisticAction({
            type: 'ADD_TASK',
            raw: {
                id: guid.create(),
                message
            }
        }), message);
    }

    remove(self, id) {
        this.api.remove(this.optimisticAction({
            type: 'REMOVE_TASK',
            id
        }), self, id);
    }

    update(self, id, message) {
        this.api.update(this.optimisticAction({
            type: 'UPDATE_TASK',
            id,
            message
        }), self, id, message);
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

    optimisticAction(action) {
        const optimisticActionId = guid.create();
        const timeout = setTimeout(() => {
            console.error(`Optimistic action timed out (id: ${optimisticActionId})`, action);

            this.dispatcher.dispatch({ type: 'OPTIMISTIC_ACTION_TIMEOUT', replacesOptimisticActionId: optimisticActionId});
        }, 2000);

        this.dispatcher.dispatch({...action, optimisticActionId});

        return (newAction = action) => {
            clearTimeout(timeout);

            this.dispatcher.dispatch({...newAction, replacesOptimisticActionId: optimisticActionId});
        };
    }
}

export default new TaskClientActions(appDispatcher, taskApi);
