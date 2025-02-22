const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql2 = require('mysql2');
const jwt = require('jsonwebtoken');


const secretkey = "sunbeaminfo.com";

const connectionString =
{
    host: "localhost",
    port: 3306,
    database: "jobportaldb",
    user: "W1_87293_YASH",
    password: "manager"
};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage 
   });
  
  const app = express.Router();
  app.use(express.urlencoded({ extended: false })); 
  
  app.post("/uploadresume", upload.single("resume"), (req, res) => {
    const seekerId = req.body.seeker_id; 
    const resumePath = req.file ? req.file.path : null; 
  
    const connection = mysql2.createConnection(connectionString);
    connection.connect();
  
    const query = `update jobseeker set resume_path = '${resumePath}' where seeker_id = ${seekerId}`;
  
    connection.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error in saving resume');
      } else {
        res.json({ message: 'Resume uploaded successfully' });
      }
      connection.end(); 
    });
  });

  // for get particular resume 

  app.get("/resume/:seeker_id", (request, response) => {
    const seeker_id = request.params.seeker_id;
    const queryText = `SELECT resume_path FROM jobseeker WHERE seeker_id = ?`;
    
    const connection = mysql2.createConnection(connectionString);

    connection.connect();
    connection.query(queryText, [seeker_id], (err, results) => {
        if (err) {
            response.status(500).json({ error: err.message });
        } else {
            if (results.length > 0) {
                response.json(results[0]); // Sending only the first result
            } else {
                response.status(404).json({ error: 'Resume not found' });
            }
        }
        connection.end();
    });
});


app.get("/myprofile/:seeker_id", (request, response) => {
    let seeker_id = request.params.seeker_id;
    let queryText = `select * from jobseeker where seeker_id =${seeker_id}`;
    console.log(queryText);
    let connection = mysql2.createConnection(connectionString);

    connection.connect();
    connection.query(queryText, (err, result) => {
        console.log(result);
        if (err == null) {
            var resultInString = JSON.stringify(result);
            response.setHeader("content-type", "application/json");
            response.write(resultInString);
            connection.end();
            response.end();
        }
        else {
            var errInString = JSON.stringify(err);
            response.setHeader("content-type", "application/json");
            response.write(errInString);
            connection.end();
            response.end();
        }
    });
});





app.post("/signup", (request, response) => {
    let queryText = `insert into jobseeker(fname,lname,email,password,contactme,state,city,qualification) values ('${request.body.fname}', '${request.body.lname}','${request.body.email}','${request.body.password}','${request.body.contactme}','${request.body.state}','${request.body.city}','${request.body.qualification}')`;

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
    });
});

    app.put("/:seeker_id", (request, response) => {
        let seeker_id = request.params.seeker_id;
        let fname = request.body.fname;
        let lname = request.body.lname;
        let email = request.body.email;
        let password = request.body.password;
        let contactme = request.body.contactme;
        let state = request.body.state;
        let city = request.body.city;
        let qualification = request.body.qualification;

        let queryText = `update jobseeker set fname = '${fname}', lname ='${lname}',email = '${email}',password ='${password}',contactme='${contactme}',state='${state}',city='${city}',qualification='${qualification}' where seeker_id=${seeker_id}`;

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



app.post('/signin', (request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    const reply = { jwtoken: undefined, message: "" };
    console.log("Email received is " + email);
    console.log("Password received is " + password);

    const queryText = `SELECT seeker_id, email, password FROM jobseeker WHERE email='${email}' AND password='${password}';`;
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
            const { seeker_id } = result[0]; // Get seeker_id from the query result
            const payload = {
                seeker_id, // Include seeker_id in the payload
                username: email,
                datetime: new Date().toString(),
                role: "employee",
                RandomNo: Math.random()
            };
            const token = jwt.sign(payload, secretkey); // Sign the token with the secret key
            const outputToBeSent = { jwtoken: token, message: "success" };
            response.json(outputToBeSent);
        } else {
            reply.message = "User is invalid";
            response.json(reply);
        }
    });
});



module.exports = app;