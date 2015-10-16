import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';

export const hitEnterKey = (component) =>
    ReactTestUtils.Simulate.keyUp(ReactDOM.findDOMNode(component), { keyCode: 13 });

export const countOfComponentsWithAttribute = (components, attribute, value) =>
    ReactTestUtils.findAllInRenderedTree(components, (e) => e[attribute] === value).length;

export const countOfComponentsWithTag = (components, tag) =>
    ReactTestUtils.scryRenderedDOMComponentsWithTag(components, tag).length;

export const findComponentWithType = (components, type) =>
    ReactTestUtils.findRenderedComponentWithType(components, type);

export const findComponentWithClass = (components, className) =>
    ReactTestUtils.findRenderedDOMComponentWithClass(components, className);

export const render = ReactTestUtils.renderIntoDocument;

export const click = ReactTestUtils.Simulate.click;

export const changeInputValue = (component, value) => {
    const input = ReactDOM.findDOMNode(component);

    input.value = value;
    ReactTestUtils.Simulate.change(input);
};
