import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
let request = require('request-promise-native');
// import { queryEngine } from '../queryEngine/init'
export default class App extends Component {

  doQuery() {
    let query = this.queryBox.value;
    console.log(query);
    var options = {
      uri: 'http://localhost:9000/query/' + encodeURI(query),
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response 
    };
    request(options)
      .then(function (body) {
        console.log(body);
        // console.log('User has %d repos', repos.length);
      })
      .catch(function (err) {
        // API call failed... 
        console.error(err);
      });
  }

  render() {

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <textarea ref={ref => this.queryBox = ref} className="App-intro">

        </textarea>
        <hr />
        <button onClick={() => { this.doQuery() }}>
          GO
        </button>
      </div>
    );
  }
}
