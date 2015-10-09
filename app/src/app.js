import React from 'react';
import ReactDOM from 'react-dom';
import TaskApp from 'components/TaskApp';
import {setEndpoint as setApiEndpoint} from 'api/TaskApi';

setApiEndpoint(window.TASK_ENDPOINT);

ReactDOM.render(
    <TaskApp />,
    document.getElementById('task-app')
);
