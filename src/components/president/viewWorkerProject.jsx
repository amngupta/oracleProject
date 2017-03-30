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
        let query = "SELECT pb.PID as ProjectId, pb.NAME as Project, w.ID as WorkerID, w.NAME as Name from Worker w, ProjectManager pm, ProjectBudget pb WHERE (pm.PID = pb.PID AND pm.man_ID = w.ID)"
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
                    managers: body.rows
                });
            })
            .catch(function (err) {
                // API call failed... 
                console.error(err);
            });

        let query2 = "SELECT pb.PID as ProjectId, pb.NAME as Project, w.ID as WorkerID, w.NAME as Name, pe.Role as ROLE from Worker w, ProjectAssignedToEmployee pe, ProjectBudget pb WHERE (pe.PID = pb.PID AND pe.emp_ID = w.ID)"
        let options2 = {
            uri: 'http://localhost:9000/query/' + encodeURI(query2),
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response 
        };
        request(options2)
            .then(function (body2) {
                console.log(body2);
                self.setState({
                    employees: body2.rows
                });
            })
            .catch(function (err2) {
                // API call failed... 
                console.error(err2);
            });
    }


    doQuery(e) {
        e.preventDefault();
        let id = this.pid.value || null;
        let queryType = this.queryType.value || null;
        let query = {};
        let self = this;
        if (queryType && queryType == "IN" && id) {
            let query = "SELECT pb.PID as ProjectId, pb.NAME as Project, w.ID as WorkerID, w.NAME as Name from Worker w, ProjectManager pm, ProjectBudget pb WHERE (pm.PID = pb.PID AND pm.man_ID = w.ID) AND pb.PID =" + id;
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
                        managers: body.rows
                    });
                })
                .catch(function (err) {
                    // API call failed... 
                    console.error(err);
                });

            let query2 = "SELECT pb.PID as ProjectId, pb.NAME as Project, w.ID as WorkerID, w.NAME as Name, pe.Role as ROLE from Worker w, ProjectAssignedToEmployee pe, ProjectBudget pb WHERE (pe.PID = pb.PID AND pe.emp_ID = w.ID)  AND pb.PID =" + id
            let options2 = {
                uri: 'http://localhost:9000/query/' + encodeURI(query2),
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response 
            };
            request(options2)
                .then(function (body2) {
                    console.log(body2);
                    self.setState({
                        employees: body2.rows
                    });
                })
                .catch(function (err2) {
                    // API call failed... 
                    console.error(err2);
                });
        }
        else if (queryType && queryType == "NOT" && id) {
            let query = "SELECT pb.PID as ProjectId, pb.NAME as Project, w.ID as WorkerID, w.NAME as Name from Worker w, ProjectManager pm, ProjectBudget pb WHERE (pm.PID = pb.PID AND pm.man_ID = w.ID) AND pb.PID <>" + id;
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
                        managers: body.rows
                    });
                })
                .catch(function (err) {
                    // API call failed... 
                    console.error(err);
                });

            let query2 = "SELECT pb.PID as ProjectId, pb.NAME as Project, w.ID as WorkerID, w.NAME as Name, pe.Role as ROLE from Worker w, ProjectAssignedToEmployee pe, ProjectBudget pb WHERE (pe.PID = pb.PID AND pe.emp_ID = w.ID)  AND pb.PID <>" + id
            let options2 = {
                uri: 'http://localhost:9000/query/' + encodeURI(query2),
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response 
            };
            request(options2)
                .then(function (body2) {
                    console.log(body2);
                    self.setState({
                        employees: body2.rows
                    });
                })
                .catch(function (err2) {
                    // API call failed... 
                    console.error(err2);
                });
        }
        else{
            // NIXON: SELECT ALL WORKERS AND MANAGERS THAT ARE NOT IN ANY PROJECT
        }
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
                                            <FormControl componentClass="select" inputRef={ref => this.queryType = ref} placeholder="select">
                                                <option value="IN">In Project</option>
                                                <option value="NOT">Not in Project</option>
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
                        <h1>Managers</h1>
                        <div className="table-responsive">
                            <JsonTable className="table" rows={this.state.managers} />
                        </div>
                    </Col>
                    <Col xs={12}>
                        <h1>Employees</h1>
                        <div className="table-responsive">
                            <JsonTable className="table" rows={this.state.employees} />
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }
}
