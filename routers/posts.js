/* Raggruppo tutte le rotte relative a /posts in questo file e mi genero l'oggetto router */

// Prima importo express js
const express = require('express');
// Poi mi creo l'oggetto router istanziando una variabile ad express.Router()
const router = express.Router();

// Importo qui i post perchè è qui che ho le rotte e che andrò a visualizzarli, aggiornarli, modificarli, cancellarli ecc non nel file ServiceWorkerRegistration.js
const posts = require('../models/post.js');

/* Mi creo tutte le rotte per le operazioni CRUD (Index, Show, Create, Update e Delete) necessarie per le risorse: */

// Nome rotta: Index
router.get("/", (req, res)=> {
    const objectPosts = {
        totalCount: posts.length,
        posts,
    };
    // console.log("objectPosts: ", objectPosts.posts[1].titolo);
    // Visualizzo il json con la lista completa
    res.json(objectPosts);
});

// Nome rotta: Show
router.get("/:id", (req, res)=> {
    // Recupero il parametro dinamico dell'id inserito, faccio il casting (perchè req.params.id restituisce sempre una stringa) e lo assegno alla costante id
    const id = parseInt(req.params.id);
    // Ricerco il post con l'id dinamico specificato e lo confronto con gli id presenti nell'oggetto posts
    const item = posts.find((value) => {
        // console.log(value.id);
        return value.id === id;
    });
    // Se l'id dinamico inserito è stato trovato allora lo restituisco il json corrispondente a schermo con un ulteriore chiave "success" impostata a "true"
    if (item) { 
        res.json({
            success: true,
            item,
        });
    }
    // Altrimenti restituisco un json con uno stato 404 e un messaggio indicante che il post non è stato trovato
    else {
        res.status(404).json({
            success: false,
            message: "Post non trovato",
        });
    }
});

// Nome rotta: Store
router.post("/", (req, res)=> {
    res.send("Creazione di un nuovo post");
});

// Nome rotta: Update
router.put("/:id", (req, res)=> {
    res.send(`Aggiornamento del post con id ${req.params.id}`);
});

// Nome rotta: Modify
router.patch("/:id", (req, res)=> {
    res.send(`Modifica del post con id ${req.params.id}`);
});

// Nome rotta: Destroy
router.delete("/:id", (req, res)=> {
    res.send(`Cancellazione del post con id ${req.params.id}`);
});

// Esporto l'istanza di router
module.exports = router;