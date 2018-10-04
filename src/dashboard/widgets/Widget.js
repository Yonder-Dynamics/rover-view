import React, {Component} from 'react';

const widgetClasses = ["dash-widget"];

/*
 * Widget properties
 *  - width: static widget width
 *  - height: static widget height
 *  - alignment
 *    - control with directional arrow buttons (up/down/right/left)
 *  - type: string specifying widget contents
 * 
 * Widgets containing elements with static sizes (video players, etc) must
 * have this set as a widget property to allow proper previewing, etc.
 */
class Widget extends Component{
    render(){
        let classes = widgetClasses.concat(
            this.props.className || [],
        ).join(' ');
        return (
            <div className={classes}>
                <button className="btn btn-primary widget-edit">
                    <span className="glyphicon glyphicon-cog"></span>
                </button>
                {this.props.children}
            </div>
        );
    }
};

export default Widget;