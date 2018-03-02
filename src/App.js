import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Debounce from './learn/Debounce';
import Throttle from './learn/Throttle';
import Type from './learn/Type';
import Copy from './learn/Copy';
import Flatten from './learn/Flatten';
import Each from './learn/Each';
import Curry from './learn/Curry'
import Compose from './learn/Compose'
import Observer from './learn/Vue/Observer'
import Depend from './learn/Vue/Depend'
import Compile from './learn/Vue/Compile'
import {
  HashRouter as Router,
  Route,
  Link
} from 'react-router-dom'
class App extends Component {
  render() {
    const commonList = {
      Debounce,
      Throttle,
      Type,
      Copy,
      Flatten,
      Each,
      Curry,
      Compose
    }
    const vueList = {
      Observer,
      Depend,
      Compile
    }
    const renderLi = (list) => (
      Object.keys(list).map((key, index) => (
        <li key={index}><Link to={`/${key}`}>{key}</Link></li>
      ))
    )
    const renderRoute = (list) => (
      Object.keys(list).map((key, index) => (
        <Route key={index} path={`/${key}`} component={list[key]}/>
      ))
    )
    const renderTitle = (name) => (
      <h1 style={{fontSize: '18px', color: 'blue'}}>{name}</h1>
    )
    return (
      <div className="App">
        <Router>
          <div className="wrap">
            <ul className="list">
              {renderTitle('基础函数')}
              {renderLi(commonList)}
              {renderTitle('Vue分析')}
              {renderLi(vueList)}
            </ul>
            <div className="content">
              <Route exact path="/" component={Debounce}/>
              {renderRoute(commonList)}
              {renderRoute(vueList)}
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
