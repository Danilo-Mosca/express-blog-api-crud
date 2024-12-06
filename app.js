// Importo express js
const express = require('express');
// Creo un'istanza del server
const app = express();
// Assegno la porta 3000 al server
const PORT = process.env.PORT || 3000;   // La porta la richiamo dal mio file nascosto ".env" e importo la costante PORT con: process.env.PORT. Oppure se non trovo il file ".env" assegno automaticamente la porta 3000

// Importo il router creato sul routers/posts.js
const postsRouter = require('./routers/posts');
// Importo il router creato sul routers/comments.js
const commentsRouter = require('./routers/comments');
// Importo il middleware per la gestione delle rotte non trovate
const notFound = require('./middlewares/notFound');
// Importo il middleware per l'intercettazione di possibili errori
const errorHandler = require('./middlewares/errorsHandler');

/* -------------- SEZIONE MIDDLEWARE: -------------- */
/* Funzione body-parser che decodifica il request body */
// Indico che il body di qualunque richiesta deve essere parsato come json
// Come se gli dicessi: per favore usa questo body-parser di tipo json
app.use(express.json());
// Definisco la cartella pubblica "public" in cui sono contenuti tutti gli assett statici
app.use(express.static('public'));
/* MIDDLEWARE di postsRouter*/
// Dopo l'app get della root "/" (perchè le rotte vengono controllate a CASCATA e altrimenti Express non vedrebbe la rotta principale /) indico ad Express Js che esistono rotte con il prefisso "/posts" e le chiamo con il metodo use() così da specificare che il prefisso, l'endpoint di queste rotte deve essere "/posts/" (va inserito sempre al plurale)
app.use('/posts', postsRouter);
/* MIDDLEWARE di commentsRouter (come sopra) */
app.use('/comments', commentsRouter);
/* -------------- FINE SEZIONE DEI MIDDLEWARE: -------------- */

/* ROTTE API: */

// Creo la rotta base "/" che ritorna un testo semplice con scritto ”Server del mio blog”
app.get("/", (req, res) => {
    res.send("<h1>Server del mio blog</h1>");
});

// Rotta di fallback: se la pagina non è stata trovata restituisco un messaggio 404 personalizzato. E' l'ultima rotta da controllare a cascata
/* app.all('*', (req, res) => {
    // Se lo stato della richiesta non è stato trovato (risponde con un error 404) allora rispondi con il seguente messaggio
    res.status(404).send("<h1>404 - Pagina non trovata</h1>");
}); */

// Richiamo la risorsa di middleware per l'intercettazione di possibili errori
app.use(errorHandler);
// Richiamo la risorsa di middleware per la gestione delle rotte non trovate
app.use(notFound);
// Metto il server in ascolto su localhost e sulla porta 3000 e richiamo la porta 3000
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});