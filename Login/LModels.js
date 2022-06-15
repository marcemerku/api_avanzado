/* Aquí va el modelo de datos... consultas a bases de datos*/
const pool = require("../data/config")

const getAllUsers = () => {
    const query = "SELECT * FROM usuarios"
    try {
        return pool.query(query)
    } catch (error) {
        error.message = error.code
        return error
    }
}

const getUserById = (id) => {
    const query = `SELECT * FROM usuarios WHERE id = ${id} LIMIT 1`
    try {
        return pool.query(query)
    } catch (error) {
        error.message = error.code
        return error
    }
}

const registerUser = (user) => {
    const query = `INSERT INTO usuarios SET ?`
    try {
        return pool.query(query, user)
    } catch (error) {
        error.message = error.code
        return error
    }
}

const loginUser = (error) => {
    const query = `SELECT * FROM usuarios WHERE email = '${error}'`
    try {
        return pool.query(query)
    } catch (error) {
        error.message = error.code
        return error
    }
}

const editUserById = (id, user) => {
    const query = `UPDATE usuarios SET ? WHERE id = ${id}`;
    try {
        return pool.query(query, user)
    } catch (error) {
        error.message = error.code
        return error
    }

};

const deleteUserById = (id) => {
    const query = `DELETE FROM usuarios WHERE id = ${id}`
    try {
        return pool.query(query)
    } catch (error) {
        error.message = error.code
        return error
    }
}
module.exports = { getAllUsers, getUserById, registerUser, loginUser, deleteUserById, editUserById }