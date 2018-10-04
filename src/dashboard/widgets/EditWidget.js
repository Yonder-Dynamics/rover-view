import React, {Component} from 'react';

import Widget from './Widget.js';

import Glyphicon from '../../utils/Glyphicon.js';

class ControlPad extends Component{
    render(){
        let dpad = (dir, onClick)=>dpadButton(this.props.color, dir, onClick);
        return (
            <div>
                <div>
                    {dpad("up", this.props.up)}
                </div>
                <div>
                    {dpad("left", this.props.left)}
                    {glyphiconButton(dpadColors[this.props.color], "record", this.props.center)}
                    {dpad("right", this.props.right)}
                </div>
                <div>
                    {dpad("down", this.props.down)}
                </div>
            </div>
        );
    }
}

class EditWidget extends Component{
    constructor(props){
        super(props);

        this.state = {
            alignment: "auto",
        };

        this.setAlignment = this.setAlignment.bind(this);
    }
    setAlignment(direction){
        return ()=>this.setState({alignment: direction});
    }
    render(){
        return (
            <Widget className={"highlight-widget " + "widget-align-" + this.state.alignment} idx={this.props.idx}>
                <ControlPad
                    color={this.props.color}
                    up={this.setAlignment("up")}
                    left={()=>this.props.moveBack(this.props.idx)}
                    center={this.setAlignment("auto")}
                    right={()=>this.props.moveForward(this.props.idx)}
                    down={this.setAlignment("down")}>
                </ControlPad>
            </Widget>
        );
    }
}

const dpadColors = { // map bootstrap button types to colors
    "yellow": "warning",
    "green": "success",
}

function dpadButton(color, direction, onClick){
    return glyphiconButton(dpadColors[color], "arrow-" + direction, onClick);
}

function glyphiconButton(btnType, glyphType, onClick){
    return  (
        <button className={"glyph-btn btn btn-" + btnType} onClick={onClick}>
            <Glyphicon type={glyphType}/>
        </button>
    );
}

export default EditWidget;