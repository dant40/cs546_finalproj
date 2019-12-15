const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;

router.get('/search', async (req, res) => {
  res.render('search/search', {layout: 'nav', title: "Search for User"});
});

router.post('/search', async(req, res) => {
  let people = await users.getByDisplayname(req.body.search);
  let error = " ";
  if (people.length == 0){
    res.status(404);
    error = "No Results Found";
    res.render('search/results', {layout: 'nav',
                                  title: "Results for " + req.body.search,
                                  error: error});
  }else{
    res.render('search/results', {layout: 'nav',
                                  title: "Results for " + req.body.search,
                                  error: error,
                                  people: people});
  }

});

module.exports = router;
