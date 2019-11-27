'use strict';

require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const superagent=require('superagent');
const pg = require('pg');
app.use( express.json() );
app.use( express.urlencoded({extended:true}));
app.use( express.static('./public/../') );
app.set('view engine' ,'ejs')

// Database Connection Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => { throw err; });


// routes 

app.post('/selectForm', showSelectedBook);
app.get('/', showFromDb);
app.get('/search', (req,res) => {
  res.render('pages/searches/form') ;
 });
app.post('/search',searchApi)
app.post('/add',addToDb)



// functions handlers 

function showFromDb(request,response){
  
  const SQL= 'SELECT * FROM books;'
  client.query(SQL)
    .then(results => {
      console.log('results1 : ', results);
      response.render('pages/index',{data:results.rows})
    })
    .catch((error)=>errorHandler(error))
};


function showSelectedBook(request, response){
  let {title, authors, isbn, imgURL, description} = request.body;
  console.log('\n\n\n\n\n\n\n',title, authors, isbn, imgURL, description);
  response.render('pages/selectedBook', {book:request.body})
}


function searchApi(request,response){
  console.log(request.body.select)
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if(request.body.select === 'author') {url += `inauthor:${request.body.name}&maxResults=10`;}
  if(request.body.select === 'title') {url += `intitle:${request.body.name}&maxResults=10`;}
  return superagent.get(url)
    .then(data => {
      let newBook= data.body.items.map((item)=>{
       return new Book(item)
      })
      return newBook;
    })
  .then((booksData) => {
   response.render('pages/searches/show',{data:booksData})
  
  });
};

function addToDb(request,response){
  console.log('request.body : ', request.body);

  const SQL= 'INSERT INTO books (title,authors,isbn,url,description) VALUES ($1,$2,$3,$4,$5);'
  let {title,authors,isbn,url,description}=request.body;
  let values=[title,authors,isbn,url,description];
  console.log('values : ', values);

    client.query(SQL,values)
    .then(results => {
      console.log('results2 : ', results.rows);
      response.redirect('/');
    })

}

///  constructor function to make books objects from api

function Book(data){
  this.title=data.volumeInfo.title;
  this.authors=data.volumeInfo.authors &&data.volumeInfo.authors[0];
  this.isbn=data.volumeInfo.industryIdentifiers&&data.volumeInfo.industryIdentifiers[0].identifier;
  this.url=data.volumeInfo.imageLinks&&data.volumeInfo.imageLinks.thumbnail;
  this.description=data.volumeInfo.description;
}


// error functions handlers
function notFound(req,res){
  res.status(404).send('NOT FOUND!!!');
}
function errorHandler(error,req,res){
  res.status(500).send(error);
}


// Connect to DB and THEN Start the Web Server

client.connect()
  .then(() => {
    app.listen(PORT, () => console.log('Server up on', PORT)
    );
  })
  .catch(err => {
    throw `PG Startup Error: ${err.message}`;
  });





