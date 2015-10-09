import appDispatcher from 'dispatcher/AppDispatcher';
import EventEmitter from 'events';
import {OrderedMap} from 'immutable';

const CHANGE_EVENT = 'changed';

const IS_ADDING = 'adding';
const IS_REMOVING = 'removing';
const IS_UPDATING = 'updating';

const task = (...attr) => Object.assign({ inEditMode: false, status: null }, ...attr);

class TaskStore {
    emitter = new EventEmitter();
    tasks = new OrderedMap();
    token;

    constructor(dispatcher) {
        this.token = dispatcher.register(action => {
            switch(action.type) {
                case 'REFRESH_TASK': {
                    const raw = action.task;
                    this.tasks = this.tasks.update(raw.id, _ => task(raw));

                    this._changed();
                    break;
                }
                case 'ADDING_TASK': {
                    this.tasks = this.tasks.set(
                        action.id,
                        task({ id: action.id, message: action.message, status: IS_ADDING }));

                    this._changed();
                    break;
                }
                case 'REMOVING_TASK': {
                    this.tasks = this.tasks.update(
                        action.id, 
                        t => task(t, { status: IS_REMOVING }));

                    this._changed();
                    break;
                }
                case 'UPDATING_TASK': {
                    this.tasks = this.tasks.update(
                        action.id, 
                        t => task(t, { message: action.message, status: IS_UPDATING, inEditMode: false }));

                    this._changed();
                    break;
                }
                case 'REMOVE_TASK': {
                    this.tasks = this.tasks.delete(action.id);

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
            }
        });
    }

    _changed() {
        this.emitter.emit(CHANGE_EVENT);
    }

    all() {
        return this.tasks.toArray();
    }

    addChangeListener(callback) {
        this.emitter.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.emitter.on(CHANGE_EVENT, callback);
    }
}

export default new TaskStore(appDispatcher);
