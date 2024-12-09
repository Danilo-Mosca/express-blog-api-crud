// Creo l'array di oggetti con la lista dei commenti ai post
const comments = [
    {
        id: 1,
        "post-id": 1,
        name: 'Mario Rossi',
        comment: 'Questo è un commento di esempio'
    },
    {
        id: 2,
        "post-id": 1,
        name: 'Luigi Bianchi',
        comment: 'Mi piace questo post!'
    },
    {
        id: 3,
        "post-id": 2,
        name: 'Giulia Verdi',
        comment: 'Non sono d\'accordo con questo post'
    },
    {
        id: 4,
        "post-id": 3,
        name: 'Marco Nero',
        comment: 'Questo è un commento molto lungo e noioso...'
    },
    {
        id: 5,
        "post-id": 4,
        name: 'Sofia Gialli',
        comment: 'Mi piace questo commento!'
    }
];
module.exports = comments