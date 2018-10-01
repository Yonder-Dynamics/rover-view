import React, {Component} from 'react';

import Joystick from './Joystick.js'

const video = '/big_buck_bunny.mp4';

const joystickContainerId = "joystick-container";
const joystickCanvasId = "joystick-canvas"

class DrivePage extends Component {
    render(){
        return (
            <div className="container-fluid">
                {/* <video width="320" height="240" controls>
                    <source src={video} type="video/mp4"/>
                </video> */}
                <div className="container-fluid" id={joystickContainerId}>
                    <Joystick
                        canvasId={joystickCanvasId}
                        client={this.props.client}
                        outerSize={100}
                        innerSize={85}>
                    </Joystick>
                    {/* <button className="btn btn-success" onClick={joystickFullscreen}>Fullscreen</button> */}
                </div>
            </div>
        );
    }
}

function joystickFullscreen(e){
    let joystickCanvas = document.getElementById(joystickCanvasId);
    if (joystickCanvas.requestFullscreen) {
        joystickCanvas.requestFullscreen();
    } else if (joystickCanvas.webkitRequestFullscreen) {
        joystickCanvas.webkitRequestFullscreen();
    }
    joystickCanvas.width = joystickCanvas.clientWidth;
    joystickCanvas.height = joystickCanvas.clientHeight;
    joystickCanvas.style.width = joystickCanvas.clientWidth;
    joystickCanvas.style.height = joystickCanvas.clientHeight;
}

export default DrivePage;