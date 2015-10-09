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
    render() {
        const id = this.props.id;

        if (this.props.inEditMode) {
            return (
                <li>
                    <TaskInput
                        message={this.props.message}
                        submit={message => taskClientActions.update(id, message)} />
                    <button onClick={preventDefault(() => taskClientActions.viewMode(id))}>&times;</button>
                </li>
            );
        }

        return (
            <li>
                {this.props.message}
                <button onClick={preventDefault(() => taskClientActions.editMode(id))}>Edit</button>
                <button onClick={preventDefault(() => taskClientActions.remove(id))}>Remove</button>
            </li>
        );
    }
}
