/* Middleware per la gestione delle rotte non registrate */
function notFound(req,res, next) {
    res.status(404).json( {
        error: "Not Found",
        message: "Rotta non trovata",
    });
}

//esporto il middleware
module.exports = notFound;