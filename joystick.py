from serial import Serial
import time, math

MSG_RATE  = 20 #in Hz
MSG_PER = 1./MSG_RATE
MAX_TURNING_RADIUS = 10
TIMEOUT = 2
CLEAR_BUFFER = 20
BAUDRATE = [9600,57600,115200][2]
buffer_count = 0
# Always use serial ports like this because they don't change
serial_port = "/dev/serial/by-id/usb-Arduino_Srl_Arduino_Mega_55635303838351816162-if00"
prev_msg_type = 1
ignored = 0
last_message_send = time.time()

def openSerial():
    global s
    s = Serial(serial_port, BAUDRATE)
    time.sleep(1)

# Open serial. DO NOT REMOVE DELAY
print("Opening serial")
openSerial()
print("Started listening")

from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

bp = Blueprint('blog', __name__)

@bp.route('/')
def index():
    """Show all the posts, most recent first."""
    return render_template('index.html')

@bp.route('/joy', methods=('POST','GET'))
def joy():
    global last_message_send
    """Delete a post.

    Ensures that the post exists and that the logged in user is the
    author of the post.
    """
    angle = request.form['angle']
    mag = request.form['mag']

    if time.time() - last_message_send < MSG_PER:
        return
    last_message_send = time.time()

    serialMsg = "#0#%i,%i,%i,%i,%i,%i\n"

    # Reopen serial
    try:
        s.write(serialMsg)
    except:
        openSerial()
        print("Looking for serial port: %s ..." % serial_port)
    out = s.read(s.inWaiting()).decode('ascii')

    return True
