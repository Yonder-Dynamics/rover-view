import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Swagger from 'swagger-client';

import logo from './YonderLogoSquare.png';
import './App.css';
import './bootstrap.css';

import HomePage from './home/HomePage.js';
import SettingsPage from './settings/SettingsPage.js';
import DrivePage from './drive/DrivePage.js';

import Glyphicon from './utils/Glyphicon.js';
import Dashboard from './dashboard/Dashboard.js';

function make_navbar_link(path, text){
  return (
    <div className="nav-item" key={path}>
      <Link className="nav-link" to={path}>{text}</Link>
    </div>
  )
}

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      mode: "normal",
    }

    this.client = Swagger('/ctrl/swagger.json');
    this.client.catch(err=>{console.log(err)});

    this.render.bind(this);
  }
  toggleEdit(e){
    console.log("got here")
    this.setState({mode: (this.state.mode == "normal")?"edit":"normal"});
  }
  render() {
    let navItems = [
      ["/",         "Home"],
      ["/drive",    "Drive"],
      ["/nav",      "Navigation"],
      ["/settings", "Settings"],
      ["/dashboard", "Dashboard"],
    ].map((pair)=>make_navbar_link.apply(null, pair));
    let client = this.client;
    function wrapClient(component){
      return ()=>React.createElement(component, {client: client});
    }
    return (
      <Router>
        <div className="App">
          <nav className="control-panel-nav navbar navbar-expand bg-dark">
            {/* <Link className="navbar-brand" to='/' >
              <img src={logo} width="40px" alt="yonder logo"/>
            </Link> */}
            <div className="navbar-collapse">
             <div className="navbar-nav">
                <button type="button" className="btn btn-success" onClick={this.toggleEdit.bind(this)}>
                  <Glyphicon type="edit"/>
                </button>
              </div>
            </div>
          </nav>
          <Dashboard client={client} mode={this.state.mode}></Dashboard>
          {/* <Route exact path="/" component={wrapClient(HomePage)}/>
          <Route exact path="/settings" component={wrapClient(SettingsPage)}/>
          <Route exact path="/drive" component={wrapClient(DrivePage)}/>
          <Route exact path="/dashboard" component={wrapClient(Dashboard)}/> */}
        </div>
      </Router>
    );
  }
}

export default App;
