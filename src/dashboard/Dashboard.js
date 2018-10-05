import React, {Component} from 'react';

import JoystickWidget from './widgets/JoystickWidget.js';
import Widget from './widgets/Widget.js';
import EditWidget from './widgets/EditWidget.js';

import './Dashboard.css';

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
                { wtype: "edit", wprops: {
                    name: "yellow",
                    color: "yellow",
                    height: 100,
                    width: 100,
                    alignment: {
                        vertical: "auto",
                    },
                }},
                { wtype: "joystick", wprops: {
                    name: "green",
                    color: "green",
                    height: 200,
                    width: 300,
                    alignment: {
                        vertical: "auto",
                    },
                }},
                { wtype: "edit", wprops: {
                    name: "red",
                    color: "red",
                    height: 100,
                    width: 100,
                    alignment: {
                        vertical: "auto",
                    },
                }},
            ],
        }};

        this.swap = this.swap.bind(this);
        this.changeAlignment = this.changeAlignment.bind(this);
    }
    moveLeft(idx){
        if (idx > 0){
            this.swap(idx, idx - 1);
        }
    }
    moveRight(idx){
        if (idx < (this.state.layout.widgets.length - 1)){
            this.swap(idx, idx + 1);
        }
    }
    moveUp(idx){
        this.changeAlignment(idx, "up");
    }
    moveDown(idx){
        this.changeAlignment(idx, "down");
    }
    clearAlignment(idx){
        this.changeAlignment(idx, "auto");
    }
    changeAlignment(idx, alignment){
        this.state.layout.widgets[idx].wprops.alignment.vertical = alignment;
        this.setState(this.state);
    }
    swap(a, b){
        let temp = this.state.layout.widgets[a];
        this.state.layout.widgets[a] = this.state.layout.widgets[b];
        this.state.layout.widgets[b] = temp;

        this.setState(this.state); //redraw
    }
    render(){
        let classes = [
            "dash-container", "dash-grid-show", "dash-edit",
        ].join(" ");
        return (
            <div id="dashboard-root" className="container-fluid">
                <div className={classes}>
                {
                    buildWidgets(this.props.client, this.state.layout, {
                        moveUp:this.moveUp.bind(this),
                        moveLeft: this.moveLeft.bind(this),
                        moveRight: this.moveRight.bind(this),
                        moveDown: this.moveDown.bind(this),
                        clearAlignment: this.clearAlignment.bind(this),
                    })
                }
                </div>
            </div>
        );
    }
};

function buildWidgets(client, layout, hooks){
    let widgetTypes = {
        edit: EditWidget,
        joystick: JoystickWidget,
    };
    let widgets = layout.widgets.map((widget, idx)=>(
        <Widget client={client} key={idx} idx={idx} hooks={hooks} {...widget.wprops}>
            {
                React.createElement(widgetTypes[widget.wtype], {
                    client: client,
                    ...widget.wprops,
                })
            }
        </Widget>
    ));
    return widgets;

}

export default Dashboard;