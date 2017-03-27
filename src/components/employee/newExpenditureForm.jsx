import React, { Component } from 'react';
let request = require('request-promise-native');
import { ListGroup, ControlLabel, FormControl, ListGroupItem } from 'react-bootstrap';

export default class NewExpenditureForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            rows: []
        };
        this.doQuery = this.doQuery.bind(this);
    }


    doQuery(e) {
        e.preventDefault();
        let table = this.wtype.value;
        let name = this.wname.value || null;
        let phone = this.wphone.value || null;
        if (name === null || phone === null) { return; }
        let query = "SELECT MAX(w.id) FROM worker w";
        let options = {
            uri: 'http://localhost:9000/query/' + encodeURI(query),
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };
        request(options)
            .then(function (body) {
                let maxID = body.rows[0]["MAX(W.ID)"] + 1;
                query = "INSERT INTO Worker VALUES (" + maxID + ", '" + name + "', '" + phone + "')";
                let options = {
                    uri: 'http://localhost:9000/query/' + encodeURI(query),
                    headers: {
                        'User-Agent': 'Request-Promise'
                    },
                    json: true
                };
                request(options)
                    .then(function (body) {
                        switch (table) {
                            case "employee":
                                query = "INSERT INTO employee VALUES (" + maxID + ", 11)";
                                break;
                            case "manager":
                                query = "INSERT INTO manager VALUES (" + maxID + ", 1)";
                                break;
                            case "president":
                                query = "INSERT INTO president VALUES (" + maxID + ")";
                                break;
                            default:
                                break;
                        }
                        let options = {
                            uri: 'http://localhost:9000/query/' + encodeURI(query),
                            headers: {
                                'User-Agent': 'Request-Promise'
                            },
                            json: true
                        };
                        request(options)
                            .then(function (body) {
                                alert("Added " + table + "!");
                            })
                            .catch(function (err) {
                                console.error(err);
                            });
                    })
                    .catch(function (err) {
                        console.error(err);
                        alert("Error; please try another Phone Number.")
                    });
            })
            .catch(function (err) {
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
                                            <input type='number' name='name' ref={ref => this.pId = ref} placeholder='Project Id' className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <label className="control-label text-semibold col-sm-4 col-md-3">Expenditure Type</label>
                                        <div className="col-sm-8 col-md-9">
                                            <input type='text' name='name' ref={ref => this.etype = ref} placeholder='Type' className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <label className="control-label text-semibold col-sm-4 col-md-3">Amount</label>
                                        <div className="col-sm-8 col-md-9">
                                            <input type='number' ref={ref => this.eamount = ref} placeholder='Amount' className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <label className="control-label text-semibold col-sm-4 col-md-3">Description</label>
                                        <div className="col-sm-8 col-md-9">
                                            <textarea className="form-control" ref={ref => this.edescription = ref} placeholder="Expenditure Description"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </ListGroupItem>
                            <ListGroupItem>
                                <div className="row">
                                    <div className="form-group col-sm-12">
                                        <div className=" col-xs-12 text-center">
                                            <input type="submit" className="btn btn-success" />
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
            formBody
        );
    }
}
