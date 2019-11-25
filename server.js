'use strict';

require('dotenv').config();
const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();

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





app.listen( PORT, () => console.log(`Up on port ${PORT}`));