import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Swagger from 'swagger-client';

import logo from './YonderLogoSquare.png';
import './App.css';
import './bootstrap.css';

import HomePage from './home/HomePage.js';
import SettingsPage from './settings/SettingsPage.js';
import DrivePage from './drive/DrivePage.js';

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

    this.client = Swagger('/ctrl/swagger.json');
    this.client.catch(err=>{console.log(err)});

    this.render.bind(this);
  }
  render() {
    let navItems = [
      ["/",         "Home"],
      ["/drive",    "Drive"],
      ["/nav",      "Navigation"],
      ["/settings", "Settings"],
    ].map((pair)=>make_navbar_link.apply(null, pair));
    let client = this.client;
    function wrapClient(component){
      return ()=>React.createElement(component, {client: client});
    }
    return (
      <Router>
        <div className="App">
          <nav className="control-panel-nav navbar navbar-expand bg-dark">
            <Link className="navbar-brand" to='/' >
              <img src={logo} width="40px" alt="yonder logo"/>
            </Link>
            <div className="navbar-collapse">
             <div className="navbar-nav">
                { navItems }
              </div>
            </div>
          </nav>
          <Route exact path="/" component={wrapClient(HomePage)}/>
          <Route exact path="/settings" component={wrapClient(SettingsPage)}/>
          <Route exact path="/drive" component={wrapClient(DrivePage)}/>
        </div>
      </Router>
    );
  }
}

export default App;
