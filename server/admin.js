// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const app = express.Router();
// const mysql2 = require('mysql2');

// const secretkey = "sunbeaminfo.com";


// const connection =
// {
//     host: "localhost",
//     port: 3306,
//     database: "jobportaldb",
//     user: "W1_87293_YASH",
//     password: "manager"
// };

// // Job Provider Registration (Status: Pending)
// app.post('/register', async (req, res) => {
//     const { email, password, company_name, company_description } = req.body;
    
//     if (!email || !password || !company_name) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const query = `INSERT INTO jobprovider (email, password, company_name, company_description, approval_status) VALUES (?, ?, ?, ?, 'pending')`;
//         let connection = mysql2.createConnection(connectionString);
//         connection.connect();    
//         connection.query(query, [email, hashedPassword, company_name, company_description], (err, result) => {
//             if (err) return res.status(500).json({ message: 'Database error', error: err });
//             res.status(201).json({ message: 'Registration request sent for admin approval' });
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error processing request', error });
//     }
// });


// // Fetch all pending job providers
// app.get('/jobproviders/pending', (req, res) => {
//     const query = `SELECT * FROM jobprovider WHERE approval_status = 'pending'`;
//     let connection = mysql2.createConnection(connectionString);
//     connection.connect();
//     connection.query(query, (err, results) => {
//         if (err) return res.status(500).json({ message: 'Database error', error: err });
//         res.status(200).json(results);
//     });
// });

// // Approve or Reject a Job Provider
// app.put('/approve-jobprovider/:providerId', (req, res) => {
//     const { providerId } = req.params;
//     const { status } = req.body; // status should be 'approved' or 'rejected'

//     if (!['approved', 'rejected'].includes(status)) {
//         return res.status(400).json({ message: 'Invalid status' });
//     }

//     const query = `UPDATE jobprovider SET approval_status = ? WHERE provider_id = ?`;
//     let connection = mysql2.createConnection(connectionString);
//     connection.connect();
//     connection.query(query, [status, providerId], (err, result) => {
//         if (err) return res.status(500).json({ message: 'Database error', error: err });
//         if (result.affectedRows === 0) return res.status(404).json({ message: 'Provider not found' });
        
//         res.status(200).json({ message: `Job Provider ${status} successfully` });
//     });
// });


// app.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     const query = `SELECT * FROM jobprovider WHERE email = ?`;
//     let connection = mysql2.createConnection(connectionString);
//     connection.connect();
//     connection.query(query, [email], async (err, results) => {
//         if (err) return res.status(500).json({ message: 'Database error', error: err });

//         if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

//         const provider = results[0];

//         if (provider.approval_status === 'pending') {
//             return res.status(403).json({ message: 'Your account is pending admin approval' });
//         } else if (provider.approval_status === 'rejected') {
//             return res.status(403).json({ message: 'Your account has been rejected by the admin' });
//         }

//         const match = await bcrypt.compare(password, provider.password);
//         if (!match) return res.status(401).json({ message: 'Invalid credentials' });

//         const token = jwt.sign({ provider_id: provider.provider_id, email: provider.email }, 'your_secret_key', { expiresIn: '1h' });

//         res.status(200).json({ message: 'Login successful', token });
//     });
// });


// module.exports = app;

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql2 = require('mysql2');

const app = express.Router();
const secretkey = "sunbeaminfo.com";

const connectionConfig = {
    host: "localhost",
    port: 3306,
    database: "jobportaldb",
    user: "W1_87293_YASH",
    password: "manager"
};

// Create a **single** database connection
const db = mysql2.createConnection(connectionConfig);
db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL database");
});

// **Register Job Provider (Status: Pending)**
app.post('/register', async (req, res) => {
    const { email, password, company_name, company_description } = req.body;
    
    if (!email || !password || !company_name) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO jobprovider (email, password, company_name, company_description, approval_status) VALUES (?, ?, ?, ?, 'pending')`;
        
        db.query(query, [email, hashedPassword, company_name, company_description], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            res.status(201).json({ message: 'Registration request sent for admin approval' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing request', error });
    }
});

// **Fetch All Pending Job Providers**
app.get('/jobproviders/pending', (req, res) => {
    const query = `SELECT * FROM jobprovider WHERE approval_status = 'pending'`;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.status(200).json(results);
    });
});

// **Approve or Reject a Job Provider**
app.put('/approve-jobprovider/:providerId', (req, res) => {
    const { providerId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    const query = `UPDATE jobprovider SET approval_status = ? WHERE provider_id = ?`;
    
    db.query(query, [status, providerId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Provider not found' });
        
        res.status(200).json({ message: `Job Provider ${status} successfully` });
    });
});

app.post('/admin/signin', (req, res) => {
    const { email, password } = req.body;

    const reply = { jwtoken: undefined, message: "" };
    console.log("Email received:", email);
    console.log("Password received:", password);

    const queryText = `SELECT admin_id, email, password FROM admin WHERE email = ?`;
    
   
    db.query(queryText, [email], async (err, result) => {

        if (err) {
            console.error("Database Error:", err);
            reply.message = "Error in database operation";
            return res.status(500).json(reply);
        }

        console.log("Query Result:", result);
        if (result.length > 0) {
            const { admin_id, password: hashedPassword } = result[0];

            // Compare hashed password
            const match = await bcrypt.compare(password, hashedPassword);
            if (!match) {
                reply.message = "Invalid email or password";
                return res.status(401).json(reply);
            }

            // JWT payload
            const payload = {
                admin_id,
                username: email,
                datetime: new Date().toString(),
                role: "admin",
                randomNo: Math.random()
            };
            const token = jwt.sign(payload, secretKey, { expiresIn: '2h' });

            res.json({ jwtoken: token, message: "success" });
        } else {
            reply.message = "Invalid email or password";
            res.status(401).json(reply);
        }
    });
});

// **Login API**
// app.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     const query = `SELECT * FROM admin WHERE email = ?`;
    
//     db.query(query, [email], async (err, results) => {
//         if (err) return res.status(500).json({ message: 'Database error', error: err });

//         if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

//         const provider = results[0];

//         if (provider.approval_status === 'pending') {
//             return res.status(403).json({ message: 'Your account is pending admin approval' });
//         } else if (provider.approval_status === 'rejected') {
//             return res.status(403).json({ message: 'Your account has been rejected by the admin' });
//         }

//         const match = await bcrypt.compare(password, provider.password);
//         if (!match) return res.status(401).json({ message: 'Invalid credentials' });

//         const token = jwt.sign({ provider_id: provider.provider_id, email: provider.email }, secretkey, { expiresIn: '1h' });

//         res.status(200).json({ message: 'Login successful', token });
//     });
// });

// app.post('/admin/login', (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ message: 'Email and password are required' });
//     }

//     const query = `SELECT * FROM admin WHERE email = ?`;
//     // let connection = mysql2.createConnection(connectionConfig);
    
//     // connection.connect();
//     db.query(query, [email], async (err, results) => {
//         // connection.end();

//         if (err) return res.status(500).json({ message: 'Database error', error: err });

//         if (results.length === 0) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         const admin = results[0];

//         const match = await bcrypt.compare(password, admin.password);
//         if (!match) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ admin_id: admin.admin_id, email: admin.email }, secretKey, { expiresIn: '2h' });

//         res.status(200).json({ message: 'Login successful', token });
//     });
// });

module.exports = app;
