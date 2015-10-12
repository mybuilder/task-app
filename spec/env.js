import {Dispatcher} from 'flux';
import {TaskStore} from 'stores/TaskStore';
import {TaskClientActions} from 'actions/TaskClientActions';
import {TaskServerActions} from 'actions/TaskServerActions';

export function setup() {
    const dispatcher = new Dispatcher();
    const taskStore = new TaskStore(dispatcher);
    const taskApi = {};
    const taskClientActions = new TaskClientActions(dispatcher, taskApi);
    const taskServerActions = new TaskServerActions(dispatcher);

    return {
        taskStore,
        taskApi,
        taskClientActions,
        taskServerActions
    };
}
