import appDispatcher from 'dispatcher/AppDispatcher';
import EventEmitter from 'events';
import {OrderedMap, Map, Record} from 'immutable';

const CHANGE_EVENT = 'changed';

const PENDING_ADDITION = 'adding';
const PENDING_REMOVAL = 'removing';
const PENDING_UPDATE = 'updating';

export class TaskStore {
    _token;
    _state; // immutable state
    _stateExcludingOptimistic; // immutable state that excludes optimistic actions changes
    _optimisticActions = new OrderedMap();
    _emitter = new EventEmitter();

    constructor(dispatcher, initialState = new OrderedMap()) {
        this._state = initialState;
        this._stateExcludingOptimistic = initialState;

        this._token = dispatcher.register(action => {
            const startingState = this._stateExcludingOptimistic;
            const endingState = this.transform(startingState, action);

            if (startingState !== endingState || action.replacesOptimisticActionId) {
                if (action.replacesOptimisticActionId) {
                    this._optimisticActions = this._optimisticActions.delete(action.replacesOptimisticActionId);
                }

                if (action.optimisticActionId) {
                    this._optimisticActions = this._optimisticActions.set(action.optimisticActionId, action);
                } else {
                    this._stateExcludingOptimistic = endingState;
                }

                this._state = this._optimisticActions.reduce(this.transform, this._stateExcludingOptimistic);

                this._emitter.emit(CHANGE_EVENT);
            }
        });
    }

    transform(state, action) {
        switch(action.type) {
            case 'UPDATE_TASK':
                return state
                    .setIn([action.id, 'pendingStatus'], PENDING_UPDATE)
                    .setIn([action.id, 'inEditMode'], false)
                    .setIn([action.id, 'message'], action.message.trim());

            case 'REFRESH_TASK':
                return state.set(action.raw.id, new Task(action.raw));

            case 'ADD_TASK':
                return state.set(action.raw.id, new Task(action.raw));

            case 'REMOVE_TASK':
                return state.delete(action.id);

            case 'TASK_TO_EDIT_MODE':
                return state.setIn([action.id, 'inEditMode'], true);

            case 'TASK_TO_VIEW_MODE':
                return state.setIn([action.id, 'inEditMode'], false);

            case 'TASK_ERROR':
                // TODO add error handling
                return state;

            default:
                return state;
        }
    }

    all() {
        return this._state.toArray().map(t => t.toJS());
    }

    addChangeListener(callback) {
        this._emitter.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this._emitter.removeListener(CHANGE_EVENT, callback);
    }
}

export class Task extends Record({
  id: undefined,
  inEditMode: false,
  message: undefined,
  pendingStatus: null,
  _links: {
      self: {
          href: undefined
      }
  }
}) {

};

export default new TaskStore(appDispatcher);
