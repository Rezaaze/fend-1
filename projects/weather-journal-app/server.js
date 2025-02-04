// Setup empty JS object to act as endpoint for all routes
const projectData = {"entrys":[]};
// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require('body-parser');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors')
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));


// Setup Server

const port = 8000;

const server = app.listen(port,listening);

function listening (){
    console.log("server is running")
    console.log(`your server is running on port : ${port}`)
}

app.get("/get", sendData);

function sendData(req,res){
    res.send(projectData)
    console.log("Datasend")
}

app.post("/post", recieveData);

function recieveData(req, res){
    
    
    projectData.entrys.push(req.body)
    if(projectData.entrys.length > 10){
        projectData.entrys.shift();
    } 
    console.log(projectData)
}