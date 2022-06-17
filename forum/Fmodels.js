const pool = require("../data/config")



const getAllUser= ()=>{
    const query = "SELECT * FROM post_com"
    try {
        return pool.query(query)
    } catch (error) {
        error.message = error.code
        return error
    }
}

const getAllOne= (id) =>{
    const query = `SELECT * FROM post_com WHERE id = ${id} LIMIT 1`
    try {
        return pool.query(query)
    } catch (error) {
        error.message = error.code
        return error
    }
}
const getPostsWith = (string) => {
    const query = `SELECT * FROM post_com WHERE title LIKE '%${string}%'`;
    try {
      return pool.query(query);
    } catch (error) {
      error.message = error.code;
      return error;
    }
  };

const addNewPost=(post)=>{
    const query = "INSERT INTO post_com SET ?";
    try {
      return pool.query(query, post);
    } catch (error) {
      error.message = error.code;
      return error;
    }
}

const editOne = async (post, id) => {
    const query = `UPDATE post_com SET ? WHERE id = ${id}`;
    try {
        return pool.query(query, post)
    } catch (error) {
        error.message = error.code
        return error
    }
  };

const deleteUserById = (id)=>{
    const query = `DELETE FROM post_com WHERE id = ${id}`
    try {
        return pool.query(query)
    } catch (error) {
        error.message = error.code
        return error
    }
}

module.exports= { getAllOne, getAllUser, addNewPost, deleteUserById, editOne }