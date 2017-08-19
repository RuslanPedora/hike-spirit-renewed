'use strict';
//--------------------------------------------------------------------------------
const ITEM_TABLE_PREFIX = '_IT';
const PROPERTY_TABLE_PREFIX = '_PT';
//--------------------------------------------------------------------------------
function getCategoryListQuery() {
    return 'SELECT * FROM categories WHERE id IN ( SELECT categoryId FROM categoryhierarchy WHERE parentId IS NULL)';
}
//--------------------------------------------------------------------------------
function getCategoryTreeQuery() {
    return  'SELECT categoryTree.categoryId AS categoryId,\
                    categories.name AS categoryName,\
                    IFNULL( categoryTree.parentId, 0 ) AS parentId,\
                    categoryTree.itemCount\
            FROM\
            (SELECT categoryHierarchy.categoryId AS categoryId, parentId,\
                    COUNT( items.id ) AS itemCount\
                FROM categoryHierarchy\
                LEFT JOIN items\
                ON categoryHierarchy.categoryId = items.categoryId\
                GROUP BY\
                categoryId, parentId ) AS categoryTree\
            INNER JOIN categories\
            ON categoryTree.categoryId = categories.id';    
}    
//--------------------------------------------------------------------------------
function getCarrierListQuery() {
    return 'SELECT * FROM carriers ORDER BY cost';
}
//--------------------------------------------------------------------------------
function getNewItemsQuery() {
    return 'SELECT id, name, mainImage, shortDescription\
            FROM items\
            INNER JOIN newItems\
            ON id = itemId\
            ORDER BY startDate DESC\
            LIMIT 3';
}
//--------------------------------------------------------------------------------
function getItemListQuery(request) {
    let querySQL;
    let queryInputString;
    let indexOfQueryString;
    let queryObject;
    let categoryValue;
    let propertyCondition = '';
    let propertryCount = 0;
    let conditionInjection;
    let valueFieldName;
    let valueArray;

    indexOfQueryString = request.url.indexOf( '/?' );
    if ( indexOfQueryString > 0 )
      queryInputString = request.url.slice( indexOfQueryString + 2 , request.url.length );
    else 
      queryInputString = '';

    querySQL = '\
      SELECT * FROM\
        ( SELECT items.id as id, items.name as name, items.mainImage as mainImage,\
                 IFNULL( price, 0 ) AS price, IFNULL( discount, 0 ) AS discount,\
                 IFNULL( rate, 0 ) AS rate,\
                 CASE WHEN newItems.itemId IS NULL THEN false ELSE true END AS newItem,\
                 CAST( IFNULL( price, 0 ) * ( 1 - IFNULL( discountTable.discount, 0 ) / 100 ) AS DECIMAL(20,2) ) AS discountPrice,\
                 items.categoryId AS categoryId, categories.name AS category,\
                 items.description AS description, items.shortDescription AS shortDescription\
        FROM items as items\
        \
        LEFT JOIN\
        ( SELECT prices.itemId as itemId, prices.value as price\
          FROM prices as prices\
          INNER JOIN\
          ( SELECT itemId, MAX( startDate ) as maxStartDate \
            FROM prices where startDate <= now() \
            GROUP BY itemId \
          ) AS lastDates\
          ON prices.itemId = lastDates.itemId AND prices.startDate = lastDates.maxStartDate\
        ) AS priceTable\
        ON id = priceTable.itemId\
        \
        LEFT JOIN\
        (SELECT discountItems.itemId as itemIdDisc, discountItems.discount as discount\
          FROM discountItems as discountItems\
          INNER JOIN\
          ( SELECT itemId, MAX( startDate ) as maxStartDate\
            FROM discountItems WHERE startDate <= now()\
            GROUP BY itemId\
          ) AS lastDiscountDates\
          ON discountItems.itemId = lastDiscountDates.itemId AND discountItems.startDate = lastDiscountDates.maxStartDate\
        ) AS discountTable\
        ON id = discountTable.itemIdDisc\
        \
        LEFT JOIN\
        ( SELECT itemId, AVG(rate) as rate\
        FROM itemRates\
        GROUP BY itemId ) AS rates\
        ON id = rates.itemId\
        \
        LEFT JOIN newItems\
        ON id = newItems.itemId\
        \
        LEFT JOIN categories\
        ON items.categoryId = categories.id) as itemSelection\
        \
      LEFT JOIN categoryhierarchy AS parents\
      ON itemSelection.categoryId = parents.categoryId\
      LEFT JOIN categoryhierarchy AS grandParents\
      ON parents.parentId = grandParents.categoryId\
      \
      conditionInjection\
      ORDER BY name';

    conditionInjection = constructSQLCondition( decodeQuotes( queryInputString ), ITEM_TABLE_PREFIX );
    conditionInjection = conditionInjection.replace( 'AND (searchId', 'OR (id' );

    queryObject = JSON.parse( decodeQuotes( queryInputString ) );
    if( queryObject.hasOwnProperty( 'categoryId' ) ) {
      if( conditionInjection == '' ) 
        conditionInjection = ' WHERE '
      else
        conditionInjection += ' AND '
      categoryValue = queryObject.categoryId;
      conditionInjection += '( itemSelection.categoryId = ' + categoryValue + ' OR parents.parentId = ' + categoryValue + ' OR grandParents.parentId = ' + categoryValue + ')';
    }    

    for( var property in queryObject ) {
      if( property.indexOf( 'propertyId' ) >= 0 ) {
         propertryCount = propertryCount +1;

         if( propertyCondition == '' )
            propertyCondition += ' WHERE ';
         if( propertyCondition != ' WHERE ' )
            propertyCondition += ' OR '
         propertyCondition += '( propertyId = ' + queryObject[ property ] + ' AND (';

         valueFieldName = 'value' + property.replace( 'propertyId', '' );

         if ( queryObject[ valueFieldName ] instanceof Array )
            valueArray = queryObject[ valueFieldName ];
         else {
            valueArray = [];
            valueArray.push( queryObject[ valueFieldName ] );
         }
         for( var j in valueArray ) {
            propertyCondition += ( j == 0 ? '' : ' OR ' ) + ' value = \'' + valueArray[ j ] +'\' ';
         }
         propertyCondition += ' ) ) '
      }
    }

    if( propertyCondition != '' ) {
      if( conditionInjection == '' )      
        conditionInjection += ' WHERE ';
      else 
        conditionInjection += ' AND ';
      conditionInjection += ' id IN ( SELECT itemId FROM itemProperties ' + propertyCondition + ' GROUP BY itemId HAVING COUNT( propertyId ) = ' + propertryCount + ' ) ';
    }

    querySQL = querySQL.replace( 'conditionInjection', conditionInjection );

    return querySQL;
}
//--------------------------------------------------------------------------------
function getItemPropertiesQuery(itemId) {
    return `SELECT propertyId AS id, name AS name, value AS value\
            FROM itemProperties\
            JOIN\
            properties\
            ON itemProperties.propertyId = properties.id\
            WHERE itemId = ${itemId} ORDER BY name`;
}
//--------------------------------------------------------------------------------
function getPropertyComparisonQuery(request) {
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

    return querySQL;   
}
//--------------------------------------------------------------------------------
function getPropertiesFilterQuery(request) {
    var querySQL = '';
    var queryInputString = '';
    var indexOfQueryString = '';
    var queryObject = {};
    let categoryValue;

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
    return querySQL;
}
//--------------------------------------------------------------------------------
function getCategoryPathQuery() {
    return 'SELECT categoryId, categories.name AS categoryName,\
                    categories.image AS categoryImage,\
                    parentId\
            FROM categoryhierarchy\
            INNER JOIN categories\
            ON categoryId = id';
}
//--------------------------------------------------------------------------------
function getPostOrderQuery(body) {
    let querySQL = `START TRANSACTION;\
                    INSERT INTO orders (orderDate,user) VALUES ( now(), \'${body.email}\' ); `;  

    for (let row of body.orderRows )  {
        querySQL += `INSERT INTO orderItems\
                     ( orderId, itemId, sum) VALUES\
                     ( ( SELECT MAX(id) FROM orders ), ${row.item.id},${row.total});`;
    }
    querySQL += 'SELECT MAX(id) AS orderNumber FROM orders;';
    querySQL += 'COMMIT;';

    return querySQL;
}
//--------------------------------------------------------------------------------
function getImageListQuery(data) {
  let querySQL = 'SELECT * FROM images WHERE ';
  
  for (let i in data) {
    querySQL += (i == 0 ? ' ' : ' OR ') + ' itemId = ' + data[ i ].id;
  }
  querySQL += ' ORDER BY itemId';

  return querySQL;
}
//--------------------------------------------------------------------------------
module.exports = {
    getCategoryListQuery,
    getCategoryTreeQuery,
    getCarrierListQuery,
    getNewItemsQuery,
    getItemListQuery,
    getItemPropertiesQuery,
    getPropertyComparisonQuery,
    getPropertiesFilterQuery,
    getCategoryPathQuery,
    getPostOrderQuery,
    getImageListQuery
}
//--------------------------------------------------------------------------------
//all code bellow must be refactoried
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
//--------------------------------------------------------------------------------
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
//--------------------------------------------------------------------------------
function cleanPrefix( propertryName ) {
  propertryName = propertryName.replace( 'low', '' );
  propertryName = propertryName.replace( 'high', '' );
  propertryName = propertryName.replace( PROPERTY_TABLE_PREFIX, '' );
  propertryName = propertryName.replace( ITEM_TABLE_PREFIX, '' );
  return propertryName;
}
//--------------------------------------------------------------------------------
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
