import React, { Component } from 'react';
let request = require('request-promise-native');
import { Grid, Row, Col, ListGroup, ControlLabel, FormControl, Button, ListGroupItem, FormGroup, Checkbox } from 'react-bootstrap';
import JsonTable from 'react-json-table';
import ModalOpen from '../Modal'
import NewProjectForm from './newProjectForm'



export default class ViewWorkerProject extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            rows: []
        };
        this.doQuery = this.doQuery.bind(this);
    }

    componentWillMount() {
        let query = "SELECT * from Worker"
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
                self.setState({
                    rows: body.rows
                });
            })
            .catch(function (err) {
                // API call failed... 
                console.error(err);
            });
    }


    doQuery(e) {
        e.preventDefault();
        let id = this.pid.value || null;
        let workerType = this.wtype.value || null;
        // switch (tableChoice) {
        //     case worker:
        //         table = "";
        //         id = "w.id";
        //         break;
        //     case employee:
        //         table = ", employee e";
        //         id = "e.emp_id"
        //         break;
        //     case manager:
        //         table = ", manager m";
        //         id = "m.man_id";
        //         break;
        //     case president:
        //         table = ", president p";
        //         id = "p.pres_id";
        //         break;
        // }
        // switch (filterChoice) {
        //     case id:
        //         filter = "id='" + input + "'"
        //         break;
        //     case name:
        //         filter = "name='" + input + "'"
        //         break;
        //     case phonenumber:
        //         filter = "phonenumber='" + input + "'"
        //         break;
        // }
        // let query = "SELECT DISTINCT w.id, w.name, w.phonenumber FROM worker w" + table + " WHERE w." + filter + " AND w.id=" + id;
        let query = {};
        let self = this;
        let options = {
            uri: 'http://localhost:9000/query/' + encodeURI(query),
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response 
        };
        request(options)
            .then(function (body) {
                console.log(body);
                self.setState({
                    rows: body.rows
                });
            })
            .catch(function (err) {
                // API call failed... 
                console.error(err);
            });
    }


    render() {
        const formBody = (
            <div>
                <form className="form-horizontal" onSubmit={this.doQuery}>
                    <fieldset>
                        <ListGroup>
                            <ListGroupItem>
                                <div className="row">
                                    <div className="form-group col-sm-6">
                                        <label className="control-label text-semibold col-sm-4 col-md-3">Project Id</label>
                                        <div className="col-sm-8 col-md-9">
                                            <input type='number' name='name' ref={ref => this.pid = ref} placeholder='Project Id' className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <ControlLabel className="col-sm-4 col-md-3">Type</ControlLabel>
                                        <div className="col-sm-8 col-md-9">
                                            <FormControl componentClass="select" inputRef={ref => this.wtype = ref} placeholder="select">
                                                <option value="worker">--</option>
                                                <option value="president">President</option>
                                                <option value="manager">Manager</option>
                                                <option value="employee">Employee</option>
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className="form-group col-sm-12">
                                        <div className="form-group col-sm-12">
                                            <div className=" col-xs-12 text-center">
                                                <input type="submit" className="btn btn-success" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ListGroupItem>
                        </ListGroup>
                    </fieldset>
                </form>
            </div>
        )
        return (
            <Grid fluid={true}>
                <Row>
                    <Col xs={12}>
                        {formBody}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div className="table-responsive">
                            <JsonTable className="table" rows={this.state.rows} onClickRow={this.onClickRow} />
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }
}
