import React from 'react';
import expect from 'expect.js';
import TaskInput from 'components/TaskInput';
import * as h from 'helpers';

describe('TaskInput', () => {
    it('should include placeholder', () => {
        const rendered = h.render(<TaskInput placeholder="Sample Placeholder" />);

        expect(h.countOfComponentsWithAttribute(rendered, 'placeholder', 'Sample Placeholder')).to.be.eql(1);
    });

    it('should include message', () => {
        const rendered = h.render(<TaskInput message="Sample Value" />);

        expect(h.countOfComponentsWithAttribute(rendered, 'value', 'Sample Value')).to.be.eql(1);
    });

    it('should invoke submit action with valid input', () => {
        let message;
        const rendered = h.render(<TaskInput submit={(m) => message = m} message="Sample Value" />);

        h.hitEnterKey(rendered);

        expect(message).to.be.eql('Sample Value');
    });

    it('should not invoke submit action with invalid input', () => {
        let called = false;
        const rendered = h.render(<TaskInput submit={() => called = true} message="Foo" />);

        h.hitEnterKey(rendered);

        expect(called).to.be.eql(false);
    });

    it('should mark input as error with invalid input', () => {
        const rendered = h.render(<TaskInput message="Foo" />);

        h.hitEnterKey(rendered);

        expect(h.findComponentWithClass(rendered, 'error')).to.be.ok();
    });
});
