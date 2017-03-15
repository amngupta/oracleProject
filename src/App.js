import React, { Component } from 'react';
import './App.css';
import { Col, Grid, Row } from 'react-bootstrap';
import QueryBox from './components/QueryBox'
import Header from './components/Header'
export default class App extends Component {

  render() {

    return (
      <Grid fluid={true}>
        <Row>
          <div className="App">
            <Header />
            <Col xs={12}>
              <QueryBox />
            </Col>
          </div>
        </Row>
      </Grid>
    );
  }
}
