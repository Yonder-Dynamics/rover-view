import React, {Component} from 'react';

import Joystick from './Joystick.js'

const video = '/big_buck_bunny.mp4';

class DrivePage extends Component {
    render(){
        return (
            <div className="container-fluid">
                {/* <video width="320" height="240" controls>
                    <source src={video} type="video/mp4"/>
                </video> */}
                <div className="container-fluid">
                    <Joystick
                        client={this.props.client}
                        outerSize={100}
                        innerSize={85}>
                    </Joystick>
                </div>
            </div>
        );
    }
}

export default DrivePage;