import React, {Component} from 'react';

const video = '/big_buck_bunny.mp4';

class DrivePage extends Component {
    render(){
        return (
            <video width="320" height="240" controls>
                <source src={video} type="video/mp4"/>
            </video>
        );
    }
}

export default DrivePage;