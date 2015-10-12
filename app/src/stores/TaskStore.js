import appDispatcher from 'dispatcher/AppDispatcher';
import EventEmitter from 'events';
import {OrderedMap, Map} from 'immutable';

const CHANGE_EVENT = 'changed';

const PENDING_ADDITION = 'adding';
const PENDING_REMOVAL = 'removing';
const PENDING_UPDATE = 'updating';

const task = (...attr) => Object.assign({ inEditMode: false, pendingStatus: null }, ...attr);

class TaskStore {
    emitter = new EventEmitter();
    tasks = new OrderedMap();
    pendingChanges = new Map();
    token;

    constructor(dispatcher) {
        this.token = dispatcher.register(action => {
            switch(action.type) {
                case 'ADDING_TASK': {
                    this.pendingChanges = this.pendingChanges.set(action.id, tasks =>
                        tasks.set(
                            action.id,
                            task({ id: action.id, message: action.message, pendingStatus: PENDING_ADDITION })));

                    this._changed();
                    break;
                }
                case 'REMOVING_TASK': {
                    this.pendingChanges = this.pendingChanges.set(action.id, tasks =>
                        tasks.update(
                            action.id,
                            t => task(t, { pendingStatus: PENDING_REMOVAL })));

                    this._changed();
                    break;
                }
                case 'UPDATING_TASK': {
                    this.pendingChanges = this.pendingChanges.set(action.id, tasks =>
                        tasks.update(
                            action.id,
                            t => task(t, { message: action.message, pendingStatus: PENDING_UPDATE, inEditMode: false })));

                    this._changed();
                    break;
                }
                case 'REFRESH_TASK': {
                    const raw = action.task;
                    
                    this.tasks = this.tasks.set(raw.id, task(raw));
                    this.pendingChanges = this.pendingChanges.remove(raw.id);

                    this._changed();
                    break;
                }
                case 'ADD_TASK': {
                    const raw = action.task;
                    
                    this.tasks = this.tasks.set(raw.id, task(raw));
                    this.pendingChanges = this.pendingChanges.remove(action.clientId);

                    this._changed();
                    break;
                }                
                case 'REMOVE_TASK': {
                    this.tasks = this.tasks.delete(action.id);
                    this.pendingChanges = this.pendingChanges.delete(action.id);

                    this._changed();
                    break;
                }
                case 'TASK_TO_EDIT_MODE': {
                    this.tasks = this.tasks.update(
                        action.id,
                        t => task(t, { inEditMode: true }));

                    this._changed();
                    break;
                }
                case 'TASK_TO_VIEW_MODE': {
                    this.tasks = this.tasks.update(
                        action.id,
                        t => task(t, { inEditMode: false }));

                    this._changed();
                    break;
                }
                case 'TASK_ERROR': {
                    this.pendingChanges = this.pendingChanges.remove(action.id);

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
        return this
            .pendingChanges
            .reduce((tasks, change) => change(tasks), this.tasks)
            .toArray();
    }

    addChangeListener(callback) {
        this.emitter.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.emitter.on(CHANGE_EVENT, callback);
    }
}

export default new TaskStore(appDispatcher);
