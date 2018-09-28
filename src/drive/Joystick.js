import React, {Component} from 'react';

class Joystick extends Component {
    componentDidMount(){
        let canvas = document.getElementById('joystick-1');
        let ctx = canvas.getContext('2d');
        let width = canvas.clientWidth, height = canvas.clientHeight;
        clearCanvas(ctx, width, height);

        let joystickRadius = 40;

        let joystickSize = 15;
        let joystickSquared = joystickSize * joystickSize;

        let grabbed = false;

        canvas.addEventListener('mousedown', e=>{ 
            let offsetX = e.offsetX - width/2, offsetY = e.offsetY - height/2;
            if ((offsetX * offsetX + offsetY * offsetY) < joystickSquared) {
                grabbed = true;
            }
        });

        function updateJoystick(x, y){
            clearCanvas(ctx, width, height);
            drawBoundary(ctx, width, height, joystickRadius);
            drawJoystick(ctx, width, height, joystickRadius, joystickSize, x, y);
            // post the position
        }

        canvas.addEventListener('mousemove', e=>{
            if (!grabbed){
                return;
            }
            // angle and magnitude of joystick movement
            let offsetX = e.offsetX - width/2, offsetY = e.offsetY - height/2;
            updateJoystick(offsetX, offsetY);
        });

        function releaseJoystick(e){
            grabbed = false;
            updateJoystick(0, 0);
        }

        canvas.addEventListener('mouseup', releaseJoystick);
        canvas.addEventListener('mouseout', releaseJoystick);

        releaseJoystick(); // set up the canvas initially
    }
    render(){
        return (
            <canvas id="joystick-1">Canvas Not Supported by this browser</canvas>
        );
    }
}

function clearCanvas(context, width, height){
    context.fillStyle = 'black';
    context.fillRect(0,0,width,height);
}

function drawBoundary(context, width, height, radius){
    context.strokeStyle = 'white';
    context.beginPath();
    context.arc(width/2, height/2, radius, 0, Math.PI*2, true);
    context.stroke();
}

function drawJoystick(context, width, height, radius, size, offsetX, offsetY){
    let angle = Math.atan2(offsetY, offsetX);
    let mag = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

    
    let dotX = Math.cos(angle) * Math.min(mag, radius);
    let dotY = Math.sin(angle) * Math.min(mag, radius);
    context.beginPath();
    context.fillStyle = 'white';
    context.arc(width/2 + dotX, height/2 + dotY, size, 0, Math.PI*2, false);
    context.fill();
}

export default Joystick;