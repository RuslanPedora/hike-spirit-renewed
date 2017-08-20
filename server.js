'use strict';
//--------------------------------------------------------------------------------
const SERVER_PORT = 8888;
//--------------------------------------------------------------------------------
const path = require('path');
const fs = require('fs');
const express = require('express');
const appExpress = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const nodemailer = require('nodemailer');

const dbAgent = require('./db-agent');
const queryMaker = require('./query-maker');
//--------------------------------------------------------------------------------
appExpress.use(bodyParser.json());

//only for dev environment we allow cors
if (!process.env.PORT) {
  appExpress.use(cors());
}

appExpress.use((req,res,next) => {
  console.log(`Path: ${req.path}`)
  next();
});
//--------------------------------------------------------------------------------
appExpress.get('/', safeWrapper(loadStartPage));
appExpress.get('/categories', safeWrapper(getCategories));
appExpress.get('/categories-tree', safeWrapper(getCategoryTree));
appExpress.get('/categories/:categoryId/path', safeWrapper(getCategoryPath));
appExpress.get('/categories/:categoryId/property-filter', safeWrapper(getPropertiesFilter));
appExpress.get('/carriers', safeWrapper(getCarriers));
appExpress.get('/items', safeWrapper(getItems));
appExpress.get('/items-new', safeWrapper(getNewItems));
appExpress.get('/items/:itemId/properties', safeWrapper(getItemProperties));
appExpress.get('/property-comparison', safeWrapper(getPropertyComparison));
//--------------------------------------------------------------------------------
appExpress.post('/orders', postOrder);
//--------------------------------------------------------------------------------
appExpress.use('/images/', express.static(path.join(__dirname, 'src/images')));
appExpress.use('/icons-logos/', express.static(path.join(__dirname, 'src/images')));
appExpress.use('/node_modules/', express.static(path.join(__dirname, 'node_modules')));
appExpress.use('/', express.static(path.join(__dirname, 'src')));
//--------------------------------------------------------------------------------
appExpress.use(onError);
//--------------------------------------------------------------------------------
let server = appExpress.listen(process.env.PORT || SERVER_PORT, function() {
    console.log('Server has been started: ' + server.address().address + ':' + server.address().port);
});
//--------------------------------------------------------------------------------
function safeWrapper(func) {
    return (req, res, next) => {
        new Promise((resolve,reject) => resolve(func(req,res,next)))
            .catch(err => next(err));
    };
}
//--------------------------------------------------------------------------------
function loadStartPage(req, res, next) {
    fs.readFile(`${__dirname}/src/index.html`, (err, html) => {
        if (err) {
            next(err);
        }               
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.end(html);  
    });
}
//--------------------------------------------------------------------------------
async function postOrder(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getPostOrderQuery(req.body));
    let orderNumber;

    //last order related to commit operation
    orderNumber = data[ data.length - 2 ][ 0 ].orderNumber;
    sendOrderEmail(orderNumber, req.body);

    res.json(orderNumber);
}
//--------------------------------------------------------------------------------
function sendOrderEmail(orderNumber, orderData) {
    let colorStyle;    
    let colorFlag = false;
    let messageText, messageHtml; 
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hike.spirit@gmail.com',
            pass: 'hike.spirit17'
        }
    });
    let mailOptions = {
        from: 'hike.spirit@gmail.com',
        to: '' + orderData.email,
        subject: `Order${orderNumber} from Hike Spirit (this is demo purpose mail)`,
        text: '',
        html: ''
    };

    messageText = `Hello ${orderData.firstName}\ 
                  <br>\
                  <br>\
                  You have placed an order #${orderNumber} on our site hile-spirit.herokuapp.com, but this is not true e-shop,\
                  our shop assistant will not contact you.<br>\ 
                  This is demo purpose mail only\
                  <br>\
                  <br>`;
    messageHtml = `<p>\
                      ${messageText}\
                   </p>\
                   <table style="border-collapse:collapse">\
                    <tr>\
                        <th style="text-align:center;border:1px solid black;padding:5px;">\
                          Item\
                        </th>\  
                        <th style="text-align:center;border:1px solid black;padding:5px;">\
                          Qty.\
                        </th>\    
                        <th style="text-align:center;border:1px solid black;padding:5px;">\
                          Price\
                        </th>\
                        <th style="text-align:center;border:1px solid black;padding:5px;">\
                          Total\
                        </th>\
                    </tr>`;
    for (let row of orderData.orderRows) {
      colorStyle = colorFlag ? "background-color:rgb(200,200,200);" : "";
      colorFlag = !colorFlag;
      messageHtml +=`<tr>\
                      <td style="border:1px solid black;padding:5px;${colorStyle}">\
                        ${row.item.name}\
                      </td>\
                      <td style="text-align:right;border:1px solid black;padding:5px;${colorStyle}">\
                        ${row.quantity}\
                      </td>\
                      <td style="text-align:right;border:1px solid black;padding:5px;${colorStyle}">\
                        ${row.item.discountPrice.toFixed(2)}$\
                      </td>\
                      <td style="text-align:right;border:1px solid black;padding:5px;${colorStyle}">\
                        ${row.total.toFixed(2)}$\
                      </td>\
                    </tr>`;
    }
    messageHtml +=`<tr>\
                    <td style="border:1px solid black;padding:5px;" colspan=3>\
                      Total\
                    </td>\
                    <td style="text-align:right;border:1px solid black;padding:5px;font-weight:bold;">\
                      ${orderData.total.toFixed(2)}$\
                    </td>\
                  </tr>\
                  <tr>\
                    <td style="border:1px solid black;padding:5px;" colspan=3>\
                      Total, shipment included\
                    </td>\
                    <td style="text-align:right;border:1px solid black;padding:5px;font-weight:bold;">
                      ${orderData.totalPlusShipment.toFixed(2)}$\
                    </td>\
                  </tr>`;
    messageHtml +=`</table>\
                  <br>Payment method: ${orderData.paymnetType}\ 
                  <br>\
                  <br>Additional information: ${orderData.comment}\ 
                  <br><br><br>\
                  <p>\
                    Kind regards.<br><br>hike-spirit.herokuapp.com team.\
                  </p>`;

    mailOptions.text = messageText;
    mailOptions.html = messageHtml;

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
    });
}
//--------------------------------------------------------------------------------
async function getCategoryPath(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getCategoryPathQuery(req));
    let path = [];
    let categoryId = Number.parseInt(req.params.categoryId);
    let element;

    element = data.find(el => el.categoryId === categoryId);
    while (element) {
        path.push({ 'id': element.categoryId, 'name': element.categoryName, 'image':  element.categoryImage });
        element = data.find(el => el.categoryId === element.parentId);
    }
    path.reverse();

    res.json(path);
} 
//--------------------------------------------------------------------------------
async function getPropertiesFilter(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getPropertiesFilterQuery(req.params.categoryId));

    res.json(data);
}
//--------------------------------------------------------------------------------
async function getPropertyComparison(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getPropertyComparisonQuery(req));

    res.json(data);
}
//--------------------------------------------------------------------------------
async function getCategories(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getCategoryListQuery());

    res.json(data);
}
//--------------------------------------------------------------------------------
async function getCategoryTree(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getCategoryTreeQuery());

    res.json(data);
}  
//--------------------------------------------------------------------------------
async function getCarriers(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getCarrierListQuery());

    res.json(data);
}
//--------------------------------------------------------------------------------
async function getNewItems(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getNewItemsQuery());

    res.json(data);
}  
//--------------------------------------------------------------------------------
async function getItemProperties(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getItemPropertiesQuery(req.params.itemId));

    res.json(data);
}
//--------------------------------------------------------------------------------
async function getItems(req, res, next) {
  let data = await dbAgent.executeSQL(queryMaker.getItemListQuery(req));

  if (data.length) {
    await bindImageList(data,next);
  }  
  res.json(data);
}
//--------------------------------------------------------------------------------
async function bindImageList(data,next) {
  let imageListResult = await dbAgent.executeSQL(queryMaker.getImageListQuery(data));

  data.forEach(el => { 
    el.imageList = imageListResult.filter(subEl => subEl.itemId === el.id)
                                  .map(imEl => ({ 'smallImage': imEl.smallImage,
                                                  'mediumImage': imEl.mediumImage,
                                                  'bigImage': imEl.bigImage 
                                  }));    
  });
}
//--------------------------------------------------------------------------------
function onError(err, req, res, next) {
  console.log(err.message);
  res.status(500);
  res.json({    
    errorMessage: err.message
  });
}  
//--------------------------------------------------------------------------------
