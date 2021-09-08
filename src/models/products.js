const connection = require("../configs/db");

const paginationProduct = (numPerPage, page, paramSearch, searchBy) => {
  let search = ``;
  if (paramSearch) {
    search = `WHERE ${searchBy} LIKE '%${paramSearch}%'`;
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

const getAllProduct = (field, sort, limit, paramSearch, searchBy) => {
  let search = ``;
  if (paramSearch) {
    search = `WHERE ${searchBy} LIKE '%${paramSearch}%'`;
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

const paginationCategory = (numPerPage, page, category_name) => {
  let search = ``;
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT count(*) as numRows FROM products WHERE categories.category = "${category_name}" `,
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

const getProductByCategory = (field, sort, limit, category_name) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM products INNER JOIN categories ON products.category_id=categories.category_id WHERE categories.category = ? ORDER BY ${field} ${sort} LIMIT ${limit}`,
      category_name,
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
  paginationCategory,
  getProductByCategory,
  insertProduct,
  updateProduct,
  deleteProduct,
};