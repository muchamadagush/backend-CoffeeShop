const connection = require("../configs/db");

const getAllOrder = (limit) => {
const paramlimit = ``;
    if (limit){ paramlimit = `limit ${limit}`;}
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM orders INNER JOIN users ON orders.user_id = users.id INNER JOIN orderdetails ON orders.id_order = orderdetails.id_order INNER JOIN products ON ordersdetails.id_product = products.id_order paramlimit ORDER BY createdAt_order DESC ${paramlimit} `,
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

const getOrder = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM orders INNER JOIN users ON orders.user_id = users.id INNER JOIN orderdetails ON orders.id_order = orderdetails.id_order INNER JOIN products ON ordersdetails.id_product = products.id_order WHERE orders.id_product = ?",
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

const insertOrder = (data) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO orders SET ?",
      data,
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

const insertOrderDetail = (data) => {
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO orderdetails SET ?", data, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

const updateOrder = (id, data) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE orders SET ? WHERE id = ?",
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

const deleteOrder = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM orders WHERE id = ?",
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
  getAllOrder,
  getOrder,
  insertOrder,
  insertOrderDetail,
  updateOrder,
  deleteOrder,
};
