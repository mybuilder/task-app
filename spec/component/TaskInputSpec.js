import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import expect from 'expect.js';
import TaskInput from 'components/TaskInput';

const countOfElementsWithAttribute = (rendered, attribute, value) =>
    ReactTestUtils.findAllInRenderedTree(rendered, (e) => e[attribute] === value).length;

const hitEnterKey = (rendered) =>
    ReactTestUtils.Simulate.keyUp(ReactDOM.findDOMNode(rendered), { keyCode: 13 });

describe('TaskInput', () => {
    it('should include placeholder', () => {
        const rendered = ReactTestUtils.renderIntoDocument(
            <TaskInput placeholder="Sample Placeholder" />
        );

        expect(countOfElementsWithAttribute(rendered, 'placeholder', 'Sample Placeholder')).to.be.eql(1);
    });

    it('should include message', () => {
        const rendered = ReactTestUtils.renderIntoDocument(
            <TaskInput message="Sample Value" />
        );

        expect(countOfElementsWithAttribute(rendered, 'value', 'Sample Value')).to.be.eql(1);
    });

    it('should invoke submit action with valid input', () => {
        let message;

        const rendered = ReactTestUtils.renderIntoDocument(
            <TaskInput submit={(m) => message = m} message="Sample Value" />
        );

        hitEnterKey(rendered);

        expect(message).to.be.eql('Sample Value');
    });

    it('should not invoke submit action with invalid input', () => {
        let called = false;

        const rendered = ReactTestUtils.renderIntoDocument(
            <TaskInput submit={() => called = true} message="Foo" />
        );

        hitEnterKey(rendered);

        expect(called).to.be.eql(false);
    });

    it('should mark input as error with invalid input', () => {
        const rendered = ReactTestUtils.renderIntoDocument(
            <TaskInput message="Foo" />
        );

        hitEnterKey(rendered);

        expect(ReactTestUtils.findRenderedDOMComponentWithClass(rendered, 'error')).to.be.ok();
    });
});
