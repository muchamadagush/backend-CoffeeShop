const connection = require("../configs/db");

const paginationProduct = (numPerPage, page, paramSearch) => {
  let search = ``;
  if (paramSearch) {
    search = `WHERE name LIKE '%${paramSearch}%'`;
  }
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT count(*) as numRows FROM products ${search} `,
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

const getAllProduct = (field, sort, limit, paramSearch) => {
  let search = ``;
  if (paramSearch) {
    search = `WHERE name LIKE '%${paramSearch}%'`;
  } 
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM products INNER JOIN categories ON products.category_id=categories.category_id ${search} ORDER BY ${field} ${sort} LIMIT ${limit} `,
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


const getProduct = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
          "SELECT * FROM products INNER JOIN categories ON products.category_id=categories.category_id WHERE products.id_product = ?",
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


const getProductByCategory = (category_id, field, sort) => {
    return new Promise((resolve, reject) => {
        connection.query(
          `SELECT * FROM products INNER JOIN categories ON products.category_id=categories.category_id WHERE products.category_id = ? ORDER BY ${field} ${sort}`,
          category_id,
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


const insertProduct = (data) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO products SET ?", data, (error, result) => {
            if (!error) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};

const updateProduct = (id, data) => {
    return new Promise((resolve, reject) => {
        connection.query(
          "UPDATE products SET ? WHERE products.id_product = ?",
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

const deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
          "DELETE FROM products WHERE products.id_product = ?",
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
  paginationProduct,
  getAllProduct,
  getProduct,
  getProductByCategory,
  insertProduct,
  updateProduct,
  deleteProduct,
};