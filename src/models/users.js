const connection = require('../configs/db')

const getAllUser = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM users`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  })
}

const getUser = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM users  WHERE id = ?',
      id,
      (error, result) => {
        if (!error) {
          resolve(result)
        } else {
          reject(error)
        }
      }
    )
  })
}

const insertUser = (data) => {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO users SET ?', data, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

const updateUser = (id, data) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'UPDATE users SET ? WHERE id = ?', [data, id],
      (error, result) => {
        if (!error) {
          resolve(result)
        } else {
          reject(error)
        }
      }
    )
  })
}

const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM users WHERE id = ?', id, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

module.exports = {
  getAllUser,
  getUser,
  insertUser,
  updateUser,
  deleteUser
}
