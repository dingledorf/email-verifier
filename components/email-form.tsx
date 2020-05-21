import React, { Component } from 'react'
import { TIMEOUT_INTERVAL } from '../constants'
import { clearTimeout, setTimeout } from 'timers'
import EmailAutocomplete from './email-autocomplete'
import { upperFirst } from 'lodash'
const axios = require('axios').default;

type EmailFormState = {
    email: string,
    timer?: NodeJS.Timeout,
    querying: boolean,
    error: boolean,
    errorMessage?: string,
    success: boolean
}

export default class EmailForm extends Component<{}, EmailFormState> {
    constructor(props) {
        super(props);
        this.state = {email: '', timer: null, querying: false, error: false, errorMessage: null, success: false};
        this.handleChange = this.handleChange.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.verifyEmailDeliverability = this.verifyEmailDeliverability.bind(this);
    }

    handleChange(event) {
        clearTimeout(this.state.timer);
        this.setState({timer: setTimeout(this.validateEmail, TIMEOUT_INTERVAL), email: event.target.value, error: false, errorMessage: '', success: false });
    }

    validateEmail() {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const valid = regex.test(this.state.email.toLowerCase());
        if(!valid) {
            this.setState({error: true, errorMessage: 'Please type in a valid e-mail address!'});
        } else {
            this.setState({querying: true});
            this.verifyEmailDeliverability(this.state.email);
        }
    }

    verifyEmailDeliverability(email: string) {
        axios.get('/api/verify-email', {
            params: {email}
        }).then((res) => {
            if(res.data.result == 'deliverable') {
                this.setState({success: true});
            } else {
                this.setState({error: true, errorMessage: `${upperFirst(res.data.result)} - ${res.data.reason.split('_').map((word) => upperFirst(word)).join(' ')}`});
            }
        }).catch((error) => {
            this.setState({error: true, errorMessage: 'Something went wrong, try again!'});
        }).then(() => {
            this.setState({querying: false});
        });
    }

    render() {
        return (
            <form>
                <h4>Validate Your Email!</h4>
                <input list="email" type="email" value={this.state.email} placeholder={"Enter an email"} onChange={this.handleChange} />
                {this.state.email.includes('@') &&
                    <EmailAutocomplete email={this.state.email.replace(/@.*$/, '')}/>
                }
                {this.state.querying &&
                    <div>Verifying deliverability . . . .</div>
                }
                {this.state.error &&
                    <div className={"error"}>{this.state.errorMessage}</div>
                }
                {this.state.success &&
                    <div className={"success"}>Email passed validation!</div>
                }
                <style jsx>{`
                    .error { color: red }
                    .success { color: green }
                `}</style>
            </form>
        );
    }
}