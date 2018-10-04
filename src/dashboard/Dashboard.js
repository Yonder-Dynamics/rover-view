import React, {Component} from 'react';

import Joystick from '../drive/Joystick.js';
import Widget from './widgets/Widget.js';

import './Dashboard.css';

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

class Dashboard extends Component{
    constructor(props){
        super(props);

        this.state = {layout: {}};

        this.client = new JoystickClient(this.props.client);
    }
    render(){
        return buildDashboard(this.client, this.state.layout);
    }
};

function buildDashboard(client, layout){
    // dashboard management row
    return (
        <div className="container-fluid">
            <div className="dash-container dash-grid-show dash-edit">
                <Widget>
                    <button className="btn btn-success">Configure</button>
                    <button className="btn btn-success">Configure</button>
                    <button className="btn btn-success">Configure</button>
                </Widget>
                <div className="dash-widget">
                    <video width={400} height={300} controls>
                        <source src={""} type="video/mp4"/>
                    </video>
                </div>
                <div className="dash-widget">
                    <button className="btn btn-success">Configure</button>
                </div>
                <div className="dash-widget">
                    <Joystick
                        client={client}
                        width={150}
                        height={150}
                        outerSize={100}
                        innerSize={85}>
                    </Joystick>
                </div>
            </div>
        </div>
    )

}

export default Dashboard;