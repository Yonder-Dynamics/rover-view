import React, {Component} from 'react';

class Joystick extends Component {
    componentDidMount(){
        let canvas = document.getElementById('joystick-1');
        let ctx = canvas.getContext('2d');
        let width = canvas.clientWidth, height = canvas.clientHeight;
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,width,height);

        let joystickRadius = 40;

        canvas.addEventListener('mousemove', e=>{
            console.log("click " + e.offsetX + " " + e.offsetY);
            ctx.fillStyle = 'black';
            ctx.fillRect(0,0,width,height);

            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'white';
            ctx.arc(width/2, height/2, joystickRadius, 0, Math.PI*2, true);
            ctx.stroke();

            let offsetX = e.offsetX - width/2, offsetY = e.offsetY - height/2;
            let angle = Math.atan2(offsetY, offsetX);
            console.log(angle)
            let mag = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

            let dotX = Math.cos(angle) * Math.min(mag, joystickRadius);
            let dotY = Math.sin(angle) * Math.min(mag, joystickRadius);
    
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.arc(width/2 + dotX, height/2 + dotY, 15, 0, Math.PI*2, false);
            ctx.fill();
        });
    }
    render(){
        return (
            <canvas id="joystick-1">Canvas Not Supported by this browser</canvas>
        );
    }
}

export default Joystick;