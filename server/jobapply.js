const express = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express.Router();

const connectionString =
{
    host: "localhost",
    port: 3306,
    database: "jobportaldb",
    user: "W1_87293_YASH",
    password: "manager"
};

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'bendaleaksha@gmail.com',
        pass: 'kquz bvya vtxg plvr'
    }
});

// Email sending function
const sendApplicationEmail = async (seekerEmail, jobTitle, companyname, seekerName) => {
    if (!seekerEmail) {
        console.error('No seeker email provided');
        return;
    }

    const mailOptions = {
        from: 'bendaleaksha@gmail.com',
        to: seekerEmail,
        subject: 'Job Application Confirmation',
        text: `Congratualations ${seekerName}, You have successfully applied for the job: ${jobTitle} at ${companyname}.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

app.post("/", async (request, response) => {
    const { job_id, seeker_id } = request.body;

    const connection = mysql.createConnection(connectionString);

    try {
        connection.connect();
        const queryText = `insert into job_application (job_id, seeker_id) VALUES (${job_id},${seeker_id})`;
        console.log(queryText);
        await new Promise((resolve, reject) => {
            connection.query(queryText, [job_id, seeker_id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
 
        // Fetch seeker email
        const seekerEmailQuery = `select email, fname FROM jobseeker where seeker_id = ${seeker_id}`;
        console.log(seekerEmailQuery);
        const [seekerEmailResult] = await new Promise((resolve, reject) => {
            connection.query(seekerEmailQuery, [seeker_id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        const seekerEmail = seekerEmailResult.email;
        const seekerName = seekerEmailResult.fname;
        console.log(seekerEmail);

        // Fetch job title
        const jobTitleQuery = `select job_title, companyname from jobs where job_id = ${job_id}`;
        console.log(jobTitleQuery);
        const [jobTitleResult] = await new Promise((resolve, reject) => {
            connection.query(jobTitleQuery, [job_id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        const jobTitle = jobTitleResult.job_title;
        const companyname = jobTitleResult.companyname;
        

        await sendApplicationEmail(seekerEmail, jobTitle, companyname, seekerName);

        response.status(200).json({ success: true, message: 'Email sent successfully.' });
    } catch (err) {
        console.error('Error:', err);
        response.status(500).json({ error: err.message });
    } finally {
        connection.end();
        response.end();
    }
});



app.get("/", (request, response) => {
    const queryText = `
        SELECT 
            job_application.job_id, 
            jobs.job_title, 
            jobseeker.fname, 
            jobseeker.lname, 
            jobseeker.email, 
            jobseeker.contactme, 
            jobseeker.resume_path, 
            job_application.applied_at
        FROM 
            job_application 
        INNER JOIN 
            jobs 
        ON 
            jobs.job_id = job_application.job_id 
        INNER JOIN 
            jobseeker 
        ON 
            job_application.seeker_id = jobseeker.seeker_id
    `;

    const connection = mysql.createConnection(connectionString);

    connection.connect();

    connection.query(queryText, (err, result) => {
        if (err) {
            console.error('Error fetching job applications:', err);
            response.setHeader("content-type", "application/json");
            response.write(JSON.stringify({ error: err.message }));
        } else {
            response.setHeader("content-type", "application/json");
            response.write(JSON.stringify(result));
        }
        connection.end();
        response.end();
    });
});


app.get("/applied-jobs/:seekerId", (req, res) => {
    const seekerId = req.params.seekerId;

    if (!seekerId) {
        return res.status(400).json({ error: "Missing seekerId parameter" });
    }

    const queryText = `
        SELECT 
            job_application.job_id, 
            jobs.job_title, 
            jobseeker.fname, 
            jobseeker.lname, 
            jobseeker.email, 
            jobseeker.contactme, 
            jobseeker.resume_path, 
            job_application.applied_at
        FROM 
            job_application 
        INNER JOIN 
            jobs  
        ON 
            jobs.job_id = job_application.job_id 
        INNER JOIN 
            jobseeker 
        ON 
            job_application.seeker_id = jobseeker.seeker_id
        WHERE 
            jobseeker.seeker_id = ?;
    `;

    const connection = mysql.createConnection(connectionConfig);
    connection.connect();
    connection.query(queryText, [seekerId], (err, result) => {
        if (err) {
            console.error("Error fetching applied jobs:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "No applied jobs found" });
        }

        res.status(200).json(result);
    });
});

module.exports = app;
