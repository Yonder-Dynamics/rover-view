import React, {Component} from 'react';
import Swagger from 'swagger-client';

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

    canvas.addEventListener("touchstart", function (e) {
      e.preventDefault();
      var mousePos = getTouchPos(canvas, e);
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY,
        offsetX: mousePos.x,
        offsetY: mousePos.y
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchend", function (e) {
      e.preventDefault();
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
      e.preventDefault();
      var mousePos = getTouchPos(canvas, e);
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
        offsetX: mousePos.x,
        offsetY: mousePos.y
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, touchEvent) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
      };
    }
    function tryGrab(e){ 
      e.preventDefault();
      let offsetX = e.offsetX - width/2, offsetY = e.offsetY - height/2;
      if ((offsetX * offsetX + offsetY * offsetY) < joystickSquared) {
        grabbed = true;
      }
    }

    canvas.addEventListener('mousedown', tryGrab);

    //var client = Swagger('https://10.42.0.222:3000/ctrl/swagger.json');
    var client = Swagger('/ctrl/swagger.json');
    console.log(client);

    client.catch(err=>{console.log(err)});

    function updateJoystick(x, y){
      clearCanvas(ctx, width, height);
      drawBoundary(ctx, width, height, joystickRadius);
      let vals = drawJoystick(ctx, width, height, joystickRadius, joystickSize, x, y);
      let angle = vals[0] + Math.PI;
      let mag = vals[1]/joystickRadius;
      client.then( client => {
        client.apis.default.joystick_drive({joystick: {angle:angle,magnitude:mag}});
      })
    }

    function tryMove(e){
      e.preventDefault();
      if (!grabbed){
        return;
      }
      // angle and magnitude of joystick movement
      let offsetX = e.offsetX - width/2, offsetY = e.offsetY - height/2;
      updateJoystick(offsetX, offsetY);
    }
    canvas.addEventListener('mousemove', tryMove);

    function releaseJoystick(e){
      e.preventDefault();
      grabbed = false;
      updateJoystick(0, 0);
    }

    canvas.addEventListener('mouseup', releaseJoystick);
    canvas.addEventListener('mouseout', releaseJoystick);

    releaseJoystick({preventDefault:()=>{}}); // set up the canvas initially
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

  let clamped = Math.min(mag, radius);
  let dotX = Math.cos(angle) * clamped;
  let dotY = Math.sin(angle) * clamped;
  context.beginPath();
  context.fillStyle = 'white';
  context.arc(width/2 + dotX, height/2 + dotY, size, 0, Math.PI*2, false);
  context.fill();

  return [angle, clamped];
}

export default Joystick;
