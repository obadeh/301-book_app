'use strict';

require('dotenv').config();
const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();
const superagent=require('superagent');
app.use( express.json() );

//

app.use( express.urlencoded({extended:true}));
app.use( express.static('./public/../') );
app.set('view engine' ,'ejs')


app.get('/', (req,res) => {
res.render('pages/index') ;
 });

app.get('/show', (req,res) => {
    res.render('pages/searches/show') ;
});

app.post('/books',bookHandler)

//new search page 
app.get('/search',(request, response)=>{
  response.render('pages/searches/show');
});

app.get('/search', postSearch);

function bookHandler(req,res){
  getBook(req.query.data)
  .then((booksData) => res.status(200).json(booksData));
}


function getBook() {
  
  const url =`https://www.googleapis.com/books/v1/volumes?q=tree`

  return superagent.get(url)
    .then(data => {
      let newBook = new Book(data.body)
    
      return newBook;
    })
   
    
}



function postSearch(request, response){
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if(request.body.search[1] === 'author') {url += `inauthor:${request.body.search[0]}&maxResults=10`;}
  if(request.body.search[1] === 'title') {url += `intitle:${request.body.search[0]}&maxResults=10`;}
  superagent.get(url)

    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => {

      response.render('pages/searches/showSearchResults', {searchResults: results});

    })

    .catch(error => {
      errorHandle(error, response);
    });
}



function Book(data){
  this.title=data.items[0].volumeInfo.title;
  this.authors=data.items[0].volumeInfo.authors[0];
  this.id=data.items[0].id;
  this.url=data.items[0].volumeInfo.imageLinks.thumbnail;
  this.description=data.items[0].volumeInfo.description;
}

function notFound(req,res){
  res.status(404).send('NOT FOUND!!!');
}

function errorHandler(error,req,res){

  res.status(500).send(error);
}


app.listen( PORT, () => console.log(`Up on port ${PORT}`));