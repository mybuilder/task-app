import React from 'react';

const isNotEnterKeyPressed = (e) => e.keyCode !== 13;

export default class TaskInput extends React.Component {
    state = {
        hasError: false,
        hasAttemptedSubmit: false,
        message: ''
    };

    componentDidMount() {
        this.setState({
            message: this.props.message
        });
    }

    _handleChange = (e) => {
        e.preventDefault();

        const message = e.target.value;

        this.setState({
            hasError: message.length < 4,
            message
        });
    };

    _handleEnter = (e) => {
        e.preventDefault();

        if (isNotEnterKeyPressed(e)) {
            return;
        }

        this.setState({ hasAttemptedSubmit: true });

        if (this.state.hasError) {
            return;
        }

        this.props.submit(this.state.message);

        this.setState({
            hasAttemptedSubmit: false,
            message: ''
        });
    };

    render() {
        return (
            <input
                className={this.state.hasAttemptedSubmit && this.state.hasError ? 'error' : ''}
                type="text"
                onChange={this._handleChange}
                onKeyUp={this._handleEnter}
                placeholder={this.props.placeholder}
                value={this.state.message} />
        );
    }
}
