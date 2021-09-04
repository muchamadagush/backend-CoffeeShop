const userModel = require("../models/users");
const helpers = require("../helpers/helpers");
const fs = require("fs");
const path = require("path");
const dirPath = path.join(__dirname, "../../uploads");
const { v4: uuidv4 } = require("uuid");

const getAllUser = (req, res, next) => {
  userModel
    .getAllUser()
    .then((result) => {
      const users = result;
      helpers.response(res, "Success get data", users, 200);
    })
    .catch((error) => {
      console.log(error);
      helpers.response(res, "Not found user", null, 404);
    });
};

const getUser = (req, res, next) => {
  const id = req.params.id;
  userModel
    .getUser(id)
    .then((result) => {
      const users = result;
      helpers.response(res, "Success get data", users, 200);
    })
    .catch((error) => {
      console.log(error);
      helpers.response(res, "Not found user", null, 404);
    });
};

const insertUser = (req, res, next) => {
  const fileName = req.file.filename;
  const urlFileName = `${process.env.BASE_URL}/files/${req.file.filename}`;
  const {
    first_name,
    last_name,
    email,
    password,
    address,
    phone,
    dateOfBirth,
    gender,
  } = req.body;
  const data = {
    id: uuidv4(),
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: password,
    address: address,
    phone: phone,
    dateOfBirth: dateOfBirth,
    gender: gender,
    image: urlFileName,
    createdAt: new Date(),
  };

  userModel
    .insertUser(data)
    .then(() => {
      helpers.response(res, "Success insert data", data, 200);
    })
    .catch((error) => {
      console.log(error);
      helpers.response(res, "Failed insert data", null, 404);
      fs.unlink(`${dirPath}/${fileName}`, (err) => {
        if (err) {
          console.log("Error unlink image user!" + err);
        }
      });
    });
};

const updateUser = (req, res) => {
  const id = req.params.id;
  let avatar = "";
  let imageUserInput = "";

  if (!req.file) {
    imageUserInput = "";
  } else {
    imageUserInput = req.file.filename;
  }

  userModel.getUser(id).then((result) => {
    const oldImageUser = result[0].image;

    const newImageUser = `${process.env.BASE_URL}/files/${imageUserInput}`;
    const {
      first_name,
      last_name,
      email,
      password,
      address,
      phone,
      dateOfBirth,
      gender,
    } = req.body;
    if (imageUserInput == "") {
      avatar = oldImageUser;
    } else {
      avatar = newImageUser;
    }
    const data = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      address: address,
      phone: phone,
      dateOfBirth: dateOfBirth,
      gender: gender,
      image: avatar,
      updatedAt: new Date(),
    };
    userModel
      .updateUser(id, data)
      .then(() => {
        helpers.response(res, "Success update user", data, 200);
        if (avatar === oldImageUser) {
          console.log("no change on image!");
        } else {
          fs.unlink(`${dirPath}/${oldImageUser.substr(28)}`, (err) => {
            if (err) {
              console.log("Error unlink image profile!" + err);
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
        helpers.response(res, "Failed update user", null, 404);
        fs.unlink(`${dirPath}/${imageUserInput}`, (err) => {
          if (err) {
            console.log("Error unlink image profile!" + err);
          }
        });
      });
  });
};

const deleteUser = (req, res) => {
  const id = req.params.id;
  userModel
    .deleteUser(id)
    .then(() => {
      helpers.response(res, "Success delete data", id, 200);
    })
    .catch((err) => {
      console.log(err);
      helpers.response(res, "Not found id user", null, 404);
    });
};

module.exports = {
  getAllUser,
  getUser,
  insertUser,
  updateUser,
  deleteUser,
};
