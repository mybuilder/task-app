import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import expect from 'expect.js';
import TaskList from 'components/TaskList';
import TaskInput from 'components/TaskInput';

const hitEnterKey = (rendered) =>
    ReactTestUtils.Simulate.keyUp(ReactDOM.findDOMNode(rendered), { keyCode: 13 });

const renderListWithTasks = (tasks) =>
    ReactTestUtils.renderIntoDocument(<TaskList tasks={tasks} />);

const renderListWithTasksAndActions = (tasks, actions) => {
    const TaskList = require('inject!components/TaskList')({
        'actions/TaskClientActions': actions
    });

    return ReactTestUtils.renderIntoDocument(<TaskList tasks={tasks} />); 
};

describe('TaskList', () => {
    it('should display empty list', () => {
        const rendered = renderListWithTasks([]);

        expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(rendered, 'li').length).to.be.eql(0);
    });

    it('should display tasks in list', () => {
        const rendered = renderListWithTasks([
            { id: 123, message: 'Sample Message' },
            { id: 321, message: 'Another Sample Message' }]);

        expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(rendered, 'li').length).to.be.eql(2);
    });

    it('should display task in edit-mode', () => {
        const rendered = renderListWithTasks([
            { id: 123, message: 'Sample Message', inEditMode: true },
            { id: 321, message: 'Another Sample Message' }]);

        expect(ReactTestUtils.findRenderedComponentWithType(rendered, TaskInput)).to.be.ok();
    });

    it('should invoke edit-mode action', () => {
        let id;
        const rendered = renderListWithTasksAndActions(
            [ { id: 123, message: 'Sample Message' } ],
            { editMode: (i) => id = i }
        );

        ReactTestUtils.Simulate.click(
            ReactTestUtils.findRenderedDOMComponentWithClass(rendered, 'edit-mode'));

        expect(id).to.be.eql(123);
    });

    it('should invoke remove action', () => {
        let id;
        const rendered = renderListWithTasksAndActions(
            [ { id: 123, message: 'Sample Message' } ],
            { remove: (i) => id = i }
        );

        ReactTestUtils.Simulate.click(
            ReactTestUtils.findRenderedDOMComponentWithClass(rendered, 'remove'));

        expect(id).to.be.eql(123);
    });

    it('should invoke view-mode action', () => {
        let id;
        const rendered = renderListWithTasksAndActions(
            [ { id: 123, message: 'Sample Message', inEditMode: true } ],
            { viewMode: (i) => id = i }
        );

        ReactTestUtils.Simulate.click(
            ReactTestUtils.findRenderedDOMComponentWithClass(rendered, 'view-mode'));

        expect(id).to.be.eql(123);        
    });

    it('should invoke update action', () => {
        let id, message;
        const rendered = renderListWithTasksAndActions(
            [ { id: 123, message: 'Sample Message', inEditMode: true } ],
            { update: (i, m) => { id = i; message = m; } }
        );

        hitEnterKey(
            ReactTestUtils.findRenderedComponentWithType(rendered, TaskInput));

        expect(id).to.be.eql(123);
        expect(message).to.be.eql('Sample Message');
    });
});
