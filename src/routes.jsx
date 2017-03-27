import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link, NavLink
} from 'react-router-dom'
import AppContainer from './App';
// import createBrowserHistory from 'history/createBrowserHistory'
import { Nav, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';
import ViewProjects from './components/president/viewProjects';
import ViewWorkers from './components/president/viewWorkers';
import ViewWorkerProjects from './components/president/viewWorkerProject';
import ViewExpenditures from './components/manager/viewExpenditure';


const Routes = (
    <Router>
        <div>
            <Navbar collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">
                            McDuck Project
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavDropdown eventKey={1} title="President" id="basic-nav-dropdown">
                            <MenuItem eventKey={1.1}><NavLink to="/president/project">Project</NavLink></MenuItem>
                            <MenuItem eventKey={1.2}><NavLink to="/president/workers">Workers</NavLink></MenuItem>
                            <MenuItem eventKey={1.2}><NavLink to="/president/workerProjects">Employee Projects</NavLink></MenuItem>
                        </NavDropdown>
                        <NavDropdown eventKey={2} title="Manager" id="basic-nav-dropdown">
                            <MenuItem eventKey={2.1}><NavLink to="/manager/expenditure">Expenditure Reports</NavLink></MenuItem>
                        </NavDropdown>
                        <NavDropdown eventKey={3} title="Employee" id="basic-nav-dropdown">
                            <MenuItem eventKey={3.1}><NavLink to="rooms">Rooms Explorer</NavLink></MenuItem>
                            <MenuItem eventKey={3.2}><NavLink to="scheduler">Rooms Scheduling</NavLink></MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Route exact path="/" component={AppContainer} />
            <Route path="/president/project" component={ViewProjects} />
            <Route path="/president/workers" component={ViewWorkers} />
            <Route path="/president/workerProjects" component={ViewWorkerProjects} />
            <Route path="/manager/expenditure" component={ViewExpenditures} />
        </div>
    </Router>
);

export default Routes;