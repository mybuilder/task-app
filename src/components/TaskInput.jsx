import React from 'react';

const isNotEnterKeyPressed = (e) => e.keyCode !== 13;
const isInvalidMessage = (message) => !message || message.length < 4;

export default class TaskInput extends React.Component {
    state = {
        hasError: false,
        message: ''
    };

    componentDidMount() {
        this.setState({
            message: this.props.message || ''
        });
    }

    _handleChange = (e) => {
        e.preventDefault();

        const message = e.target.value;

        this.setState({
            message,
            hasError: this.state.hasError && isInvalidMessage(message)
        });
    };

    _handleSubmit = (e) => {
        e.preventDefault();

        if (isNotEnterKeyPressed(e)) {
            return;
        }

        const message = this.state.message;

        if (isInvalidMessage(message)) {
            this.setState({ hasError: true });
            return;
        }

        this.props.submit(message);

        this.setState({
            message: '',
            hasError: false
        });
    };

    render() {
        return (
            <input
                className={this.state.hasError ? 'error' : ''}
                type="text"
                onChange={this._handleChange}
                onKeyUp={this._handleSubmit}
                placeholder={this.props.placeholder}
                value={this.state.message} />
        );
    }
}
