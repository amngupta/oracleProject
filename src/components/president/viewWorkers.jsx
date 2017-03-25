import React, { Component } from 'react';
let request = require('request-promise-native');
import { Grid, Row, Col, ListGroup, ControlLabel, FormControl, Button, ListGroupItem, FormGroup, Checkbox } from 'react-bootstrap';

import JsonTable from 'react-json-table';
import ModalOpen from '../Modal'
import NewWorkerForm from './newWorkerForm'



export default class ViewWorkers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            rows: []
        };
        ViewWorkers.onClickRow = ViewWorkers.onClickRow.bind(this);
        this.doQuery = this.doQuery.bind(this);
    }

    componentWillMount() {
        let query = "SELECT * from WORKER";
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
                });
                self.setState({
                    rows: body.rows
                });
            })
            .catch(function (err) {
                // API call failed... 
                console.error(err);
            });
    }

    doQuery() {
        let table = this.wtype.value;
        let table_id;
        switch (table) {
            case "worker":
                table = "";
                table_id = "w.id";
                break;
            case "employee":
                table = ", employee e";
                table_id = "e.emp_id";
                break;
            case "manager":
                table = ", manager m";
                table_id = "m.man_id";
                break;
            case "president":
                table = ", president p";
                table_id = "p.pres_id";
                break;
        }
        let filter = [];
        let id = this.wid.value || null;
        let name = this.wname.value || null;
        let phone = this.wphone.value || null;
        if (id) { filter.push("w.id=" + id); }
        if (name) { filter.push("LOWER(w.name) LIKE '%" + name + "%'"); }
        if (phone) { filter.push("w.phonenumber LIKE '%" + phone + "%'"); }
        let query = "SELECT * FROM worker w" + table + " WHERE w.id=" + table_id;
        if (filter.length !== 0) { query += " AND " + filter.join(" AND "); }
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
                let columns = [];
                body.metaData.forEach((mD) => {
                    columns.push(mD.name);
                });
                self.setState({
                    rows: body.rows, columnNames: columns
                });
            })
            .catch(function (err) {
                // API call failed... 
                console.error(err);
            });
    }

    static onClickRow(event, data) {
        console.log(data);
    }

    render() {
        const button = (<Button bsStyle="success">Add New Worker </Button>);
        const newWorkerForm = <NewWorkerForm />;
        const formBody = (
            <div>
                <form className="form-horizontal" onSubmit={this.doQuery}>
                    <fieldset>
                        <ListGroup>
                            <ListGroupItem>
                                <div className="row">
                                    <div className="form-group col-sm-6">
                                        <label className="control-label text-semibold col-sm-4 col-md-3">Worker Id</label>
                                        <div className="col-sm-8 col-md-9">
                                            <input type='number' name='wid' ref={ref => this.wid = ref} placeholder='Worker Id' className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <label className="control-label text-semibold col-sm-4 col-md-3">Full Name</label>
                                        <div className="col-sm-8 col-md-9">
                                            <input type='text' name='wname' ref={ref => this.wname = ref} placeholder='Full Name' className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <label className="control-label text-semibold col-sm-4 col-md-3">Phone Number</label>
                                        <div className="col-sm-8 col-md-9">
                                            <input type='text' name='name' ref={ref => this.wphone = ref} placeholder='Number' className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <ControlLabel className="col-sm-4 col-md-3">Type</ControlLabel>
                                        <div className="col-sm-8 col-md-9">
                                            <FormControl componentClass="select" inputRef={ref => this.wtype = ref} placeholder="select">
                                                <option value="worker">ALL</option>
                                                <option value="president">President</option>
                                                <option value="manager">Manager</option>
                                                <option value="employee">Employee</option>
                                            </FormControl>
                                        </div>
                                    </div>
                                </div>
                            </ListGroupItem>
                            <ListGroupItem>
                                <div className="row">
                                    <div className="row">
                                        <div className="form-group col-sm-12">
                                            <div className=" col-xs-12 text-center">
                                                <input type="submit" className="btn btn-success" />
                                                <Button bsStyle="success" onClick={this.doQuery}>Search</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ListGroupItem>
                        </ListGroup>
                    </fieldset>
                </form>
            </div>
        );
        return (
            <Grid fluid={true}>
                <Row>
                    <Col xs={10}>
                        {formBody}
                    </Col>
                    <Col xs={2}>
                        <ModalOpen eventListener={button} modalBody={newWorkerForm} />
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
        );
    }
}
