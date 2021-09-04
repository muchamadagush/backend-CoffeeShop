const nodemailer = require("nodemailer");
const helpers = require("../helpers/helpers");

const sendEmail = (toEmail,  token) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.COFFEESHOP_EMAIL, // generated ethereal user
        pass: process.env.COFFEESHOP_PASS, // generated ethereal password
      },
    });
    transporter
      .sendMail({
        from: `"SKS Coffee Shop Service" <${process.env.COFFEESHOP_EMAIL}>`, // sender address
        to: `${toEmail}`, // list of receivers
        subject: `Activation for ${toEmail}`, // Subject line
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Activation</title>
            <style>
                body{
                    background-color: #F7F8F3;
                    /* font-family: metropolis; */
                }
                .wrapper{
                    height: 380px;
                    width: 350px;
                    background-color: white;
                    border: 1px solid black;
                    margin-left: auto;
                    margin-right: auto;
                    border-radius: 5px;
                    margin-top: 50px;

                }
                .container{
                    padding-left: 20px;
                    padding-right: 20px;
                }
                .button{
   
                    color:white;
                    background-color: #FFBA33;
                    height: 45px;
                    width: 65%;
                    text-align: center;
<!--        margin: 35px auto;  -->
                    display: block;
                    border-radius: 8px;
                }
                a{margin:35px auto;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                    text-decoration: none;
                }
                h1{
                    margin-top: 20px;
                    color: #6A4029;
                    font-size: 28px;

                }
                h3{
                    color: #6A4029;
                    margin-top: 20px;
                    font-size: 20px;
                }
                p{
                    font-size: 14px;
                }

            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="container">

                    <h1>Welcome to SKS Coffee Shop Service</h1>
                    <h3>Greetings ${toEmail}</h3>
                    <p class="text">Your account has been successfully created! To verify your email address and complete your account creation, please click the verification button below:</p>
                    <a href="${process.env.BASE_URL}/activation/${token}<input type="button" value="VERIFY ACOOUNT" class="button">VERIFY ACOOUNT</a>
                </div>
            </div>
        </body>
        </html>`, // html body
      })
      .then(() => {
        helpers.response(res, "Success send email data", toEmail, 200);
      })
      .catch((error) => {
        // console.log(error);
        helpers.response(res, "Failed send email data", null, 404);
      });
};

const sendEmailResetPassword = (toEmail,  token) => {
  // create reusable transporter object using the default SMTP transport
 
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.REALTIME_EMAIL, // generated ethereal user
      pass: process.env.REALTIME_PASS, // generated ethereal password
    },
  });
  transporter
    .sendMail({
      from: `"SKS Coffee Shop Service" <${process.env.COFFEESHOP_EMAIL}>`, // sender address
      to: `${toEmail}`, // list of receivers
      subject: `Reset Password for ${toEmail}`, // Subject line
      html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
            <style>
                body{
                    background-color: #F7F8F3;
                    /* font-family: metropolis; */
                }
                .wrapper{
                    height: 380px;
                    width: 350px;
                    background-color: white;
                    border: 1px solid black;
                    margin-left: auto;
                    margin-right: auto;
                    border-radius: 5px;
                    margin-top: 50px;

                }
                .container{
                    padding-left: 20px;
                    padding-right: 20px;
                }
               .button{
   
                    color:white;
                    background-color: #FFBA33;
                    height: 45px;
                    width: 65%;
                    text-align: center;
<!--        margin: 35px auto;  -->
                    display: block;
                    border-radius: 8px;
                }
                a{margin:35px auto;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                    text-decoration: none;
                }
                h1{
                    margin-top: 20px;
                    color: #6A4029;
                    font-size: 28px;

                }
                h3{
                    color: #6A4029;
                    margin-top: 20px;
                    font-size: 20px;
                }
                p{
                    font-size: 14px;
                }

            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="container">

                    <h1>Welcome to SKS Coffee Shop Service</h1>
                    <h3>Greetings ${toEmail}</h3>
                    <p class="text">Your account has been forgot the password! To verify your email address and complete reset your password, please click the verification button below:</p>
                    <a href="${process.env.FRONT_URL}/reset-password/${token}<input type="button" value="RESET PASSWORD" class="button">RESET PASSWORD</a>
                </div>
            </div>
        </body>
        </html>`, // html body
    })
    .then(() => {
      helpers.response(res, "Success send email data", toEmail, 200);
    })
    .catch((error) => {
      // console.log(error);
      helpers.response(res, "Failed send email data", null, 404);
    });
};

module.exports = {
  sendEmail,
  sendEmailResetPassword,
};