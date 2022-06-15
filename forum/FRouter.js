const { lAll,lOne,cPost,ePost,dPost } = require("./Fcontroller")
const router= require("express").Router();
const isAuth = require("../middlewares/isAuth");
router.get("/",lAll); // lista de todos los post de foro
router.get("/:id",lOne); // busqueda de un post de foro
router.post("/create",isAuth,cPost); // crear post de foro
router.patch("/edit/:id",isAuth,ePost); // editar post de foro
router.delete("/edit/:id",isAuth,dPost); // borra poste de foro 


module.exports =router