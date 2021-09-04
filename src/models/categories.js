const connection = require("../configs/db");

const paginationCategory = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT count(*) as numRows FROM categories",
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};

const getAllCategory = (field, sort, limit, search) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM categories INNER JOIN products ON categories.category_id=products.category_id ${search} ORDER BY categories.${field} ${sort} LIMIT ${limit}`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};

const getCategory = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM categories   WHERE category_id = ?",
      id,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};

const insertCategory = (data) => {
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO categories SET ?", data, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

const updateCategory = (id, data) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE categories SET ? WHERE category_id = ?",
      [data, id],
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};

const deleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM categories WHERE category_id = ?",
      id,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};

module.exports = {
  paginationCategory,
  getAllCategory,
  getCategory,
  insertCategory,
  updateCategory,
  deleteCategory,
};
