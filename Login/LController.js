/* Aquí va la lógica que maneja el comportamiento de nuestra API cada vez que se recibe una request a través de las rutas*/
const {
    getAllUsers,
    getUserById,
    registerUser,
    loginUser,
    deleteUserById,
    editUserById,
  } = require("./LModels");
  const notNumber = require("../utils/notNumber");
  const { hashPassword, checkPassword } = require("../utils/hPassword");
  const { tokenSign, tokenVerify } = require("../utils/hJWT");
  const { matchedData } = require("express-validator")
  //const nodemailer = require("nodemailer")
  const url = process.env.public_url;
  
  //get all users
  const listAll = async (req, res, next) => {
    const dbResponse = await getAllUsers();
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.length ? res.status(200).json(dbResponse) : next();
  };
  
  /*-------------------*/
  //get user by id
  const listOne = async function (req, res, next) {
    if (notNumber(req.params.id, res)) return;
    const dbResponse = await getUserById(Number(req.params.id));
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.length ? res.status(200).json(dbResponse) : next();
  };
  //patch existing user
  const editOne = async (req, res, next) => {
    if (notNumber(req.params.id, res)) return;
    const dbResponse = await editUserById(+req.params.id, req.body);
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.affectedRows ? res.status(200).json(req.body) : next();
  };
  
  //Register new user
  const register = async (req, res, next) => {
    console.log(req.body)
    const cleanBody = matchedData(req)
    const image_url = url + req.file.filename;
    const password = await hashPassword(req.body.password);
    const level_usu=req.body.level_usu;
    const dbResponse = await registerUser({ ...cleanBody, password,level_usu,image_url });
    if (dbResponse instanceof Error) return next(dbResponse);
    const user = {
      name: cleanBody.nick,
      email: cleanBody.email,
    };
    const tokenData = {
      token: await tokenSign(user, "10m"),
      user,
    };
    res.status(201).json({ user: req.body.name, Token_Info: tokenData });
  };
  
  //Login user
  const login = async (req, res, next) => {
    const cleanBody = matchedData(req)
    const dbResponse = await loginUser(req.body.email);
    if (!dbResponse.length) return next();
    if (await checkPassword(req.body.password, dbResponse[0].password)) {
      const user = {
        
        name: dbResponse[0].nick,
        email: dbResponse[0].email,
        
      };
      const tokenData = {
        token: await tokenSign(user, "15m"),
        user,
      };
      res
        .status(200)
        .json({ message: `User ${user.name} Logged in!`, Token_info: tokenData });
    } else {
      let error = new Error();
      error.status = 401;
      error.message = "Unauthorized";
      next(error);
    }
  };
  
  /*configurar nodemailer*//*
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.mailtrap_user,
      pass: process.env.mailtrap_pass
    }
  });*/
  
  
  
  /*forgot password*/
  const forgot = async (req, res, next) => {
    const dbResponse = await loginUser(req.body.email);
    if (!dbResponse.length) return next();
    const user = {
      id: dbResponse[0].id,
      name: dbResponse[0].name,
      email: dbResponse[0].email
    }
    const token = await tokenSign(user, "15m")
    const link = `${process.env.public_url}users/reset/${token}`
  
    const mailDetails = {
      from: "tech-support@mydomain.com",
      to: user.email,
      subject: "Password recovery",
      html: `
      <h2>Password Recovery Service</h2>
      <p>To reset your password please click on the link and follow instructions</p>
      <a href="${link}">Click to recover your password</a>
      `
    }
    transport.sendMail(mailDetails, (err, data) => {
      if (err) return next(err);
      res.status(200).json({ message: `Hi ${user.name}, we've sent an email with instructions to ${user.email}. You've got 15 minutes to reset your password. Hurry up!` })
    })
  }
  
  //RESET PASSWORD (GET)
  //mostramos el formulario de recuperación de contraseña
  const reset = async (req, res, next) => {
    const token = req.params.token
    const tokenStatus = await tokenVerify(req.params.token)
    console.log(tokenStatus)
    if (tokenStatus instanceof Error) {
      res.status(403).json({ message: "Invalid or Expired Token" })
    } else {
      res.render("reset", { token, tokenStatus })
    }
  }
  
  //RESET PASSWORD (POST)
  //recibe la nueva contraseña desde el formulario de recuperación de contraseña
  const saveNewPass = async (req, res, next) => {
    const { token } = req.params
    const tokenStatus = await tokenVerify(token)
    if (tokenStatus instanceof Error) return next(tokenStatus);
    const password = await hashPassword(req.body.password_1)
    const dbResponse = await editUserById(tokenStatus.id, { password })
    dbResponse instanceof Error ? next(dbResponse) : res.status(200).json({ message: `Password changed for user ${tokenStatus.name}` })
  }
  
  //delete user by ID
  const removeOne = async (req, res, next) => {
    if (notNumber(req.params.id, res)) return;
    const dbResponse = await deleteUserById(+req.params.id);
    console.log(dbResponse);
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.affectedRows ? res.status(204).end() : next();
  };
  
  module.exports = { listAll, listOne, register, login, forgot, reset, saveNewPass, removeOne, editOne };
  