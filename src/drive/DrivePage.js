import React, {Component} from 'react';

import Joystick from './Joystick.js'

const video = '/big_buck_bunny.mp4';

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

function killswitch(client){
    return function(e){
        client.then(client => {
            client.apis.default.kill_rover();
        })
    };
}

class DrivePage extends Component {
    render(){
        let height = 300;
        let playerWidth = height * 4 / 3;
        let joystickWidth = 120;

        let divStyle = {
            background: "black",
            padding: 10,
            flexGrow: 1,
        }
        return (
            <div className="container-fluid" style={{display: "flex"}}>
                <div style={divStyle}>
                    <button className="btn btn-danger" onClick={killswitch(this.props.client)}>KILL</button>
                </div>
                <video width={playerWidth} height={height} controls>
                    <source src={video} type="video/mp4"/>
                </video>
                <Joystick
                    client={new JoystickClient(this.props.client)}
                    width={joystickWidth}
                    height={height}
                    outerSize={100}
                    innerSize={85}>
                </Joystick>
            </div>
        );
    }
}

export default DrivePage;