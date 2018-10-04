import React, {Component} from 'react';

import requestFullscreen from '../utils/Fullscreen.js';

const joystickContainerId = "joystick-container";

var containerIds = 0;

class Joystick extends Component {
    constructor(props){
        super(props);

        this.containerId = joystickContainerId + "-" + (++containerIds);
        this.maxDisplacement = this.props.innerSize / 2;
        this.rSquared = this.maxDisplacement * this.maxDisplacement;

        this.state = {
            x: 0,
            y: 0,
            containerWidth: this.props.width,
            containerHeight: this.props.height,
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
        let rect = document.getElementById(this.containerId).getBoundingClientRect();
        let centerX = this.state.containerWidth / 2;
        let centerY = this.state.containerHeight / 2;
        let offsetX = x - rect.x - centerX, offsetY = centerY - y + rect.y;
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
        this.props.client.send({
            angle: Math.PI - info.angle,
            magnitude: Math.min(info.magnitude/this.maxDisplacement, 1.0),
        });
    }
    fullscreenJoystick(){
        let container = document.getElementById(this.containerId);
        requestFullscreen(container);
        this.setState({
            containerHeight:window.innerHeight,
            containerWidth:window.innerWidth,
        });
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
        let elem = document.getElementById(this.containerId);
        elem.addEventListener("touchstart", handleTouch(this.grabJoystick), false);
        elem.addEventListener("touchmove", handleTouch(this.moveJoystick), false);
        elem.addEventListener("touchend", handleTouch(this.releaseJoystick), false);
        elem.addEventListener("touchcancel", handleTouch(this.releaseJoystick), false);
    }
    componentWillUnmount(){
        let elem = document.getElementById(this.containerId);
        elem.removeEventListener("touchstart", null);
        elem.removeEventListener("touchmove", null);
        elem.removeEventListener("touchend", null);
        elem.removeEventListener("touchcancel", null);
    }
    render(){
        let containerHeight = this.state.containerHeight;
        let wrapperStyle = {
            height: containerHeight,
            width: "auto",
            background: "black",
            textAlign: "center",
            display: "inline-block",
            flexGrow: 1,
        };
        let containerWidth = this.state.containerWidth;
        let containerStyle = {
            display: "inline-block",
            touchAction: "none",
            height: containerHeight,
            width: containerWidth,
            borderRadius: "10px",
            borderStyle: "solid",
            borderColor: "red",
        }
        let outerSize = this.props.outerSize;
        let outerStyle = makeJoystickStyle(outerSize, containerWidth, containerHeight, "white", 0, 0);
        let innerSize = this.props.innerSize;
        let innerStyle = makeJoystickStyle(innerSize, containerWidth, containerHeight, "red", this.state.x, this.state.y);

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
            // onMouseOut: handleMouse(this.releaseJoystick),
        };

        return (
            <div style={wrapperStyle}>
                <div id={this.containerId} style={containerStyle} {...handlers}>
                    <div style={outerStyle}></div>
                    <div style={innerStyle}></div>
                </div>
                {/* <button className="btn btn-success" onClick={this.fullscreenJoystick}>Fullscreen</button> */}
            </div>
        );
    }
}

function makeJoystickStyle(size, containerWidth, containerHeight, color, x, y){
    let marginLeft = (containerWidth - size) / 2;
    let marginTop = (containerHeight - size) / 2;
    return {
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "block",
        position: "absolute",
        opacity: 0.5,
        marginTop: marginTop - y,
        marginLeft: marginLeft + x,
        touchAction: "none",
    }
}

export default Joystick;
