const ITEM_TABLE_PREFIX = '_IT';
const PROPERTY_TABLE_PREFIX = '_PT';
const SERVER_PORT = 8888;
//--------------------------------------------------------------------------------
const path = require( 'path' );
const fs = require( 'fs' );
const express = require( 'express' );
const cors = require('cors');
const appExpress = express();
const mysql = require( 'mysql' );
const nodemailer = require('nodemailer');

const dbAgent = require('./db-agent');
const queryMaker = require('./query-maker');
//--------------------------------------------------------------------------------
var sourcePathName  = 'src';
var DEBUG_MODE = true;

var connetionData = {
                      host     : 'localhost',
                      database : 'hike_spirit',
                      user     : 'root',
                      multipleStatements: true
                    };

if (process.env.DATABASE_URL) {
  connetionData.host     = process.env.DATABASE_URL;
  connetionData.database = process.env.DATABASE_DB_NAME;
  connetionData.user     = process.env.DATABASE_USER;
  connetionData.password = process.env.DATABASE_PASSWORD;
  console.log('Database connection parameters changed to : ' + JSON.stringify(connetionData));
}

appExpress.use(cors());

appExpress.use( (req,res,next) => {
  console.log(`Path: ${req.path}`)
  next();
});
//--------------------------------------------------------------------------------
appExpress.get('/', loadStartPage);
appExpress.get('/categories', getCategories);
appExpress.get('/categories-tree', getCategoryTree);
appExpress.get('/carriers', getCarriers );
appExpress.get('/items', getItems );
appExpress.get('/items-new', getNewItems );
//--------------------------------------------------------------------------------
appExpress.get( "/getItemProperties", itemPropertiesResponse );
appExpress.get( "/getComparedProperties", comparePropertiesResponse );
appExpress.get( "/getCategoryPath", categoryPathResponse );
appExpress.get( "/getProperties", propertiesResponse );

appExpress.post( "/postOrder", orderResponse );

appExpress.use( '/images/', express.static( path.join( __dirname, 'src/images' ) ) );
appExpress.use( '/icons-logos/', express.static( path.join( __dirname, 'src/images' ) ) );
appExpress.use( '/node_modules/', express.static( path.join( __dirname, 'node_modules' ) ) );
appExpress.use( '/', express.static( path.join( __dirname, 'src' ) ) );

