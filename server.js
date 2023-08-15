const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();

app.use(
    cors({
        origin: 'http://localhost:8080',
        credentials: true,
    }));

app.use(express.json());
app.use(express.static(process.cwd()+"/client/build/"));

// google connection 
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const credentials = require('./credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const spreadsheetId = '18yoGfF4T076LqO4kFGQStnwF1MaDSqKKvMZ36pJfnUA';

async function initializeSheet(sheet, columns) {
    const auth = await authorize();
    const request = {
        spreadsheetId,
        range: sheet, // Change to your desired sheet name or range
        valueInputOption: 'RAW',
        resource: {
            values: [columns], // Column headers
        },
        auth,
    };

    try {
        const response = await sheets.spreadsheets.values.update(request);
        // console.log(response.data);
    } catch (err) {
        console.error(err);
    }
}

async function appendData(sheet, data) {
    const auth = await authorize();
    const request = {
        spreadsheetId,
        range: sheet, // Change to your desired sheet name or range
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [data],
        },
        auth,
    };

    try {
        const response = await sheets.spreadsheets.values.append(request);
        // console.log(response.data);
    } catch (err) {
        console.error(err);
    }
}

async function authorize() {
    const authClient = new google.auth.GoogleAuth({
        credentials,
        scopes: SCOPES,
    });

    return await authClient.getClient();
}

// sql connection
const mysql = require('mysql');

//create database connection
// const conn = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'password',
//     database: 'db1'
// });

// connect to database
// conn.connect((err) => {
//     if (err) throw err;
//     console.log('Mysql Connected...');
// });

app.get('/', (req, res) => res.json({message: 'yyyyeeeessss'}))

// table must exist
// new columns is not implemented
app.post('/store-data', (req, res) => {
    const valuesArray = Object.values(req.body.data);
    console.log("meta: " +req.body.meta.tbl)
    
    console.log("data: " +JSON.stringify(req.body.data, null, 2))

    const keys = Object.keys(req.body.data);
    console.log("keys: " +keys)

    // let sql = "INSERT INTO " + req.body.meta.tbl + " SET ?";
    // let query = conn.query(sql, req.body.data,(err, results) => {
    //    if(err) throw err;
    //    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    // });

    initializeSheet(req.body.meta.tbl,keys)
        .then(() => appendData(req.body.meta.tbl, valuesArray))
        .catch((error) => console.error(error));
});

app.listen(8080, () => {
    console.log("Server running successfully on http://localhost:8080");
    console.log("https://docs.google.com/spreadsheets/d/18yoGfF4T076LqO4kFGQStnwF1MaDSqKKvMZ36pJfnUA/edit#gid=0")
});