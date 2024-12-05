/* Raggruppo tutte le rotte relative a /comments in questo file e mi genero l'oggetto router */
// Prima importo express js
const express = require('express');
// Poi mi creo l'oggetto router istanziando una variabile ad express.Router()
const router = express.Router();


// RICHIAMO IL CONTROLLER STAVOLTA A DIFFERENZA DELLA RISORSA posts.js uso la destrutturazione:
const { index,show,store,update,modify,destroy} = require("../controllers/commentController");

/* COSI' DA PASSARE ALLE ROTTE SOLO IL NOME DELLA FUNZIONE SENZA IL controller.nomeFunzione MA SOLO router.get("/", index); */

/* Mi creo tutte le rotte per le operazioni CRUD (Index, Show, Create, Update e Delete) necessarie per le risorse: */

// Nome rotta: Index
router.get("/", index);

// Nome rotta: Show
router.get("/:id", show);

// Nome rotta: Store
router.post("/", store);

// Nome rotta: Update
router.put("/:id", update);

// Nome rotta: Modify
router.patch("/:id", modify);

// Nome rotta: Destroy
router.delete("/:id", destroy);

// Esporto l'istanza di router
module.exports = router;