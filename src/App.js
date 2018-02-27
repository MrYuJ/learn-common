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
class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>1.Debounce</h1>
        <Debounce/> 
        <hr/>
        <h1>2.Throttle</h1>
        <Throttle/>
        <h1>3.Type</h1>
        <Type/>
        <h1>4.Copy</h1>
        <Copy/>
        <h1>5.Copy</h1>
        <Flatten/>
        <h1>6.Each</h1>
        <Each/>
        <h1>7.Curry</h1>
        <Curry/>
        <h1>8.Compose</h1>
        <Compose/>
      </div>
    );
  }
}

export default App;
