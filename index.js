require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const {request, response} = require("express");
const app = express();
const db = require('./postgres');
const port = process.env.PORT || 3008;

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended:true,
    })
)

app.get('/', (request, response) => {
        response.json({info: 'Our class is live.'})
})

app.get('/persons', db.getUsers)
app.post('/persons', db.createUser)
app.put('/persons/:id', db.updateUser)
app.delete('/persons/:id', db.deleteUser)
app.get('/persons/sales', db.getUsersSale)
app.post('/persons/sales', db.createUserSale)

app.listen(port,() => {
    console.log(`App is running on port ${port}.`)
})