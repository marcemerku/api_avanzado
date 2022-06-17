const { getAllOne, getAllUser, addNewPost, deleteUserById,editOne}= require("./Fmodels");
const notNumber = require("../utils/notNumber");
//buscar todos los post
const lAll = async (req, res, next) => {
    const mbResponse = await getAllUser();
    if(mbResponse instanceof Error) return next(mbResponse);
    mbResponse.length ? res.status(200).json(mbResponse): next();
};
//busca un post
const lOne = async (req, res, next)=> {
    let mbResponse= null;
    if (req.query.title) {
        mbResponse = await getPostsWith(req.query.title);
      } else {
        if (notNumber(req.params.id, res)) return;
        mbResponse = await getAllOne(+req.params.id);
    }
    if (mbResponse instanceof Error) return next(mbResponse);
    mbResponse.length ? res.status(200).json(mbResponse) : next();
};

//crea un post
const cPost = async (req, res, next) => {
    const mbResponse = await addNewPost({...req.body});
    mbResponse instanceof Error
    ? next(mbResponse)
    : res.status(201).json(mbResponse);
};

//editar un post
const ePost = async (req, res, next) => {
    const mbResponse = await editOne({...req.body},+req.params.id  );
    mbResponse instanceof Error
    ? next(mbResponse)
    : res.status(201).json(mbResponse);
};

//eliminar un post
const dPost = async (req, res, next) =>{
    if (notNumber(req.params.id, res)) return;
    const dbResponse = await deleteUserById(+req.params.id);
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.affectedRows ? res.status(204).end() : next();
};



module.exports = { lAll ,lOne ,cPost ,ePost ,dPost };
