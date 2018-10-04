import React, {Component} from 'react';

const widgetClasses = ["dash-widget"]

class Widget extends Component{
    render(){
        return (
            <div className={widgetClasses}>
                <button className="btn btn-primary widget-edit">
                    <span className="glyphicon glyphicon-cog"></span>
                </button>
                {this.props.children}
            </div>
        );
    }
};

export default Widget;