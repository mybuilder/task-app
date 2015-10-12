import React from 'react';
import ReactDOM from 'react-dom';
import TaskApp from 'components/TaskApp';
import {setEndpoint as setApiEndpoint} from 'api/TaskApi';

window.initTaskApp = function(output, endpoint) {
    setApiEndpoint(endpoint);
    ReactDOM.render(<TaskApp />, output);
};
