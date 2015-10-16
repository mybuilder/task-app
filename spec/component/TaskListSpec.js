import React from 'react';
import expect from 'expect.js';
import TaskList from 'components/TaskList';
import TaskInput from 'components/TaskInput';
import * as h from 'helpers';

const renderWithTasks = (tasks) => h.render(<TaskList tasks={tasks} />);

const renderWithTasksAndActions = (tasks, actions) => {
    const TaskList = require('inject!components/TaskList')({
        'actions/TaskClientActions': actions
    });

    return h.render(<TaskList tasks={tasks} />);
};

describe('TaskList', () => {
    it('should display empty list', () => {
        const rendered = renderWithTasks([]);

        expect(h.countOfComponentsWithTag(rendered, 'li')).to.be.eql(0);
    });

    it('should display tasks in list', () => {
        const rendered = renderWithTasks([
            { id: 123, message: 'Sample Message' },
            { id: 321, message: 'Another Sample Message' }]);

        expect(h.countOfComponentsWithTag(rendered, 'li')).to.be.eql(2);
    });

    it('should display task in edit-mode', () => {
        const rendered = renderWithTasks([
            { id: 123, message: 'Sample Message', inEditMode: true },
            { id: 321, message: 'Another Sample Message' }]);

        expect(h.findComponentWithType(rendered, TaskInput)).to.be.ok();
    });

    it('should invoke edit-mode action', () => {
        let id;
        const rendered = renderWithTasksAndActions(
            [ { id: 123, message: 'Sample Message' } ],
            { editMode: (i) => id = i }
        );

        h.click(h.findComponentWithClass(rendered, 'edit-mode'));

        expect(id).to.be.eql(123);
    });

    it('should invoke remove action', () => {
        let id;
        const rendered = renderWithTasksAndActions(
            [ { id: 123, message: 'Sample Message' } ],
            { remove: (i) => id = i }
        );

        h.click(h.findComponentWithClass(rendered, 'remove'));

        expect(id).to.be.eql(123);
    });

    it('should invoke view-mode action', () => {
        let id;
        const rendered = renderWithTasksAndActions(
            [ { id: 123, message: 'Sample Message', inEditMode: true } ],
            { viewMode: (i) => id = i }
        );

        h.click(h.findComponentWithClass(rendered, 'view-mode'));

        expect(id).to.be.eql(123);        
    });

    it('should invoke update action', () => {
        let id, message;
        const rendered = renderWithTasksAndActions(
            [ { id: 123, message: 'Sample Message', inEditMode: true } ],
            { update: (i, m) => { id = i; message = m; } }
        );

        h.hitEnterKey(h.findComponentWithType(rendered, TaskInput));

        expect(id).to.be.eql(123);
        expect(message).to.be.eql('Sample Message');
    });
});
