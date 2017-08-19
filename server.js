const ITEM_TABLE_PREFIX = '_IT';
const PROPERTY_TABLE_PREFIX = '_PT';
const SERVER_PORT = 8888;
//--------------------------------------------------------------------------------
const path = require( 'path' );
const fs = require( 'fs' );
const express = require( 'express' );
const appExpress = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require( 'mysql' );
const nodemailer = require('nodemailer');

const dbAgent = require('./db-agent');
const queryMaker = require('./query-maker');
//--------------------------------------------------------------------------------
appExpress.use(bodyParser.json());

if (!process.env.PORT) {
  appExpress.use(cors());
}

appExpress.use( (req,res,next) => {
  console.log(`Path: ${req.path}`)
  next();
});
//--------------------------------------------------------------------------------
appExpress.get('/', loadStartPage);
appExpress.get('/categories', getCategories);
appExpress.get('/categories-tree', getCategoryTree);
appExpress.get('/categories/:categoryId/path', getCategoryPath);
appExpress.get('/carriers', getCarriers);
appExpress.get('/items', getItems);
appExpress.get('/items-new', getNewItems);
appExpress.get('/items/:itemId/properties', getItemProperties);
appExpress.get('/property-comparison', getPropertyComparison);
appExpress.get('/property-filter', getPropertiesFilter);
//--------------------------------------------------------------------------------
appExpress.post('/orders', postOrder );
//--------------------------------------------------------------------------------
appExpress.use('/images/', express.static(path.join( __dirname, 'src/images')));
appExpress.use('/icons-logos/', express.static(path.join( __dirname, 'src/images')));
appExpress.use('/node_modules/', express.static(path.join( __dirname, 'node_modules')));
appExpress.use('/', express.static(path.join(__dirname, 'src')));
//--------------------------------------------------------------------------------
appExpress.use( onError );
//--------------------------------------------------------------------------------
server = appExpress.listen( process.env.PORT || SERVER_PORT, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log( "Server has been started: " + host + " - " + port );
});
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
    let data = await dbAgent.executeSQL(queryMaker.getPostOrderQuery(req.body)).catch(err => next(err));
    let orderNumber;

    orderNumber = 1111;//data[ data.length - 1 ][ 0 ].orderNumber;
    sendOrderEmail(orderNumber, req.body);

    res.json(orderNumber);
}
//--------------------------------------------------------------------------------
function sendOrderEmail(orderNumber, orderData) {
    let colorStyle;    
    let colorFlag = false;
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

    transporter.sendMail( mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
    });
}
//--------------------------------------------------------------------------------
async function getCategoryPath(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getCategoryPathQuery(req)).catch(err => next(err));
    let path = [];
    let categoryId = Number.parseInt(req.params.categoryId);

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
    let data = await dbAgent.executeSQL(queryMaker.getPropertiesFilterQuery(req)).catch(err => next(err));

    res.json(data);
}
//--------------------------------------------------------------------------------
async function getPropertyComparison(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getPropertyComparisonQuery(req)).catch(err => next(err));

    res.json(data);
}
//--------------------------------------------------------------------------------
async function getCategories(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getCategoryListQuery()).catch(err => next(err));

    res.json(data);
}
//--------------------------------------------------------------------------------
async function getCategoryTree(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getCategoryTreeQuery()).catch(err => next(err));

    res.json(data);
}  
//--------------------------------------------------------------------------------
async function getCarriers(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getCarrierListQuery()).catch(err => next(err));

    res.json(data);
}
//--------------------------------------------------------------------------------
async function getNewItems(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getNewItemsQuery()).catch(err => next(err));

    res.json(data);
}  
//--------------------------------------------------------------------------------
async function getItemProperties(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getItemPropertiesQuery(req.params.itemId)).catch(err => next(err));

    res.json(data);
}
//--------------------------------------------------------------------------------
async function getItems(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getItemListQuery(req)).catch(err => next(err));

    await bindImageList(data,next);
    res.json(data);
}
//--------------------------------------------------------------------------------
async function bindImageList(data,next) {
  let imageListResult = await dbAgent.executeSQL(queryMaker.getImageListQuery(data)).catch(err => next(err));

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
  res.status(500);
  res.json({    
    errorMessage: err.message
  });
}  
//--------------------------------------------------------------------------------
