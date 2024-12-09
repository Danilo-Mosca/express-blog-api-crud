// Importo dalla cartella models la risorsa usata dal controller: posts.js
const comments = require("../models/comment.js");    //risorsa dei comment

/* Funzioni usate nelle rotte per comments: */

// Funzione della rotta: Index
function index(req, res) {
    const itemName = req.query.name; // recupero la chiave della query string
    // Creo una copia dell'oggetto post da filtrare
    let objectCopy = {
        totalCount: comments.length,
        comments,
    };
    // Verifica se è presente il name utente inserito nella query string 
    if (itemName) {
        // Filtro la risorsa comments e assegno ad objectCopy la lista dei commenti con il name utente specificato nella query string. Altrimenti non manipolo objectCopy e stampo tutta la lista di commenti
        objectCopy = comments.filter((value) => value.name.includes(itemName));
    }
    // Visualizzo il json con la lista completa
    res.json(objectCopy);
}

// Funzione della rotta: Show
function show(req, res) {
    // Recupero il parametro dinamico dell'id inserito, faccio il casting (perchè req.params.id restituisce sempre una stringa) e lo assegno alla costante id
    const id = parseInt(req.params.id);
    // Ricerco il post con l'id dinamico specificato e lo confronto con gli id presenti nell'oggetto posts
    const item = comments.find((value) => {
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
            message: "Commento non trovato",
        });
    }
}

// Funzione della rotta: Store
function store(req, res) {
    // res.send("Creazione di un nuovo post");
    // console.log("Visualizzo il json dell'oggetto da aggiungere: ", req.body);
    console.log(req.headers["content-type"]);   // visualizzo il tipo di body-parser che mi viene passato (in questo caso sarà sempre json)

    let newId = 0;      // Variabile accumulatrice a cui assegnerò l'id più alto contenuto nell'array delle risorse dei comment

    // Cerco l'id più alto contenuto nell'array dei comment e lo assegno alla variabile accumulatrice newId
    for (let i = 0; i < comments.length; i++) {
        if (comments[i].id > newId) {
            newId = comments[i].id;
        }
    }
    // Infine incremento newId di 1 per ottenere l'id successivo a quello più grande contenuto nell'array dei comment
    newId++;
    const newComment = {
        id: newId,          // assegno l'id successivo
        "post-id": parseInt(req.body["post-id"]),
        name: req.body.name,
        comment: req.body.comment,
    };
    // Pusho il post sull'array della risorsa
    comments.push(newComment);
    // Setto lo stato a 201 ed invio il nuovo post creato
    res.status(201).json(newComment);
    // Stampo sul terminale i dati aggiunti
    console.log(newComment);
}

// Funzione della rotta: Update
function update(req, res) {
    const id = parseInt(req.params.id);
    const item = comments.find((value) => value.id === id);
    if (!item) {
        res.status(404).json({
            success: false,
            message: "Il commento non esiste",
        });
        return;     // esco dalla funzione altrimenti questa continuerebbe la sua esecuzione in background
    }

    console.log(req.body);

    /* Se tutto è andato bene modifico il commento: uso un ciclo for..in per modificare l'oggetto e assegnargli i nuovi valori */
    for (key in item) {
        // non devo ciclare sull'id, non va toccato. E nemmeno il post_id poichè il commento riguarda un post specifico
        if ((key !== 'id') && (key !== 'post-id')) {
            item[key] = req.body[key];
        }
    }

    // Aggiungo il commento modificato per aggiornarlo
    res.json(item);
    // Controllo da terminale se le modifiche sono state eseguite
    console.log(comments);
}

// Funzione della rotta: Modify
function modify(req, res) {
    res.send(`Modifica del post con id ${req.params.id}`);
}

// Funzione della rotta: Destroy
function destroy(req, res) {
    // Mi ricavo il parametro dinamico con l'id dentro req.param.id
    const id = parseInt(req.params.id);
    // La funzione che mi consente di eliminare un array in qualsiasi punto è splice()
    // Prima però devo trovare l'indice che corrisponde a quell'id. Per fare questo posso usare la funzione findIndex():
    const index = comments.findIndex(value => value.id === id);
    // Ora controllo se index non è -1 (se -1 significa che non ha trovato l'indice corrispondente)
    if (index !== -1) {
        console.log("Indice: " + index);

        // Prima mando su terminale il post che devo cancellare
        const postDeleted = (comments.at(index));
        console.log("Commento eliminato: ", postDeleted);
        // Poi uso la funzione splice() per eliminare l'indice specifico dal menu
        comments.splice(index, 1);
        // Stampo su terminale la lista dei commenti aggiornata
        console.log("Lista dei commenti aggiornata: ", comments);

        // Inoltre invio lo stato 204 ovvero: è tutto ok, è stato cancellato tutto con successo ma non c'è un contenuto, non c'è un json che devo visualizzarti
        res.sendStatus(204);
    }
    // Altrimenti rispondo con un errore
    else {
        res.status(404).json({
            error: '404',
            message: 'Post non trovato',
        })
    }
}

// Esporto tutte le funzioni
module.exports = { index, show, store, update, modify, destroy }