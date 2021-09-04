const userModels = require("../models/userAuth");
const { v4: uuidv4 } = require("uuid");
const helpers = require("../helpers/helpers");
const common = require("../helpers/common");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const { email, password, phone } = req.body;

  const user = await userModels.findUser(email);
  if (user.length > 0) {
    return helpers.response(res, "email sudah ada", null, 401);
  }
  console.log(user);
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      // Store hash in your password DB.

      const data = {
        id: uuidv4(),
        email: email,
        password: hash,
        phone: phone,
        role: "custommer",
        status: "UNACTIVED",
        createdAt: new Date(),
      };

      console.log(data.id);
      userModels
        .insertUser(data)
        .then((result) => {
          delete data.password;
          jwt.sign(
            { email: data.email, id: user.id },
            process.env.SECRET_KEY,
            { expiresIn: "2h" },
            function (err, token) {
              common.sendEmail(data.email, data.name, token);
            }
          );
          helpers.response(res, "Success register", data, 200);
        })
        .catch((error) => {
          console.log(error);
          helpers.response(res, "error register", null, 500);
        });
    });
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const result = await userModels.findUser(email);
  const user = result[0];
  const status = user.status;

  if (status == "ACTIVED") {
    bcrypt.compare(password, user.password, function (err, resCompare) {
      if (!resCompare) {
        return helpers.response(res, "password wrong", null, 401);
      }

      // generate token
      jwt.sign(
        { email: user.email, id: user.id },
        process.env.SECRET_KEY,
        { expiresIn: "24h" },
        function (err, token) {
          delete user.password;
          user.token = token;
          helpers.response(res, "success login", user, 200);
        }
      );
    });
  } else {
    return helpers.response(res, "account not actived", null, 401);
  }
};

const activation = (req, res, next) => {
  const token = req.params.token;
  if (!token) {
    const error = new Error("server need token");
    error.code = 401;
    return next(error);
  }
  jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
    if (err) {
      helpers.response(res, "Activation failed", null, 401);
    }
    const email = decoded.email;
    userModels
      .activationUser(email)
      .then(() => {
        res.redirect(`${process.env.FRONT_URL}/login`);
      })

      .catch((error) => {
        helpers.response(res, "failed change status", null, 401);
      });
  });
};

const forgotPassword = (req, res, next) => {
  const { email } = req.body;
  userModels
    .findUser(email)
    .then((result) => {
      const user = result[0];
      delete user.password;
      jwt.sign(
        { name: user.name, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: "2h" },
        function (err, token) {
          common.sendEmailResetPassword(user.email, user.name, token);
          console.log(token);
          helpers.response(res, "Success forgot password", user, 200);
        }
      );
    })
    .catch((error) => {
      helpers.response(res, "failed forgot password", null, 401);
    });
};

const resetPassword = (req, res, next) => {
  const token = req.params.token;
  const { newPassword } = req.body;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newPassword, salt, function (err, hash) {
      if (!token) {
        const error = new Error("server need token");
        error.code = 401;
        return next(error);
      }
      jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
        if (err) {
          helpers.response(res, "Access denied", null, 401);
        }
        const email = decoded.email;
        userModels
          .resetPassword(email, hash)
          .then(() => {
            helpers.response(res, "Success set new password", email, 200);
            res.redirect(`${process.env.FRONT_URL}/login/`);
          })

          .catch((error) => {
            helpers.response(res, "failed set new password", null, 401);
          });
      });
    });
  });
};

module.exports = {
  register,
  login,
  activation,
  forgotPassword,
  resetPassword,
};
