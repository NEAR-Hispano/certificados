const express = require('express');
const app = express(),
      bodyParser = require("body-parser");
      port = 3074;


const fs = require('fs')
const path = require('path')
const multer  = require('multer')
require('dotenv').config()
//const upload = require('./libs/storage');



//inicio configuracion AirTable //
const API_KEY = process.env.API_KEY;
const BASE_NAME = process.env.BASE_NAME;
const TABLE_NAME = process.env.TABLE_NAME;
const Airtable = require('airtable')
Airtable.configure({apiKey: API_KEY});
const base = Airtable.base(BASE_NAME);
const table = base(TABLE_NAME);
//fin configuracion AirTable //


// inicio configuracion smart contract near //
const { CONFIG } = require('./network/api')
const nearAPI = require("near-api-js");
const { Contract, keyStores, KeyPair , Near, Account } = nearAPI;

const keyStore = new keyStores.InMemoryKeyStore();
//Connect to network
const config = CONFIG(keyStore, process.env.NETWORK);
const CONTRACT_NAME = process.env.CONTRACT_NAME;
const SIGNER_ID = process.env.SIGNER_ID;
const SIGNER_PRIVATEKEY = process.env.SIGNER_PRIVATEKEY;
const NETWORK = process.env.NETWORK;
const keyPair = KeyPair.fromString(SIGNER_PRIVATEKEY);

keyStore.setKey(NETWORK, SIGNER_ID, keyPair);
const near = new Near(config);
const account = new Account(near.connection, SIGNER_ID);
const responseview = null;
const responsecall = null;

//Contract call buy or sell
const contract = new Contract(account, CONTRACT_NAME, {
    viewMethods: ["get_certificate_list"],
    changeMethods: ["set_certificate_list"],
    sender: account
})
// fin configuracion smart contract near //


// libreria para la creacion de imagenes //
const nodeHtmlToImage = require('node-html-to-image')

// inicio configuracion Web3 Storage //
File = require('web3.storage').File
Web3Storage = require('web3.storage').Web3Storage
const token = process.env.TOKEN_WEB3;
// fin configuracion Web3 Storage //

// inicio configuracion envio correo //
var nodemailer = require('nodemailer'); 
const hbs = require('nodemailer-express-handlebars')
// fin configuracion envio correo //



