var oracledb = require('oracledb');
var dbConfig = require('./config.json');

// export LD_LIBRARY_PATH=/opt/oracle/instantclient:$LD_LIBRARY_PATH
// ssh -l t0d1b -L localhost:1522:dbhost.ugrad.cs.ubc.ca:1522 remote.ugrad.cs.ubc.ca

// Get a non-pooled connection
oracledb.getConnection(
  {
    user          : "ora_t0d1b",
    password      : "a70746169",
    connectString : "localhost:1522/ug"
  },
  function(err, connection)
  {
    if (err) {
      console.error(err);
      return;
    }
    connection.execute(
      // The statement to execute
      "select pub_name from publishers where state in ('CA','IN','MD')",

      // The "bind value" 180 for the "bind variable" :id
      // [180],

      // Optional execute options argument, such as the query result format
      // or whether to get extra metadata
      // { outFormat: oracledb.OBJECT, extendedMetaData: true },

      // The callback function handles the SQL execution results
      function(err, result)
      {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
        console.log(result.rows);     // [ [ 180, 'Construction' ] ]
        doRelease(connection);
      });
  });

// Note: connections should always be released when not needed
function doRelease(connection)
{
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}