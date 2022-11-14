require('dotenv').config();
const {request, response} = require("express");
const Pool = require('pg').Pool

const connectionString = process.env.DATABASE_URL

/*const pool = new Pool({
    host : "localhost",
    user : "postgres",
    port : 5432,
    password : "Janani@15",
    database : "demo"
})*/

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM persons', (error, results) =>{
        if(error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const {first_name, last_name,id} = request.body
    pool.query('INSERT INTO persons (first_name, last_name,id) VALUES ($1,$2,$3) RETURNING *',[first_name,last_name,id], (error, results) => {
        if(error) {
            throw error
        }
        response.status(201).send(`Added User: ${results.rows[0].id}`)
    })
}

const updateUser = (request,response) => {
    const data = [request.body.first_name,request.body.last_name,request.params.id];
    pool.query("UPDATE persons SET first_name = ?, last_name = ? WHERE id = ?", data,(error,result) => {
        if(error) {
            response.send('error');
        }else
            response.send(result);
        }
    )
}

const deleteUser = (request,response) => {
    let person_id = request.params.id;
    pool.query('DELETE FROM persons WHERE id = '+person_id,(error,result) => {
        if(error) {
            throw error
        }
        response.send(result);
        }
    )
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}