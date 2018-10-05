import React, {Component} from 'react';

import Joystick from '../../drive/Joystick.js';

class JoystickClient {
    constructor(client){
        this.client = client;

        this.send = this.send.bind(this);
    }
    send(data){
        this.client.then( client => {
            client.apis.default.joystick_drive({
                joystick: data,
            });
        });
    }
};

class JoystickWidget extends Component{
    constructor(props){
        super(props);

        this.state = {
            alignment: "auto",
        };

    }
    render(){
        return (
            <Joystick
            client={new JoystickClient(this.props.client)}
            width={this.props.width}
            height={this.props.height}
            outerSize={100}
            innerSize={85}/>
        );
    }
}

export default JoystickWidget;