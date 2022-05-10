const express = require('express');
const app = express(),
      bodyParser = require("body-parser");
      port = 3070;

const cors = require('cors');

const fs = require('fs')
const path = require('path')
const multer  = require('multer')
const upload = require('./libs/storage');


app.use(cors({
  origin: '*'
}));


// app.use(bodyParser.json());
// app.use(express.static(process.cwd() + '/my-app/dist'));

const API_KEY = "keyU8cfqozWZJCz8p";
const BASE_NAME = "appS801YP8fm8r5u9";
const TABLE_NAME = "Table 1"

const Airtable = require('airtable')

Airtable.configure({apiKey: API_KEY});

const base = Airtable.base(BASE_NAME);

const table = base(TABLE_NAME);


let contador = 0;

function prub() {
  console.log("ejecuto funcion")
}

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
  
  table.select({
    //view: "Grid view",
    filterByFormula: "{Status} = 1"
  }).eachPage(function page(records) {
    records.forEach(function(record) {
      console.dir(record.fields);
    })
  });
  setInterval(function () {
    contador = contador + 1;
    console.log(`Server is running ${contador}`);
    console.log(API_KEY)
    prub();
  }.bind(this), 5000);
});