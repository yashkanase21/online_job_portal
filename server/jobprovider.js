const express = require('express');
var app = express.Router();
 
const jwt = require('jsonwebtoken')

const mysql2=require('mysql2')
const secretkey = "sunbeaminfo.com";


const connectionString =
{
    host: "localhost",
    port: 3306,
    database: "jobportaldb",
    user: "W1_87293_YASH",
    password: "manager"
};


app.post("/signup", (request, response) => {
    let queryText = `insert into jobprovider(email,password,company_name,company_description) values ('${request.body.email}','${request.body.password}','${request.body.company_name}','${request.body.company_description}')`
    console.log(queryText);
    let connection = mysql2.createConnection(connectionString);
    connection.connect();
    connection.query(queryText, (err, result) => {
        if (err == null) {
            var resultInString = JSON.stringify(result);
            response.setHeader("connection-type", "application/json")
            response.write(resultInString);
            connection.end();
            response.end();
        }

    });
});
app.get("/", (request, response) => {
    console.log("get method is called");
    let queryText = `select * from jobs`;
    console.log(queryText);
    let connection = mysql2.createConnection(connectionString);
    connection.connect();
    connection.query(queryText, (err, result) => {
        if (err == null) {
            var resultInString = JSON.stringify(result);
            response.setHeader("Content-type", "application/json");
            response.write(resultInString);
            connection.end();
            response.end();
        }
        else {
            var errInString = JSON.stringify(err);
            response.setHeader("Content-type", "application/json");
            response.write(errInString);
            connection.end();
            response.end();
        }
    });
});


app.post('/signin', (request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    const reply = { jwtoken: undefined, message: "" };
    console.log("Email received is " + email);
    console.log("Password received is " + password);

    const queryText = `SELECT provider_id, email, password FROM jobprovider WHERE email='${email}' AND password='${password}';`;
    console.log(queryText);
    
    const connection = mysql2.createConnection(connectionString);
    connection.connect();
    connection.query(queryText, (err, result) => {
        if (err) {
            console.error(err);
            reply.message = "Error in database operation";
            response.status(500).json(reply);
            return;
        }

        console.log(result);
        if (result.length > 0) {
            const { provider_id } = result[0]; 
            const payload = {
                provider_id, 
                username: email,
                datetime: new Date().toString(),
                role: "employee",
                RandomNo: Math.random()
            };
            const token = jwt.sign(payload, secretkey); // Sign the token with the secret key
            const outputToBeSent = { jwtoken: token, message: "success" };
            response.json(outputToBeSent);
        } else {
            reply.message = "Admin is invalid";
            response.json(reply);
        }
    });
});




app.get("/adminprofile/:provider_id", (request, response) => {
    let provider_id = request.params.provider_id;
    let queryText = `select * from jobprovider where provider_id =${provider_id}`;
    console.log(queryText);
    let connection = mysql2.createConnection(connectionString);
    connection.connect();
    connection.query(queryText, (err, result) => {
        if (err == null) {
            var resultInString = JSON.stringify(result);
            response.setHeader("Content-type", "application/json");
            response.write(resultInString);
            connection.end();
            response.end();
        }
        else {
            var errInString = JSON.stringify(err);
            response.setHeader("Content-type", "application/json");
            response.write(errInString);
            connection.end();
            response.end();
        }
    });
});


app.put("/:provider_id", (request, response) => {
    let provider_id = request.params.provider_id;
    let email = request.body.email;
    let password = request.body.password;
    let company_name = request.body.company_name;
    let company_description = request.body.company_description;

    let queryText = `update jobprovider set email = '${email}',password ='${password}',company_name='${company_name}',company_description='${company_description}' where provider_id=${provider_id}`;

    console.log(queryText);

    let connection = mysql2.createConnection(connectionString);
    connection.connect();
    connection.query(queryText, (err, result) => {
        if (err == null) {
            var resultInString = JSON.stringify(result);
            response.setHeader("content-type", "application/json");
            response.write(resultInString);
            connection.end();
            response.end();
        }
        else {
            var errInString = JSON.stringify(result);
            response.setHeader("content-type", "application/json");
            response.write(errInString);
            connection.end();
            response.end();
        }
    });
});


module.exports = app;