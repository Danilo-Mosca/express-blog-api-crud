/* Raggruppo tutte le rotte relative a /posts in questo file e mi genero l'oggetto router */
// Prima importo express js
const express = require('express');
// Poi mi creo l'oggetto router istanziando una variabile ad express.Router()
const router = express.Router();


// RICHIAMO IL CONTROLLER:
const controller = require('../controllers/postsController');
// AVREI POTUTO ANCHE DESTRUTTURARLO CON:
/*
const { index,show,store,update,modify,destroy} = require("../controllers/postsController");
*/


/* Mi creo tutte le rotte per le operazioni CRUD (Index, Show, Create, Update e Delete) necessarie per le risorse: */

// Nome rotta: Index
router.get("/", controller.index);

// Nome rotta: Show
router.get("/:id", controller.show);

// Nome rotta: Store
router.post("/", controller.store);

// Nome rotta: Update
router.put("/:id", controller.update);

// Nome rotta: Modify
router.patch("/:id", controller.modify);

// Nome rotta: Destroy
router.delete("/:id", controller.destroy);

// Esporto l'istanza di router
module.exports = router;