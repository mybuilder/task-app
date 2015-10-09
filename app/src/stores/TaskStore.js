import appDispatcher from 'dispatcher/AppDispatcher';
import EventEmitter from 'events';

const CHANGE_EVENT = 'changed';

const task = (...x) => Object.assign({ inEditMode: false }, ...x);
const update = (tasks, id, fn) =>
    tasks.reduce((tasks, task) => [ ...tasks, task.id === id ? fn(task) : task ], []);
const replace = (tasks, raw) => [ ...tasks.filter(t => t.id !== raw.id), task(raw) ];

class TaskStore {
    emitter = new EventEmitter();
    tasks = [];
    token;

    constructor(dispatcher) {
        this.token = dispatcher.register(action => {
            switch(action.type) {
                case 'REFRESH_TASK': {
                    this.tasks = replace(this.tasks, action.task);

                    this._changed();
                    break;
                }
                case 'ADD_TASK': {
                    this.tasks = [ ...this.tasks, task({ id: action.id, message: action.message, 'isAdding': true }) ];

                    this._changed();
                    break;
                }
                case 'REMOVE_TASK': {
                    this.tasks = this.tasks.filter(t => t.id !== action.id);

                    this._changed();
                    break;
                }
                case 'UPDATE_TASK': {
                    this.tasks = update(this.tasks, action.id, t => task(t, { message: action.message, inEditMode: false }));

                    this._changed();
                    break;
                }
                case 'TASK_TO_EDIT_MODE': {
                    this.tasks = update(this.tasks, action.id, t => task(t, { inEditMode: true }));

                    this._changed();
                    break;
                }
                case 'TASK_TO_VIEW_MODE': {
                    this.tasks = update(this.tasks, action.id, t => task(t, { inEditMode: false }));

                    this._changed();
                    break;
                }
            }
        });
    }

    _changed() {
        this.emitter.emit(CHANGE_EVENT);
    }

    all() {
        return this.tasks;
    }

    addChangeListener(callback) {
        this.emitter.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.emitter.on(CHANGE_EVENT, callback);
    }
}

export default new TaskStore(appDispatcher);
