require('dotenv').config();
const {request, response} = require("express");
const Pool = require('pg').Pool;

const connectionString = process.env.HEROKU_POSTGRESQL_MAUVE_URL

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM persons ORDER BY id ASC', (error, results) =>{
        if(error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getUsersSale = (request, response) => {
    pool.query('SELECT * FROM salesforce.demo__c', (error, results) =>{
        if(error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const {first_name, last_name } = request.body
    pool.query('INSERT INTO persons (first_name, last_name) VALUES ($1,$2) RETURNING *',[first_name,last_name], (error, results) => {
        if(error) {
            throw error
        }
        response.status(201).send(`Added User: ${results.rows[0].id}`)
    })
}

const createUserSale = (request, response) => {
    const {first_name, last_name } = request.body
    pool.query('INSERT INTO salesforce.demo__c (first_name, last_name) VALUES ($1,$2) RETURNING *',[first_name,last_name], (error, results) => {
        if(error) {
            throw error
        }
        response.status(201).send(`Added User: ${results.rows[0].id}`)
    })
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { first_name, last_name } = request.body

    pool.query(
        'UPDATE persons SET first_name = $1, last_name = $2 WHERE id = $3',
        [first_name, last_name, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User modified with ID: ${id}`)
        }
    )
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query(
        'DELETE FROM persons WHERE id = $1',
        [id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User Deleted with ID: ${id}`)
        }
    )
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUsersSale,
    createUserSale
}