import React, { Component } from 'react';
let request = require('request-promise-native');
import { Grid, Row, Col, ListGroup, ControlLabel, FormControl, Button, ListGroupItem } from 'react-bootstrap';
import JsonTable from 'react-json-table';
import ModalOpen from '../Modal'
import NewProjectForm from './newProjectForm'



export default class ViewProjects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            rows: [],
            aggregation: []
        };
        this.doQuery = this.doQuery.bind(this);
    }

    componentWillMount() {
        let query = "SELECT * from ProjectBudget";
        let options = {
            uri: 'http://localhost:9000/query/' + encodeURI(query),
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };
        let self = this;
        request(options)
            .then(function (body) {
                self.setState({
                    rows: body.rows
                });
                query = "SELECT COUNT(*) FROM ProjectBudget";
                options = {
                    uri: 'http://localhost:9000/query/' + encodeURI(query),
                    headers: {
                        'User-Agent': 'Request-Promise'
                    },
                    json: true
                };
                request(options)
                    .then(function (body) {
                        console.log(body);
                        for(let i = 0; i < body.rows.length; i++){
                            body.rows[i]["COUNT"] = body.rows[i]["COUNT(*)"];
                            delete body.rows[i]["COUNT(*)"];
                        }
                        self.setState({
                            aggregation: body.rows
                        });
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
            })
            .catch(function (err) {
                console.error(err);
            });
    }


    doQuery(e) {
        e.preventDefault();
        let id = this.pid.value || null;
        let name = this.pname.value || null;
        let aggr = this.waggr.value || null;
        let querySuffix = " FROM ProjectBudget p"
        let filter = [];
        if (id) { filter.push("p.pid=" + id); }
        if (name) { filter.push("LOWER(p.name) LIKE LOWER('%" + name + "%')"); }
        if (filter.length !== 0) { querySuffix += " WHERE " + filter.join(" AND "); }
        let self = this;
        let options = {
            uri: 'http://localhost:9000/query/' + encodeURI("SELECT *" + querySuffix),
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };
        request(options)
            .then(function (body) {
                console.log(body);
                self.setState({
                    rows: body.rows
                });
                let aggrQuery = "";
                switch (aggr) {
                    case "COUNT":
                        aggrQuery = aggr + "(*)";
                        break;
                    case "AVG":
                    case "MAX":
                    case "MIN":
                    case "SUM":
                        aggrQuery = aggr + "(P.BUDGET)";
                        break;
                    default:
                        break;
                }
                let options = {
                    uri: 'http://localhost:9000/query/' + encodeURI("SELECT " + aggrQuery + querySuffix),
                    headers: {
                        'User-Agent': 'Request-Promise'
                    },
                    json: true
                };
                request(options)
                    .then(function (body) {
                        console.log(body);
                        for(let i = 0; i < body.rows.length; i++){
                            body.rows[i][aggr] = body.rows[i][aggrQuery];
                            delete body.rows[i][aggrQuery];
                        }
                        self.setState({
                            aggregation: body.rows
                        });
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
            })
            .catch(function (err) {
                console.error(err);
            });
    }


    render() {
        const button = (<Button bsStyle="success">Add New Project </Button>)
        const newProjectForm = <NewProjectForm />
        const formBody = (
            <div>
                <form className="form-horizontal" onSubmit={this.doQuery}>
                    <fieldset>
                        <ListGroup>
                            <ListGroupItem>
                                <div className="row">
                                    <div className="form-group col-sm-6">
                                        <label className="control-label text-semibold col-sm-4 col-md-3">Id Number</label>
                                        <div className="col-sm-8 col-md-9">
                                            <input type='number' name='name' ref={ref => this.pid = ref} placeholder='ID Number' className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <label className="control-label text-semibold col-sm-4 col-md-3">Project Name</label>
                                        <div className="col-sm-8 col-md-9">
                                            <input type='text' name='name' ref={ref => this.pname = ref} placeholder='Project Name' className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <ControlLabel className="col-sm-4 col-md-3">Aggregation:</ControlLabel>
                                        <div className="col-sm-8 col-md-9">
                                            <FormControl componentClass="select" inputRef={ref => this.waggr = ref}>
                                                <option value="COUNT">Count</option>
                                                <option value="AVG">Average Budget</option>
                                                <option value="MAX">Max Budget</option>
                                                <option value="MIN">Min Budget</option>
                                                <option value="SUM">Sum of Budgets</option>
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className="form-group col-sm-12">
                                        <div className="form-group col-sm-12">
                                            <div className=" col-xs-12 text-center">
                                                <input type="submit" className="btn btn-success" value="Search" />
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
                    <Col xs={10}>
                        {formBody}
                    </Col>
                    <Col xs={2}>
                        <ModalOpen eventListener={button} modalBody={newProjectForm} />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div className="table-responsive">
                            <JsonTable className="table" rows={this.state.aggregation} />
                        </div>
                    </Col>
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
