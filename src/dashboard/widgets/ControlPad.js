import React, {Component} from 'react';

import Glyphicon from '../../utils/Glyphicon.js';

class ControlPad extends Component{
    render(){
        let dpad = (dir, onClick)=>dpadButton(this.props.color, dir, onClick);
        return (
            <div className="widget-edit">
                <div>                
                    {glyphiconButton("primary", "cog", (e)=>{})}
                    {dpad("up", this.props.up)}
                    {glyphiconButton("danger", "trash", (e)=>{})}
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
};

const dpadColors = { // map bootstrap button types to colors
    "yellow": "warning",
    "green": "success",
    "red": "danger",
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

export default ControlPad;