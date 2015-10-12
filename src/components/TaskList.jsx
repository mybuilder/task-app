import React, {Component} from 'react';
import taskClientActions from 'actions/TaskClientActions';
import TaskInput from 'components/TaskInput';

export default class TaskList extends Component {
    render() {
        return (
            <ul>
                {this.props.tasks.map(task =>
                    <TaskItem
                        key={task.id}
                        id={task.id}
                        status={task.pendingStatus}
                        inEditMode={task.inEditMode}
                        message={task.message} />)}
            </ul>
        );
    }
}

const preventDefault = (fn) => (e) => {
    e.preventDefault();
    fn();
};

class TaskItem extends Component {
    _renderStatusOrActions(id) {
        if (this.props.status) {
            return <span>({this.props.status})</span>;
        }

        return (
            <span>
                <i onClick={preventDefault(() => taskClientActions.editMode(id))} className="fa fa-pencil" />
                &nbsp;
                <i onClick={preventDefault(() => taskClientActions.remove(id))} className="fa fa-trash-o" />
            </span>
        );
    }

    render() {
        const id = this.props.id;

        if (this.props.inEditMode) {
            return (
                <li>
                    <TaskInput
                        message={this.props.message}
                        submit={message => taskClientActions.update(id, message)} />
                    <i onClick={preventDefault(() => taskClientActions.viewMode(id))} className="fa fa-times" />
                </li>
            );
        }

        return <li>{this.props.message} {this._renderStatusOrActions(id)}</li>;
    }
}
