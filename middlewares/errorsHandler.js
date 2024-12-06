/* Middleware per l'intercettazione di possibili errori */
function errorHandler(err, req, res, next) {
    res.status(500);    // setto il valore dello status a 500
    res.json( {
        error: err.message,
    });
}

//esporto il middleware
module.exports = errorHandler
