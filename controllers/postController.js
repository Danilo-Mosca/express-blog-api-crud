// Importo dalla cartella models la risorsa usata dal controller: posts.js
const posts = require("../models/post");    //risorsa dei post
const comments = require("../models/comment.js");    //importo anche la risorsa dei comment per poter visualizzare i commenti associati ai post

/* Funzioni usate nelle rotte per posts: */

// Funzione della rotta: Index
function index(req, res) {
    const itemTitle = req.query.titolo; // recupero la prima chiave della query string
    const itemTag = req.query.tags; // recupero la seconda chiave della query string
    // Creo una copia dell'oggetto post da filtrare
    let objectCopy = {
        totalCount: posts.length,
        posts,
    };

    /* FILTRO "AND" CON DUE CONDIZIONI: */
    // La prima condizione verifica se è presente il tag inserito nella query string 
    if (itemTag) {
        objectCopy = posts.filter((value) => value.tags.includes(itemTag));
    }
    // La seconda condizione verifica se è presente il titolo inserito nella query string per quell'objectCopy già modificato nell'if sopra (objectCopy non deve essere vuoto), in tal caso stampo verifico anche la seconda condizione
    if (itemTitle && (objectCopy.length > 0)) {
        objectCopy = posts.filter((value) => {
            return value.titolo.toLowerCase().includes(itemTitle.toLowerCase());
        });
    }
    // Mi creo un nuovo oggetto filtrato che conterrà le condizioni verificatesi o meno di sopra
    let response = {};
    // Se la lunghezza di objectCopy è > 0 allora ho trovato corrispondenze
    if (objectCopy.length > 0) {
        response = {
            totalCount: objectCopy.length,
            posts: [...objectCopy],
        }
    }
    // Se invecela lunghezza di objectCopy è  0 allora non ho trovato corrispondenze è stamperò l'intera lista dei post
    else {
        response = {
            totalCount: posts.length,
            posts,
        }
    }
    // Visualizzo il json con la lista completa
    res.json(response);
}

// Funzione della rotta: Show
function show(req, res) {

    /* TEST MIDDLEWARE middleware PER L'INTERCETTAZIONE DI POSSIBILI ERRORI
    provaFunzioneNonEsistente();    // errore not defined
    */

    // Recupero il parametro dinamico dell'id inserito, faccio il casting (perchè req.params.id restituisce sempre una stringa) e lo assegno alla costante id
    const id = parseInt(req.params.id);
    // Ricerco il post con l'id dinamico specificato e lo confronto con gli id presenti nell'oggetto posts
    const item = posts.find((value) => {
        // console.log(value.id);
        return value.id === id;
    });
    /*** IN BASE ALL'ID INSERITO VISUALIZZO I COMMENTI ASSOCIATI AL POST. SE NON CI SONO COMMENTI PER QUEL POST AVRO' itemComments = [] VUOTO ***/
    const itemComments = comments.filter((comment) => comment.post_id === id);

    // Se l'id dinamico inserito è stato trovato allora lo restituisco il json corrispondente a schermo con un ulteriore chiave "success" impostata a "true"
    if (item) {
        /*** FACCIO UNA COPIA DI ITEM PER NON MODIFICARE L'ARRAY ITEM ORIGINALE DOVE INSERIRO' TUTTI GLI item e i commenti ASSOCIATI PER QUEL item (post) RICERCATO ***/
        itemAndComment = { ...item, comments: itemComments };
        res.json({
            success: true,
            itemAndComment,     // INSERISCO L'INTERO OGGETTO itemAndComment INVECE DEL SOLO item PER POTER VISUALIZZARE I COMMENTI ASSOCIATI A QUEL POST RICERCATO TRAMITE id COME PARAMETRO DINAMICO
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
    // res.send("Creazione di un nuovo post");
    // console.log("Visualizzo il json dell'oggetto da aggiungere: ", req.body);
    console.log(req.headers["content-type"]);   // visualizzo il tipo di body-parser che mi viene passato (in questo caso sarà sempre json)

    // Cerco l'id più alto contenuto nell'array delle risorse dei post usando il metodo reduce():
    // prima destrutturo la risorsa posts da cui voglio ricavarmi solo il suo id:
    let { id } = posts.reduce((previous, next) => {
        return next.id > previous.id ? next : previous;
    });
    // Incremento l'id di 1 per ottenere l'id successivo a quello più grande contenuto nell'array dei posts:
    id++;
    // console.log("Test ultimo id: ", id);
    const newPost = {
        id,
        titolo: req.body.titolo,
        contenuto: req.body.contenuto,
        immagine: req.body.immagine,
        tags: req.body.tags,
    }
    // Pusho il post sull'array della risorsa
    posts.push(newPost);
    // Setto lo stato a 201 ed invio il nuovo post creato
    res.status(201).json(newPost);
    // Stampo sul terminale i dati aggiunti
    console.log(newPost);

    /* ALTERNATIVA MA CON IL CLASSICO CICLO FOR:
    let newId = 0;      // Variabile accumulatrice a cui assegnerò l'id più alto contenuto nell'array delle risorse dei posts

    // Cerco l'id più alto contenuto nell'array dei posts e lo assegno alla variabile accumulatrice newId
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id > newId) {
            newId = posts[i].id;
        }
    }
    // Infine incremento newId di 1 per ottenere l'id successivo a quello più grande contenuto nell'array dei posts
    newId++;
    const newPost = {
        id: newId,          // assegno l'id successivo
        titolo: req.body.titolo,
        contenuto: req.body.contenuto,
        immagine: req.body.immagine,
        tags: req.body.tags,
    };
    FINE ALTERNATIVA CON IL CICLO FOR */
}

// Funzione della rotta: Update
function update(req, res) {
    const id = parseInt(req.params.id);
    const item = posts.find((value) => value.id === id);
    if (!item) {
        res.status(404).json({
            success: false,
            message: "Il post non esiste",
        });
        return;     // esco dalla funzione altrimenti questa continuerebbe la sua esecuzione in background
    }

    console.log(req.body);
    // Se tutto è andato bene modifico il post:
    item.titolo = req.body.titolo;
    item.contenuto = req.body.contenuto;
    item.immagine = req.body.immagine;
    item.tags = req.body.tags;

    /* Potrei usare anche un ciclo for..in per modificare l'oggetto e assegnargli i nuovi valori. Esempio:
    for (key in item) {
        // non devo ciclare sull'id, non va toccato
        if (key !== 'id') {
            item[key] = req.body[key];
        }
    } */

    // Aggiungo il post modificato per aggiornarlo
    res.json(item);
    // Controllo da terminale se le modifiche sono state eseguite
    console.log(posts);
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
    // Altrimenti setto lo stato 404 e rispondo con un errore
    else {
        res.status(404).json({
            error: '404',
            message: 'Post non trovato',
        })
    }
}

// Esporto tutte le funzioni
module.exports = { index, show, store, update, modify, destroy }