// Importo dalla cartella models la risorsa usata dal controller: posts.js
const comments = require("../models/comment");    //risorsa dei comment
// Devo importare anche la risorsa post
const posts = require("../models/post");    //risorsa dei post
/* Funzioni usate nelle rotte per comments: */

// Funzione della rotta: Index
function index(req, res) {
    const postId = parseInt(req.query.post_Id); // recupero la prima chiave della query string
    const itemName = req.query.nome; // recupero la seconda chiave della query string
    // Creo una copia dell'oggetto post da filtrare
    let objectCopy = {
        totalCount: comments.length,
        comments,
    };

    /* FILTRO "AND" CON DUE CONDIZIONI: */
    // La prima condizione verifica se è presente il nome utente inserito nella query string 
    if (itemName) {
        objectCopy = comments.filter((value) => value.nome.includes(itemName));
    }
    // La seconda condizione verifica se è presente il post-id inserito nella query string per l'objectCopy dei post, in tal caso verifico anche la seconda condizione
    let objectPosts= {};
    if (postId && (objectCopy.length > 0)) {
        objectPosts = posts.find((value) => {
            return value.id === postId;
        });
    }
    console.log(objectCopy);
    console.log(objectPosts);
    // Mi creo un nuovo oggetto filtrato che conterrà le condizioni verificatesi o meno di sopra
    let response = {};
    // Se la lunghezza di objectCopy è > 0 allora ho trovato corrispondenze
    if (objectCopy.length > 0) {
        response = {
            totalCount: objectCopy.length,
            comments: [...objectCopy],
        }
    }
    // Se invecela lunghezza di objectCopy è  0 allora non ho trovato corrispondenze è stamperò l'intera lista dei post
    else {
        response = {
            totalCount: comments.length,
            comments,
        }
    }
    // Visualizzo il json con la lista completa
    res.json(response);
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
    // Mi ricavo il parametro dinamico con l'id dentro req.param.id
    const id = parseInt(req.params.id);
    // La funzione che mi consente di eliminare un array in qualsiasi punto è splice()
    // Prima però devo trovare l'indice che corrisponde a quell'id. Per fare questo posso usare la funzione findIndex():
    const index = posts.findIndex(value => value.id === id);
    // Ora controllo se index non è -1 (se -1 significa che non ha trovato l'indice corrispondente)
    if (index !== -1) {
        console.log("Indice: " + index);

        // Prima mando su terminale il post che devo cancellare
        const postDeleted = (posts.at(index));
        console.log("Post eliminato: ", postDeleted);
        // Poi uso la funzione splice() per eliminare l'indice specifico dal menu
        posts.splice(index, 1);
        // Stampo su terminale la lista dei post aggiornata
        console.log("Lista aggiornata: ", posts);

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