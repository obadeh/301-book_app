'use strict';

require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const superagent=require('superagent');

app.use( express.json() );
app.use( express.urlencoded({extended:true}));
app.use( express.static('./public/../') );
app.set('view engine' ,'ejs')

// routes 
app.get('/', (req,res) => {
res.render('pages/index') ;
 });

 app.get('/show', (req,res) => {
  // let people=['obada','fooo']
  
     res.render('pages/searches/show') ;
 });

 app.get('/search',(request, response)=>{
  // console.log('re : ', request.query);
  
  response.render('pages/searches/show');
});

app.post('/search',(request,response)=>{
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
  
})

function Book(data){
  this.title=data.volumeInfo.title;
  this.authors=data.volumeInfo.authors &&data.volumeInfo.authors[0];
  this.isbn=data.volumeInfo.industryIdentifiers&&data.volumeInfo.industryIdentifiers[0].identifier;
  this.url=data.volumeInfo.imageLinks&&data.volumeInfo.imageLinks.thumbnail;
  this.description=data.volumeInfo.description;
}

function notFound(req,res){
  res.status(404).send('NOT FOUND!!!');
}
function errorHandler(error,req,res){
  res.status(500).send(error);
}


app.listen( PORT, () => console.log(`Up on port ${PORT}`));




