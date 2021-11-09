module.exports = function(){
    var express = require("express");
    var router = express.Router();

    /* Get test db */
    function getTestDb( res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM test", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.test =results;
            complete();
        });
    }
}();