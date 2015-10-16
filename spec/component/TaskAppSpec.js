import React from 'react';
import expect from 'expect.js';
import TaskApp from 'components/TaskApp';
import TaskInput from 'components/TaskInput';
import * as h from 'helpers';

const renderWithTasksAndActions = (tasks, actions) => {
    actions.fetchAll = actions.fetchAll || () => {};

    const TaskApp = require('inject!components/TaskApp')({
        'actions/TaskClientActions': actions,
        'stores/TaskStore': {
            all: () => tasks,
            addChangeListener: () => {}
        }
    });

    return h.render(<TaskApp />);
};

describe('TaskApp', () => {
    it('should invoke fetch all action', () => {
        let called = false;
        renderWithTasksAndActions([], {
            fetchAll: () => called = true
        });

        expect(called).to.be.eql(true);
    });

    it('should display store leads', () => {
        const rendered = renderWithTasksAndActions([
            { id: 123, message: 'Sample Message' },
            { id: 321, message: 'Another Sample Message' }
        ], {});

        expect(h.countOfComponentsWithTag(rendered, 'li')).to.be.eql(2);
    });

    it('should invoke add action when new task entered', () => {
        let message;
        const rendered = renderWithTasksAndActions([], {
            add: (m) => message = m
        });

        const input = h.findComponentWithType(rendered, TaskInput);
        h.changeInputValue(input, 'Sample Message');
        h.hitEnterKey(input);

        expect(message).to.be.eql('Sample Message');
    });
});
