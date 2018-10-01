import React, {Component} from 'react';

import requestFullscreen from '../utils/Fullscreen.js';

const joystickContainerId = "joystick-container";

class Joystick extends Component {
    constructor(props){
        super(props);

        this.maxDisplacement = this.props.innerSize / 2;
        this.rSquared = this.maxDisplacement * this.maxDisplacement;

        this.state = {
            x: 0,
            y: 0,
            containerSize: this.props.outerSize * 2,
        }
        
        this.grabJoystick = this.grabJoystick.bind(this);
        this.moveJoystick = this.moveJoystick.bind(this);
        this.releaseJoystick = this.releaseJoystick.bind(this);
        this.getGrab = this.getGrab.bind(this);
        this.updateJoystick = this.updateJoystick.bind(this);
        this.fullscreenJoystick = this.fullscreenJoystick.bind(this);
    }
    grabJoystick(x, y){
        let grab = this.getGrab(x,y);

        if (grab.magnitude < this.maxDisplacement){
            this.updateJoystick(grab, true);
        }
    }
    getGrab(x, y){
        let rect = document.getElementById(joystickContainerId).getBoundingClientRect();
        let center = this.state.containerSize / 2;
        let offsetX = x - rect.x - center, offsetY = center - y + rect.y;
        let angle = Math.atan2(offsetY, offsetX);
        let mag = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        
        let clamped = Math.min(mag, this.maxDisplacement);
        let dotX = Math.cos(angle) * clamped;
        let dotY = Math.sin(angle) * clamped;
        
        return {
            x: dotX,
            y: dotY,
            magnitude: mag,
            angle: angle,
        }
    }
    moveJoystick(x, y){
        if (this.state.grabbed){
            let grab = this.getGrab(x, y);
            this.updateJoystick(grab, true);
        }
    }
    releaseJoystick(x, y){
        if (this.state.grabbed){
            this.updateJoystick({
                x: 0,
                y: 0,
                angle: 0,
                magnitude: 0,
            }, false);
        }
    }
    updateJoystick(info, grabbed){
        this.setState({
            x: info.x,
            y: info.y,
            grabbed: grabbed,
        });
        this.props.client.then( client => {
            client.apis.default.joystick_drive({
                joystick: {
                    angle: info.angle - Math.PI/2,
                    magnitude: Math.min(info.magnitude/this.maxDisplacement, 1.0),
                }
            });
        })
    }
    fullscreenJoystick(){
        console.log("got here");
        requestFullscreen(document.getElementById(joystickContainerId));
    }
    componentDidMount(){
        function handleTouch(handler){
            return (e=>{
                e.preventDefault();
                if (!e.touches[0]){
                    handler(0, 0);
                    return;
                }
                var touch = e.touches[0];
                handler(touch.clientX, touch.clientY);
            });
        };
        let elem = document.getElementById(joystickContainerId);
        elem.addEventListener("touchstart", handleTouch(this.grabJoystick), false);
        elem.addEventListener("touchmove", handleTouch(this.moveJoystick), false);
        elem.addEventListener("touchend", handleTouch(this.releaseJoystick), false);
        elem.addEventListener("touchcancel", handleTouch(this.releaseJoystick), false);
    }
    componentWillUnmount(){
        let elem = document.getElementById(joystickContainerId);
        elem.removeEventListener("touchstart");
        elem.removeEventListener("touchmove");
        elem.removeEventListener("touchend");
        elem.removeEventListener("touchcancel");
    }
    render(){
        let containerSize = this.state.containerSize;
        let containerStyle = {
            touchAction: "none",
            background: "black",
            height: containerSize,
            width: containerSize,
        }
        let outerSize = this.props.outerSize;
        let outerStyle = makeJoystickStyle(outerSize, containerSize, "red", 0, 0);
        let innerSize = this.props.innerSize;
        let innerStyle = makeJoystickStyle(innerSize, containerSize, "blue", this.state.x, this.state.y);

        if (!this.state.grabbed){
            innerStyle.transition = "250ms ease";
        }

        function handleMouse(handler){
            return (e=>handler(e.clientX, e.clientY));
        }

        let handlers = {
            onMouseDown: handleMouse(this.grabJoystick),
            onMouseMove: handleMouse(this.moveJoystick),
            onMouseUp: handleMouse(this.releaseJoystick),
            onMouseOut: handleMouse(this.releaseJoystick),
        };

        return (
            <div>
                <div id={joystickContainerId} style={containerStyle} {...handlers}>
                    <div style={outerStyle}></div>
                    <div style={innerStyle}></div>
                </div>
                <button className="btn btn-success" onClick={this.fullscreenJoystick}>Fullscreen</button>
            </div>
        );
    }
}

function makeJoystickStyle(size, containerSize, color, x, y){
    let margin = (containerSize - size) / 2;
    return {
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "block",
        position: "absolute",
        opacity: 0.5,
        marginTop: margin - y,
        marginLeft: margin + x,
        touchAction: "none",
    }
}

export default Joystick;