// funcion para creacion de la imagen del sertificado y subida al servicio ipfs web3 storage //
async function crearImagen(nombre, bootcamp) {
  const imagefirma = fs.readFileSync('./firma.png');
  const base64Imagefirma = new Buffer.from(imagefirma).toString('base64');
  const dataURIfirma = 'data:image/png;base64,' + base64Imagefirma
  const imageNear = fs.readFileSync('./near.png');
  const base64ImageNear = new Buffer.from(imageNear).toString('base64');
  const dataURINear = 'data:image/png;base64,' + base64ImageNear

  // NEAR Certified Developer | May 30, 2022 @ Jun 03, 2022

  let certificado = bootcamp.split("|")[0].trim();
  let desde = bootcamp.split("|")[1].split("@")[0].trim();
  let hasta = bootcamp.split("|")[1].split("@")[1].trim();


  const image = await nodeHtmlToImage({
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Near Certified - Certification</title>
    </head>

    <body>
        <section>
            <div>
                <img class="logo" src="{{imageNear}}" alt="Near Protocol">
            </div>

            <div>
                <h2>Certificado de Finalización</h2>
                <span>La Cofradía de NEAR Hispano Certifica a:</span>
                <h3>{{ nombreParticipante }}</h3>
                <p>
                    Por haber Cumplido satisfactoriamente en el periodo de {{ desde }}
                    al {{ hasta }} con los requerimientos del programa 
                    <strong>{{ certificado }}</strong>
                </p>
                <img class="firma" src="{{imageSource}}" alt="Firma">
            </div>
        </section>
    </body>
    </html>

    <style>
    * {
        box-sizing: border-box;
    }
    :is(html, body) {
        margin: 0;
        padding: 0;
        background-color: #f2f2f2;
        font-family: sans-serif;
    }
    body {
        display: flex;
        align-items: center;
        justify-content: center;
        height: max(100vh, 640px);
        position: relative;
    }
    body:after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #000000;
        clip-path: polygon(60% 0, 85% 0, 97% 100%, 65% 100%, 0 65%, 0 35%);
        /* transform: scale(1.5); */
    }


    /* card */
    section {
        --padding: 5%;
        background-color: #FFFFFF;
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        /* max-width: calc(50em + var(--padding)); */
        max-width: min(90%, calc(90ch + var(--padding)));
        padding-inline: var(--padding);
        padding-block: 2em 2.5em;
        box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
    }
    div:first-child {
        display: flex;
        justify-content: flex-end;
        position: relative;
        padding-bottom: 1em;
    }
    div:first-child::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin-inline: auto;
        width: 100%;
        height: 2px;
        background-color: #e9e9e9;
        border-radius: 30px;
    }
    div+div {
        --margin: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin-inline: auto;
    }
    .logo {
        width: 9.375em;
        aspect-ratio: 2 / 1;
    }
    h2 {
        font-size: 2.2em;
        font-weight: bold;
        margin-bottom: var(--margin);
    }
    :is(span, p) {
        font-size: 1.2em;
        color: #9999a6;
    }
    span {
        margin-bottom: var(--margin);
    }
    p {
        margin-bottom: 0;
    }
    h3 {
        font-size: 2em;
        font-weight: normal;
        color: #6f6f7f;
        margin-block: 0 var(--margin);
    }
    strong {
        color: #57576b;
    }
    .firma {
        width: 18.75em;
        aspect-ratio: 2 / 1;
    }
    @media (max-width: 700px) {
        .logo {
            width: clamp(7em, 9vw, 9.375em);
        }
        h2 {
            font-size: clamp(1.8em, 2.2vw, 2.2em);
        }
        :is(span, p) {
            font-size: clamp(.8em, 1.2vw, 1.2em);
        }
        h3 {
            font-size: clamp(1.6em, 2vw, 2em);
        }
        .firma {
            width: clamp(12em, 18vw, 18.75em);
        }
    }
    </style>

    `, 
    content: { imageSource: dataURIfirma, imageNear: dataURINear, nombreParticipante: nombre, desde: desde, hasta: hasta, certificado: certificado },
  });
  const client = new Web3Storage({ token })
  const files = [
    new File([image], nombre+" - "+bootcamp+".png")
  ]
  try {
    const cid = await client.put(files)
    return cid
  } catch (error) {
    return false
  }
}


// funcion para el envio del correo electronico //
async function EnvioCorreo(to, certificacion, nombre, certificado) {
  if (to != undefined) {
    var transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    let from = process.env.EMAIL_USER;
   
    // point to the template folder
    const handlebarOptions = {
      viewEngine: {
          partialsDir: path.resolve("./views_email/"),
          defaultLayout: false,
      },
      viewPath: path.resolve("./views_email/"),
    };
    
    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions))
    var mailOptions;

      mailOptions = {
        from: from,
        to: to,
        subject: certificacion,
        template: 'confirmacionCertificado', // the name of the template file i.e email.handlebars
        context: {
          nombre: nombre,
          certificacion: certificacion,
          certificado: certificado,
          p2: 'Hello you are receiving this mail because your order number',
          p3: 'has been marked as completed, please release.',
        }
      }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
  } 
}



// funcion para consultar airtable obtener datos, validarlos y luego insertarlos en el contrato
function servicio() {
  console.log("////////////////////////////////////////////////////////");
  console.log("ejecuto funcion")
  console.log("////////////////////////////////////////////////////////");
  // se consulta la lista de certificados en el AirTable//
  table.select({
    //view: "Grid view",
    filterByFormula: "{certificado} = 1"
  }).eachPage(async function page(records) {
    // se recorre la lista devuelta por el api de AirTable //
    let cont = 0;
    let longitudLista = records.length;
    records.forEach(async function(record) {
      console.log(record.fields);
      console.log("correo: ", record.fields['Correo']);
      // se consulta la lista de certificados en el smart contract por cada user id //
      this.responseview = await contract.get_certificate_list( {
        account_id: record.fields['NEAR mainnet'],
      }).then((res) => {
        // cada resultado por usuario se compara para evitar cargarle mas de una vez el mismo certificado //
        let verificacion = res.find(element => element.certificacion == record.fields['certificacion (from bootcamp)']);
        if (verificacion == undefined) {
          crearImagen(record.fields['Nombre'], record.fields['bootcamp']).then(async (image) => {
            // se cargan todos los datos en el smart contract para que luego pueda ser minteado por el usuario dueño del certificado //
            if(image != false) {
              console.log("//////---------------///////////");
              console.log(record.fields['NEAR mainnet'].trim());
              console.log(record.fields['Nombre'].trim());
              console.log(record.fields['certificacion (from bootcamp)'].trim());
              console.log(record.fields['bootcamp'].trim());
              console.log("https://"+image.trim()+".ipfs.dweb.link/"+record.fields['Nombre'].trim()+" - "+record.fields['bootcamp'].trim()+".png");
              console.log("//////---------------///////////");
              this.responsecall = await contract.set_certificate_list({ 
                callbackUrl: '',
                meta: '',
                args: {
                  account_id: record.fields['NEAR mainnet'].trim(),
                  nombre: record.fields['Nombre'].trim(),
                  certificacion: record.fields['certificacion (from bootcamp)'].trim(),
                  bootcamp: record.fields['bootcamp'].trim(),
                  img: "https://"+image.trim()+".ipfs.dweb.link/"+record.fields['Nombre'].trim()+" - "+record.fields['bootcamp'].trim()+".png",
                  reference: image
                },
                gas: '300000000000000'
              }).then(async (res) => {
                if(res) {
                  if (record.fields['Correo'] != undefined) {
                    this.sendmail = await EnvioCorreo(record.fields['Correo'].trim(), record.fields['certificacion (from bootcamp)'].trim(), record.fields['Nombre'].trim(), 
                    "https://"+image.trim()+".ipfs.dweb.link/"+record.fields['Nombre'].trim()+" - "+record.fields['bootcamp'].trim()+".png")
                  }
                  console.log("------------------------------------------");
                  console.log("se cargo el certificado en el contrato");
                  console.log("aqui esta la imagen");
                  console.log(image);
                  console.log("------------------------------------------");
                }
              })
              .catch((err) => {
                console.log("error al caragar datos en el contrato" + err);
              });
            }
          }).catch((err) => {
            console.log("error al crear imagen " + err);
          });
        }
      })
      .catch((err) => {
        // en caso de error es por que el usuario no tiene certificados, se procede a agregar el usuario //
        crearImagen(record.fields['Nombre'], record.fields['bootcamp']).then(async (image) => {
          // se cargan todos los datos en el smart contract para que luego pueda ser minteado por el usuario dueño del certificado //
          if(image != false) {
            console.log("//////---------------///////////");
            console.log(record.fields['NEAR mainnet'].trim());
            console.log(record.fields['Nombre'].trim());
            console.log(record.fields['certificacion (from bootcamp)'].trim());
            console.log(record.fields['bootcamp'].trim());
            console.log("https://"+image.trim()+".ipfs.dweb.link/"+record.fields['Nombre'].trim()+" - "+record.fields['bootcamp'].trim()+".png");
            console.log("//////---------------///////////");
            this.responsecall = await contract.set_certificate_list({ 
              callbackUrl: '',
              meta: '',
              args: {
                account_id: record.fields['NEAR mainnet'].trim(),
                nombre: record.fields['Nombre'].trim(),
                certificacion: record.fields['certificacion (from bootcamp)'].trim(),
                bootcamp: record.fields['bootcamp'].trim(),
                img: "https://"+image.trim()+".ipfs.dweb.link/"+record.fields['Nombre'].trim()+" - "+record.fields['bootcamp'].trim()+".png",
                reference: image
              },
              gas: '300000000000000'
            }).then(async (res) => {
              if(res) {
                if (record.fields['Correo'] != undefined) {
                  this.sendmail = await EnvioCorreo(record.fields['Correo'].trim(), record.fields['certificacion (from bootcamp)'].trim(), record.fields['Nombre'].trim(), 
                  "https://"+image.trim()+".ipfs.dweb.link/"+record.fields['Nombre'].trim()+" - "+record.fields['bootcamp'].trim()+".png")
                }
                console.log("------------------------------------------");
                console.log("se creo el nuevo usuario");
                console.log("aqui esta la imagen");
                console.log(image);
                console.log("se cargo el certificado en el contrato");
                console.log("------------------------------------------");
              }
            })
            .catch((err) => {
              console.log("error al caragar datos en el contrato" + err);
            });
          }
        }).catch((err) => {
          console.log("error al crear imagen " + err);
        });
      });
      cont += 1;
      if(cont == longitudLista) {
        console.log("////////////////////////////////////////////////////////");
        console.log("termino la funcion");
        console.log("////////////////////////////////////////////////////////");
      }
    })
  }).catch((err) => {
    console.log("////////////////////////////////////////////////////////");
    console.log("termino la funcion con error: " + err);
    console.log("////////////////////////////////////////////////////////");
  });
}


app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
  servicio();
  //EnvioCorreo("", "", "", "")
  
  setInterval(function () {
    servicio();
  }.bind(this), 30000 * 60);
});