import React from 'react';
import taskStore from 'stores/TaskStore';
import taskClientActions from 'actions/TaskClientActions';
import TaskInput from 'components/TaskInput';
import TaskList from 'components/TaskList';

export default class TaskApp extends React.Component {
    state = {
        tasks: taskStore.all()
    };

    componentDidMount() {
        taskStore.addChangeListener(this._onChange);

        taskClientActions.fetchAll();
    }

    componentWillUnmount() {
        taskStore.removeChangeListener(this._onChange);
    }

    _onChange = () => {
        this.setState({
            tasks: taskStore.all()
        })
    };

    render() {
        return (
            <div>
                <TaskInput
                    placeholder="Add a task..."
                    submit={message => taskClientActions.add(message)} />
                <TaskList tasks={this.state.tasks} />
            </div>
        );
    }
}
