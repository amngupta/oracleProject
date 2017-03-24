import React, { Component } from 'react';
let request = require('request-promise-native');
import { Grid, Col, ListGroup, Button, ListGroupItem, FormGroup, Checkbox } from 'react-bootstrap';
import JsonTable from 'react-json-table';
import ModalOpen from '../Modal'
import NewProjectForm from './newProjectForm'



export default class ViewProjects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            rows: []
        };
    }

    componentWillMount() {
        let query = "SELECT * from ProjectBudget"
        let options = {
            uri: 'http://localhost:9000/query/' + encodeURI(query),
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response 
        };
        let self = this;
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
            })
            .catch(function (err) {
                // API call failed... 
                console.error(err);
            });
    }

    render() {
        const button = (<Button bsStyle="success">Add New Project </Button>)
        const newProjectForm = <NewProjectForm />
        return (
            <Grid fluid={true}>
                <Col xsOffset={10}  xs={2} className="text-left">
                <ModalOpen eventListener={button} modalBody={newProjectForm} />
                </Col>
                <Col xs={12}>
                    <div className="table-responsive">
                        <JsonTable className="table" rows={this.state.rows} />
                    </div>
                </Col>
            </Grid>
        );
    }
}
