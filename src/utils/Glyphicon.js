import React, {Component} from 'react';

class Glyphicon extends Component{
    render(){
        return <span className={"glyphicon glyphicon-" + this.props.type}></span>
    }
}

export default Glyphicon;