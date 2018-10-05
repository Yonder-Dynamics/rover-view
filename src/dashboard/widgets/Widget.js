import React, {Component} from 'react';

import ControlPad from './ControlPad.js';

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
            [makeVerticalAlignmentClass(this.props.alignment.vertical)],
        ).join(' ');
        let style = {
            width: this.props.width,
            height: this.props.height,
        };
        return (
            <div className={classes} style={style}>
                <ControlPad
                    color={this.props.color}
                    up={()=>this.props.hooks.moveUp(this.props.idx)}
                    left={()=>this.props.hooks.moveLeft(this.props.idx)}
                    center={()=>this.hooks.props.clearAlignment(this.props.idx)}
                    right={()=>this.props.hooks.moveRight(this.props.idx)}
                    down={()=>this.props.hooks.moveDown(this.props.idx)}>
                </ControlPad>
                {this.props.children}
            </div>
        );
    }
};

function makeVerticalAlignmentClass(alignment){
    return "widget-align-" + alignment;
}

export default Widget;