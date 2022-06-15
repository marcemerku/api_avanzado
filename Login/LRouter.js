/*En este archivo pondremos la referencia a la ruta asociada y, si las hubiera, subrutas (por ejemplo, podríamos recibir todas las peticiones de /users, pero también de /users/otracosa... etc). Luego de recibir la petición diferenciando el verbo HTTP, enviaríamos al controlador apropiado. Si hubiera middlewares, se aplicarían en este archivo, entre la petición y el controlador*/
const { listAll, listOne, register, login, forgot, reset, saveNewPass, removeOne, editOne } = require("./LController")
const router = require("express").Router()
const { validatorCreateUser, validatorResetPassword, validatorLoginUser } = require("../validator/users");
const fileUpload = require("../utils/storage");


//get all users
router.get("/", listAll);

//get user by id
router.get("/:id", listOne);

//Register new user
router.post("/register", fileUpload.single("file"), validatorCreateUser, register)

//Login user
router.post("/", validatorLoginUser, login)

//Forgot password
router.post("/forgot-password", forgot) //desde el front entra el mail del usuario quen olvidó password
//Create and send magic link
router.get("/reset/:token", reset) //mostramos el formulario de recuperación de contraseña
router.post("/reset/:token", validatorResetPassword, saveNewPass)//recibimos la nueva contraseña desde el formulario
//patch user
router.patch("/:id", editOne)


//delete user by ID
router.delete("/:id", removeOne)


module.exports = router