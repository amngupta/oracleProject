'use strict';

var oracledb = require('oracledb');

class queryEngine {

    // export LD_LIBRARY_PATH=/opt/oracle/instantclient:$LD_LIBRARY_PATH
    // ssh -l t0d1b -L localhost:1522:dbhost.ugrad.cs.ubc.ca:1522 remote.ugrad.cs.ubc.ca

    constructor() {
        this.init();
    }
    init() {
        let connection;
        // Get a non-pooled connection
        oracledb.getConnection({
            user: "ora_t0d1b",
            password: "a70746169",
            connectString: "localhost:1522/ug"
        })
            .then(conn => {
                connection = conn;
                return conn.execute(
                    // The statement to execute
                    "select pub_name from publishers where state in ('CA','IN','MD')"
                );
            })
            .then(result => {
                console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
                console.log(result.rows);     // [ [ 180, 'Construction' ] ]
                this.close(connection);
            })
            .catch(err => {
                console.log(err);
                this.close(connection);
            })
    }

    close(connection) {
        connection.close(
            function (err) {
                if (err) {
                    console.error(err.message);
                }
            });
    }
}

module.exports = queryEngine;