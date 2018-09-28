import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
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
  render() {
    let navItems = [
      ["/",         "Home"],
      ["/drive",    "Drive"],
      ["/nav",      "Navigation"],
      ["/settings", "Settings"],
    ].map((pair)=>make_navbar_link.apply(null, pair));

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
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/settings" component={SettingsPage}/>
          <Route exact path="/drive" component={DrivePage}/>
        </div>
      </Router>
    );
  }
}

export default App;
