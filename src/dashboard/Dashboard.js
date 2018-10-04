import React, {Component} from 'react';

import Joystick from '../drive/Joystick.js';
import Widget from './widgets/Widget.js';
import EditWidget from './widgets/EditWidget.js';

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

/*
 * Use dashboards for everything
 * - Builtin dashboards have permanent links in navbar
 * 
 * - Home dashboard
 *    - Populated with cookies
 *    - If no cookies found, populate with login/welcome widget
 * 
 * - Dashboard creation dashboard
 *    - Built in to page
 *    - Widgets for finding saved layouts
 *    - Widget for adding a new dashboard
 *    - Use layer system for previewing
 */
class Dashboard extends Component{
    constructor(props){
        super(props);

        this.state = {layout: {
            widgets: [
                { wtype: "edit", wprops: {color: "yellow"}},
                { wtype: "edit", wprops: {color: "green"}},
            ],
        }};

        this.client = new JoystickClient(this.props.client);

        this.swap = this.swap.bind(this);
    }
    moveBack(idx){
        if (idx > 0){
            this.swap(idx, idx - 1);
        }
    }
    moveForward(idx){
        if (idx < (this.state.layout.widgets.length - 1)){
            this.swap(idx, idx + 1);
        }
    }
    swap(a, b){
        let temp = this.state.layout.widgets[a];
        this.state.layout.widgets[a] = this.state.layout.widgets[b];
        this.state.layout.widgets[b] = temp;

        this.setState(this.state); //redraw
    }
    render(){
        return buildDashboard(this.client, this.state.layout, {
            moveBack: this.moveBack.bind(this),
            moveForward: this.moveForward.bind(this),
        });
    }
};

function buildDashboard(client, layout, hooks){
    let widgetTypes = {
        edit: EditWidget,
    };
    let widgets = layout.widgets.map(
        (widget, idx)=>React.createElement(widgetTypes[widget.wtype], {
            key: idx,
            idx: idx,
            moveBack: hooks.moveBack,
            moveForward: hooks.moveForward,
            ...widget.wprops,
        })
    );
    return (
        <div id="dashboard-root" className="container-fluid">
            <div className="dash-container dash-grid-show">
                {widgets}
            </div>
        </div>
    )

}

export default Dashboard;