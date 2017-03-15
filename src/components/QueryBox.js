import React, { Component } from 'react';
let request = require('request-promise-native');
import { Button, Col, Grid } from 'react-bootstrap';
import Table from 'rc-table';

export default class QueryBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            rows: [{
                "key": 1,
                "NAME": "Jack Sparrow",
                "PHONENUMBER": "113-555-8789"
                },
                {
                    "key": 2,
                    "NAME": "Daisy Duck",
                    "PHONENUMBER": "457-898-4545"
                },
                {
                    "key": 3,
                    "NAME": "Huey Duck",
                    "PHONENUMBER": "457-898-4546"
                }],
            columnNames: [{
                title: 'Name', dataIndex: 'NAME', key: 'name'
                }, {
                    title: 'Phone', dataIndex: 'PHONENUMBER', key: 'age'
                }, {
                    title: 'Apeartions', dataIndex: '', key: 'opeartions', render: () => <a href="#">Delete</a>,
                }]
        };
        this.doQuery = this.doQuery.bind(this);
    }


    doQuery() {
        let self = this;
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
                let columns = [];
                body.metaData.forEach((mD) => {
                    columns.push(mD.name);
                })
                self.setState({
                    rows: body.rows, columnNames: columns
                });
                // console.log(self.state.rows);
            })
            .catch(function (err) {
                // API call failed... 
                console.error(err);
            });
    }

    render() {
        return (
            <Grid fluid={true}>
                <Col xs={10}>
                    <textarea ref={ref => this.queryBox = ref} className="App-intro">

                    </textarea>
                </Col>
                <Col xs={2}>
                    <Button onClick={() => { this.doQuery() }} bsStyle="success">
                        GO
            </Button>
                </Col>
                <Col xs={12}>
                    <Table data={this.state.rows} columns={this.state.columnNames} />
                </Col>
            </Grid>
        );
    }
}
