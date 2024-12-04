// Importo dalla cartella models la risorsa usata dal controller: posts.js
const posts = require("../models/post");    //risorsa dei post

/* Funzioni usate nelle rotte per posts: */

// Funzione della rotta: Index
function index(req, res) {
    const objectPosts = {
        totalCount: posts.length,
        posts,
    };
    // Visualizzo il json con la lista completa
    res.json(objectPosts);
}

// Funzione della rotta: Show
function show(req, res) {
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
}

// Funzione della rotta: Store
function store(req, res) {
    res.send("Creazione di un nuovo post");
}

// Funzione della rotta: Update
function update(req, res) {
    res.send(`Aggiornamento del post con id ${req.params.id}`);
}

// Funzione della rotta: Modify
function modify(req, res) {
    res.send(`Modifica del post con id ${req.params.id}`);
}

// Funzione della rotta: Destroy
function destroy(req, res) {
    res.send(`Cancellazione del post con id ${req.params.id}`);
}

// Esporto tutte le funzioni
module.exports = { index, show, store, update, modify, destroy }