//--------------------------------------------------------------------------------
appExpress.use( onError );
//--------------------------------------------------------------------------------
server = appExpress.listen( process.env.PORT || SERVER_PORT, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log( "Server has been started: " + host + " - " + port );
});
//-----------------------------------------------------------------------------
function loadStartPage( req, res, next ) {
    fs.readFile(`${__dirname}/src/index.html`, (err, html) => {
        if (err) {
            next(err);
        }               
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.end(html);  
    });
}
//-----------------------------------------------------------------------------
function orderResponse( request, response ) {

    var passedObjectAsString = ''

    request.setEncoding('utf8')

    request.on( 'data', function( chunk ) {
        
        passedObjectAsString += chunk;
    });

    request.on( 'end', function() {
        var passedObject = {};
        try {
          passedObject = JSON.parse( passedObjectAsString );
        }
        catch ( error )  {
          logRequest( error );          
        }

        querySQL = '\
          INSERT INTO orders (orderDate,user) VALUES ( now(), \'' + passedObject.email + '\' ); ';  

        for( var i in passedObject.orderRows )  {
          querySQL += ' INSERT INTO orderItems\
                         ( orderId, itemId, sum) VALUES\
                         ( ( SELECT MAX(id) FROM orders ), ' + passedObject.orderRows[ i ].item.id +', ' + passedObject.orderRows[ i ].total + ' );'
        }

        querySQL += 'SELECT MAX(id) AS orderNumber FROM orders;';

        connection = mysql.createConnection( connetionData );
        connection.connect();
        connection.query( querySQL, function ( error, results, fields ) {
                            if (error) { 
                              logRequest( 'db connetion failed: ' + querySQL );
                              return;
                            }
                            response.writeHead( 200, {'Content-Type': 'text/plain' } );
                            sendOrderEmail( results[ results.length - 1 ][ 0 ].orderNumber, passedObject );
                            responseStr = JSON.stringify( results[ results.length - 1 ][ 0 ] );                                                     
                            response.end( responseStr );
                            logRequest( request.url, 'itmes request processed' );
                        });
        connection.end( function( err ) {
          console.log( 'connection ended with error: ' + err );
        });
    })
}
//-----------------------------------------------------------------------------
function sendOrderEmail( orderNumber, orderData ) {

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
        subject: 'Order ' + orderNumber + ' from Hike Spirit (this is demo purpose mail)',
        text: 'zzz',
        html: '+++'
    };

    messageText = 'Hello ' + orderData.firstName + 
                  '<br><br>You have placed an order # ' + orderNumber + ' on our site hile-spirit.herokuapp.com, but this is not true e-shop,' +
                  ' our shop assistant will not contact you.<br>' + 
                  'This is demo purpose mail only<br><br>';
    messageHtml = '<p>' + messageText;
    messageHtml += '</p>';
    messageHtml +='<table style="border-collapse:collapse">'

    messageHtml +='<tr>'
    messageHtml +='<th style="text-align:center;border:1px solid black;padding:5px;">Item'
    messageHtml +='</th>'    
    messageHtml +='<th style="text-align:center;border:1px solid black;padding:5px;">Qty.'
    messageHtml +='</th>'    
    messageHtml +='<th style="text-align:center;border:1px solid black;padding:5px;">Price'
    messageHtml +='</th>'    
    messageHtml +='<th style="text-align:center;border:1px solid black;padding:5px;">Total'
    messageHtml +='</th>'    
    messageHtml +='</tr>'

    for( let i in orderData.orderRows ) {
      if( i%2 > 0 ) 
        colorStyle = "background-color:rgb(200,200,200);";
      else  
        colorStyle = "";
      messageHtml +='<tr>'
      messageHtml +='<td style="border:1px solid black;padding:5px;' + colorStyle + '">' + orderData.orderRows[ i ].item.name;
      messageHtml +='</td>'    
      messageHtml +='<td style="text-align:right;border:1px solid black;padding:5px;' + colorStyle + '">' + orderData.orderRows[ i ].quantity;
      messageHtml +='</td>'    
      messageHtml +='<td style="text-align:right;border:1px solid black;padding:5px;' + colorStyle + '">' + orderData.orderRows[ i ].item.discountPrice.toFixed( 2 ) + '$';
      messageHtml +='</td>'    
      messageHtml +='<td style="text-align:right;border:1px solid black;padding:5px;' + colorStyle + '">' + orderData.orderRows[ i ].total.toFixed( 2 ) + '$';
      messageHtml +='</td>'    
      messageHtml +='</tr>'      
    }


    messageHtml +='<tr>'
    messageHtml +='<td style="border:1px solid black;padding:5px;" colspan=3>Total'
    messageHtml +='</td>'    
    messageHtml +='<td style="text-align:right;border:1px solid black;padding:5px;font-weight:bold;">' + orderData.total.toFixed( 2 ) + '$';
    messageHtml +='</td>'    
    messageHtml +='</tr>'


    messageHtml +='<tr>'
    messageHtml +='<td style="border:1px solid black;padding:5px;" colspan=3>Total, shipment included'
    messageHtml +='</td>'    
    messageHtml +='<td style="text-align:right;border:1px solid black;padding:5px;font-weight:bold;">' + orderData.totalPlusShipment.toFixed( 2 ) + '$';
    messageHtml +='</td>'    
    messageHtml +='</tr>'


    messageHtml +='</table>'

    messageHtml += '<br>Payment method: ' + orderData.paymnetType; 
    messageHtml += '<br>'

    messageHtml += '<br>Additional information: ' + orderData.comment; 
    messageHtml += '<br>'


    messageHtml += '<br><br><p>Kind regards.<br><br>hike-spirit.herokuapp.com team.</p>';

    mailOptions.text = messageText;
    mailOptions.html = messageHtml;

    transporter.sendMail( mailOptions, ( error, info ) => {
        if ( error ) {
            return console.log(error);
        }
        logRequest('Message %s sent: %s', info.messageId, info.response);
    });


}
//-----------------------------------------------------------------------------
function categoryPathResponse( request, response ) {
    var querySQL = '';
    var queryInputString = '';
    var indexOfQueryString = '';
    var queryObject = {};
    var path =[];
    var index = -1;
    

    indexOfQueryString = request.url.indexOf( '/?' );
    if ( indexOfQueryString > 0 )
      queryInputString = request.url.slice( indexOfQueryString + 2 , request.url.length );
    else 
      queryInputString = '';

    queryObject = JSON.parse( decodeQuotes( queryInputString ) );

    querySQL = 'SELECT categoryId, categories.name AS categoryName,\
                       categories.image AS categoryImage,\
                       parentId\
                FROM categoryhierarchy\
                INNER JOIN categories\
                ON categoryId = id';

    connection = mysql.createConnection( connetionData );
    connection.connect();
    connection.query( querySQL, function ( error, results, fields ) {
                        if (error) { 
                          logRequest( 'db connetion failed: ' + querySQL );
                          logRequest( 'Error: ' + error );                          
                          return;
                        }
                        element = results.find( function( element ) { 
                            return element.categoryId == queryObject.categoryId; 
                        } );
                        
                        while ( element != undefined ) {
                            path.push( { 'id': element.categoryId, 'name': element.categoryName, 'image':  element.categoryImage } );
                            element = results.find( function( neededElement ) { 
                                      return neededElement.categoryId == element.parentId;
                            } );
                        }
                        path.reverse();

                        response.writeHead( 200, { 'Content-Type': 'text/plain' } );
                        responseStr = JSON.stringify( path );                                                     
                        response.end( responseStr );
                        logRequest( request.url, 'itmes request processed' );
                    });
    connection.end( function( err ) {
      console.log( 'connection ended with error: ' + err );
    });


} 
//-----------------------------------------------------------------------------
function makeResponseOnDBData( querySQL, request, response, postProcessor ) {
    connection = mysql.createConnection( connetionData );
    connection.connect();
    connection.query( querySQL, function ( error, results, fields ) {
                        if (error) { 
                          logRequest( 'db connetion failed: ' + querySQL );
                          logRequest( 'Error: ' + error );                          
                          return;
                        }
                        if( postProcessor != undefined && results.length > 0) {
                          postProcessor( request, response, results );
                          return;
                        }
                        response.writeHead( 200, { 'Content-Type': 'text/plain' } );
                        responseStr = JSON.stringify( results );                                                     
                        response.end( responseStr );
                        logRequest( request.url, 'itmes request processed' );
                    });
    connection.end( function( err ) {
      console.log( 'connection ended with error: ' + err );
    });
    logRequest( request.url, 'connection is closed' );
}
//-----------------------------------------------------------------------------
function propertiesResponse( request, response ) {
    var querySQL = '';
    var queryInputString = '';
    var indexOfQueryString = '';
    var queryObject = {};

    indexOfQueryString = request.url.indexOf( '/?' );
    if ( indexOfQueryString > 0 )
      queryInputString = request.url.slice( indexOfQueryString + 2 , request.url.length );
    else 
      queryInputString = '';

    queryObject   = JSON.parse( decodeQuotes( queryInputString ) );
    categoryValue = queryObject.categoryId;

     querySQL = '\
        SELECT DISTINCT itemProperties.propertyId AS id,\
               properties.name,\
               value\
        FROM itemProperties\
        JOIN properties\
        ON itemProperties.propertyId = properties.id\
        WHERE itemId IN\
        ( SELECT items.id\
          FROM items AS items\
          LEFT JOIN categoryhierarchy AS parents\
          ON items.categoryId = parents.categoryId\
          LEFT JOIN categoryhierarchy AS grandParents\
          ON parents.parentId = grandParents.categoryId\
          WHERE\
          ( items.categoryId = ' + categoryValue + ' OR parents.parentId = ' + categoryValue + ' OR grandParents.parentId = ' + categoryValue + ')\
        )\
        AND properties.filter\
        ORDER BY properties.name, value';

    logRequest( request.url );    

    makeResponseOnDBData( querySQL, request, response );

}
//-----------------------------------------------------------------------------
function comparePropertiesResponse( request, response ) {
    var querySQL = '';
    var queryInputString = '';
    var indexOfQueryString = '';
    var queryObject = {};
    var idArray = [];
    var conditionInjection = '';
    

    indexOfQueryString = request.url.indexOf( '/?' );
    if ( indexOfQueryString > 0 )
      queryInputString = request.url.slice( indexOfQueryString + 2 , request.url.length );
    else 
      queryInputString = '';

    queryObject = JSON.parse( decodeQuotes( queryInputString ) );
    idArray = queryObject.id;

    querySQL = 'SELECT * FROM carriers';

    conditionInjection += ' WHERE ( ';
    for( var i in idArray ) 
        conditionInjection += ( i > 0 ? ' OR ' : '' ) + ' id = ' + idArray[ i ];
    conditionInjection += ' ) ';


    querySQL = 'SELECT allPares.propertyId AS propertyId,\
                       allPares.propertyName AS propertyName,\
                       allPares.itemId AS itemId,\
                       propertyValues.value\
                FROM\
                ( SELECT propertyId, propertyName, itemIds.itemId\
                  FROM\
                  ( SELECT DISTINCT itemProperties.propertyId AS propertyId, properties.name AS propertyName\
                    FROM itemProperties\
                    INNER JOIN properties\
                    ON itemProperties.propertyId = properties.id\
                    propCondition\
                  ) AS allProperties\
                  INNER JOIN\
                  ( SELECT id AS itemId FROM items conditionInjection ) AS itemIds\
                  ON 1=1\
                ) AS allPares\
                LEFT JOIN\
                ( SELECT * FROM itemProperties propCondition ) AS propertyValues\
                ON allPares.itemId = propertyValues.itemId AND\
                   allPares.propertyId = propertyValues.propertyId';

    querySQL = querySQL.replace( new RegExp( 'conditionInjection', 'g' ), conditionInjection );
    conditionInjection = conditionInjection.replace( new RegExp( 'id', 'g' ), 'itemId' );    
    querySQL = querySQL.replace( new RegExp( 'propCondition', 'g' ), conditionInjection );

    logRequest( request.url );    

    makeResponseOnDBData( querySQL, request, response );
}
//-----------------------------------------------------------------------------
async function getCategories(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getCategoryListQuery()).catch(err => next(err));

    res.json(data);
}
//-----------------------------------------------------------------------------
async function getCategoryTree(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getCategoryTreeQuery()).catch(err => next(err));

    res.json(data);
}  
//-----------------------------------------------------------------------------
async function getCarriers(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getCarrierListQuery()).catch(err => next(err));

    res.json(data);
}
//-----------------------------------------------------------------------------
async function getNewItems(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getNewItemsQuery()).catch(err => next(err));

    res.json(data);
}  
//-----------------------------------------------------------------------------
function itemPropertiesResponse( request, response ) {
    var querySQL;
    var queryInputString;
    var indexOfQueryString;
    var queryObject = {};
    

    indexOfQueryString = request.url.indexOf( '/?' );
    if ( indexOfQueryString > 0 )
      queryInputString = request.url.slice( indexOfQueryString + 2 , request.url.length );
    else 
      queryInputString = '';

    queryObject = JSON.parse( decodeQuotes( queryInputString ) );

    querySQL = 'SELECT propertyId AS id, name AS name, value AS value\
                FROM itemProperties\
                JOIN\
                properties\
                ON itemProperties.propertyId = properties.id\
                WHERE itemId = ' + queryObject.id + ' ORDER BY name';

    logRequest( request.url );    

    makeResponseOnDBData( querySQL, request, response );

}
//-----------------------------------------------------------------------------
async function getItems(req, res, next) {
    let data = await dbAgent.executeSQL(queryMaker.getItemListQuery(req)).catch(err => next(err));

    imageListBinder(req,res,data);
    //res.json(data);
}
//-----------------------------------------------------------------------------
function onError(err, req, res, next) {
  res.status(500);
  res.json({    
    errorMessage: err.message
  });
}  
//--------------------------------------------------------------------------------
function imageListBinder( request, response, innerResults ) {
  querySQL = 'SELECT * FROM images WHERE ';
  for( var i in innerResults) {
    querySQL += ( i == 0 ? ' ' : ' OR ' ) + ' itemId = ' + innerResults[ i ].id;
  }
  querySQL += ' ORDER BY itemId';
  connection = mysql.createConnection( connetionData );
  connection.connect();
  connection.query( querySQL, function ( error, imageListResult, fields ) {
                      var tempItemId = -1;
                      var imageList;
                      if (error) { 
                        logRequest( 'db connetion failed: ' + querySQL );
                        logRequest( 'Error: ' + error );                          
                        return;
                      }
                      innerResults.forEach( function( currentValue ) { currentValue.imageList = []; } );
                      for( var i in imageListResult ) {
                          if( tempItemId != imageListResult[ i ].itemId ) {                            
                            if( tempItemId != -1 ) {
                              innerResults.forEach( function( currentValue ) { if( currentValue.id == tempItemId ) currentValue.imageList = imageList; } );
                            }
                            imageList = [];
                            tempItemId = imageListResult[ i ].itemId;
                          }
                          imageList.push( { 'smallImage': imageListResult[ i ].smallImage,
                                            'mediumImage': imageListResult[ i ].mediumImage,
                                            'bigImage': imageListResult[ i ].bigImage
                          });
                      }
                      if( tempItemId != -1 ) {
                        innerResults.forEach( function( currentValue ) { if( currentValue.id == tempItemId ) currentValue.imageList = imageList; } );
                      }                      
                      response.writeHead( 200, { 'Content-Type': 'text/plain' } );
                      responseStr = JSON.stringify( innerResults );                                                     
                      response.end( responseStr );
                      logRequest( request.url, 'itmes request processed' );
  });
  connection.end( function( err ) {
     console.log( 'connection ended with error: ' + err );
  });

}
//--------------------------------------------------------------------------------
function decodeQuotes( inputString ) {
  var resultStr = inputString.replace( /%22/g, '"' );
  resultStr = resultStr.replace( /%20/g, ' ' );     
  return resultStr;
}
//--------------------------------------------------------------------------------
function constructSQLCondition( queryString, mask ) {
  var conditionString = '';
  var filterObject = {};
  var propertyValue;
  var valueIndex;
  var firstValue;
  var firstCondition = true;

  if( queryString == '' )
    return conditionString;
  try {
    filterObject = JSON.parse( queryString );  
  }
  catch ( error ) {
    logRequest( "Unable to parse query string: " + queryString );
    return conditionString;
  }
  if( Object.keys( filterObject ).length > 0 ) {
    conditionString  = ' WHERE ( ';
    for( var property in filterObject ) {
      if( mask != undefined && property.indexOf( mask ) < 0)
        continue;
      propertyValue = filterObject[ property ];
      if( !firstCondition )
          conditionString += ' AND ';
      if( propertyValue instanceof Array ) {
          firstValue = true;
          conditionString += '(';
          for( valueIndex in propertyValue ) {
            if( !firstValue )
              conditionString += ' OR ';   
            conditionString += cleanPrefix( property ) + 
                               propertyCompareSign( property ) + 
                               convertToSQLValue( propertyValue[ valueIndex ], property );
            firstValue = false;
          }
          conditionString += ')';
      }
      else {        
        conditionString += '(' + cleanPrefix( property ) + 
                                 propertyCompareSign( property ) + 
                                 convertToSQLValue( propertyValue, property ) + ')';
      }
      firstCondition = false;
    }
    conditionString += ' ) ';
  }
  if( conditionString == ' WHERE (  ) ' ) {
    conditionString = '';
  }
  return conditionString;
}
//-----------------------------------------------------------------------------
function convertToSQLValue( propertyValue, propertryName ) {
  if( typeof propertyValue == 'number' ) 
      return propertyValue;
  if( typeof propertyValue == 'string' ) {
    propertyValue = propertyValue.replace( /%20/g, ' ' );     
    if( propertryName.indexOf( 'name' ) >= 0 ) 
      return '\'%' + propertyValue + '%\'';     
    else  
      return '\'' + propertyValue + '\''; 
  }  
  else  
      return '\'' + propertyValue + '\''; 
}
//-----------------------------------------------------------------------------
function cleanPrefix( propertryName ) {
  propertryName = propertryName.replace( 'low', '' );
  propertryName = propertryName.replace( 'high', '' );
  propertryName = propertryName.replace( PROPERTY_TABLE_PREFIX, '' );
  propertryName = propertryName.replace( ITEM_TABLE_PREFIX, '' );
  return propertryName;
}
//-----------------------------------------------------------------------------
function propertyCompareSign( propertryName ) {
  if( propertryName.indexOf( 'name' ) >= 0 )
    return ' LIKE ';
  else if( propertryName.indexOf( 'low' ) >= 0 )
    return ' >= ';
  else if( propertryName.indexOf( 'high' ) >= 0 )
    return ' <= ';
  else
    return ' = ';  
}
//-----------------------------------------------------------------------------
function logRequest( url,message ) {
  if( DEBUG_MODE )
	 console.log( '' + ( new Date() ).toLocaleString() + ' url: ' + url + ' processed ' + message );
}
//-----------------------------------------------------------------------------