const express = require('express')
const router = express();
const {getWatchlists,getWatchlist,updateWatchlist,deleteMovie,deleteWatchList,createWatchlist,toggleStatus,addMovie} = require('../controllers/watchlistController')

router.get('/', getWatchlists);
router.get('/watchlist/:id', getWatchlist);
router.put('/watchlist/:listId', updateWatchlist);
router.delete('/watchlist/:listId/movie/:imdbID', deleteMovie);
router.delete('/watchlistDel/:listId', deleteWatchList);
router.post('/', createWatchlist);
router.post('/markWatched', toggleStatus);
router.post('/:listId', addMovie);


module.exports = router