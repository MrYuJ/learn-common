import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Debounce from './learn/Debounce';
import Throttle from './learn/Throttle';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>1.Debounce</h1>
        <Debounce/> 
        <hr/>
        <h1>2.Throttle</h1>
        <Throttle/> 
      </div>
    );
  }
}

export default App;
