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
              common.sendEmail(data.email, token);
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
  try {
    const { email, password } = req.body;
    const user = (await userModels.findUser(email))[0];
  const status = user.status;
    if (!user)
      return res.status(404).send({ message: 'email not registered!' });
  if (status == "ACTIVED") {
    bcrypt.compare(password, user.password, (err, resCompare) => {
      if (resCompare === false)
        return res.status(401).send({ message: `email and password don't match!` });

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2
      }

      const token = jwt.sign(payload, process.env.SECRET_KEY);
      res.cookie("token", token, {
        httpOnly: true,
        max: 7200000,
        secure: true,
        path: "/",
        sameSite: "strict",
      });
      res.cookie("user_id", user.id, {
        max: 7200000,
        path: "/",
      });
      res.cookie("user_role", user.role, {
        max: 7200000,
        path: "/",
      });
      res.cookie("user_image", user.image, {
        max: 7200000,
        path: "/",
      });
      res.cookie("user_isAuth", true, {
        max: 7200000,
        path: "/",
      });
      delete user.password

      res.json({ user });
    })
   } else { return helpers.response(res, "account not actived", null, 401); }
  } catch (error) {
    next(new Error(error.message)) 
};}

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
        { id: user.id, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: "2h" },
        function (err, token) {
          common.sendEmailResetPassword(user.email, token);
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
          return helpers.response(res, "Access denied", null, 401);
        }
        const email = decoded.email;
        userModels
          .resetPassword(email, hash)
          .then(() => {
            // res.redirect(`${process.env.FRONT_URL}/login`);
            helpers.response(res, "Success set new password", email, 200);
          })

          .catch((error) => {
            helpers.response(res, "failed set new password", null, 401);
          });
      });
    });
  });
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('token')
    res.clearCookie('user_id')
    res.clearCookie('user_role')
    res.clearCookie('user_image')
    res.clearCookie('user_isAuth')

    res.status(200);
    res.json({
      message: 'Success logout'
    });
  } catch (error) {
    console.log(error)
    next(new Error(error.message))
  }
}

module.exports = {
  register,
  login,
  activation,
  forgotPassword,
  resetPassword,
  logout
};
