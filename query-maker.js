'use strict';
//--------------------------------------------------------------------------------
function getCategoryListQuery() {
    return 'SELECT * FROM categories WHERE id IN (SELECT categoryId FROM categoryhierarchy WHERE parentId IS NULL)';
}
//--------------------------------------------------------------------------------
function getCategoryTreeQuery() {
    return  'SELECT categoryTree.categoryId AS categoryId,\
                    categories.name AS categoryName,\
                    IFNULL(categoryTree.parentId, 0) AS parentId,\
                    categoryTree.itemCount\
            FROM\
            (SELECT categoryHierarchy.categoryId AS categoryId, parentId,\
                    COUNT(items.id) AS itemCount\
                FROM categoryHierarchy\
                LEFT JOIN items\
                ON categoryHierarchy.categoryId = items.categoryId\
                GROUP BY\
                categoryId, parentId) AS categoryTree\
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
function constructPropertyCondition(query) {
    let keys = Object.keys(query).filter(el => el.indexOf('propertyId') === 0);
    let index, value;
    let condSQL = '';
    
    if (!keys.length) {
        return '';
    }

    for (let key of keys) {
        index = key.replace('propertyId', '');
        value = query[ `value${index}` ];
        condSQL += condSQL === '' ? '' : ' OR ';
        condSQL += ` (propertyId = ${query[key]} AND `;
        condSQL += value instanceof Array ? ' (' + value.map(el => ` value = \'${el}\' `).join(' OR ') + ')) ' :
                                            ` value = \'${value}\') `;
    }

    return ` AND id IN (\
                        SELECT itemId\
                        FROM itemproperties\
                        WHERE ${condSQL}\
                        GROUP BY itemId\
                        HAVING COUNT(propertyId) = ${keys.length}) `;
}
//--------------------------------------------------------------------------------
function getItemListQuery(req) {
    let query = req.query;
    let conditionInj = '';

    if (query[ 'id' ]) {
        conditionInj = ` WHERE id = ${query.id} `;
    } else if (query[ 'searchName' ]) {
        conditionInj = ` WHERE name LIKE \'%${query.searchName}%\' `;
        conditionInj += query[ 'searchId' ] ? ` OR id = ${query.searchId} `: '';
    } else if (query[ 'categoryId' ]) {
        conditionInj = ` WHERE (itemSelection.categoryId = ${query.categoryId} OR\
                               parents.parentId = ${query.categoryId} OR\
                               grandParents.parentId = ${query.categoryId}) `;
        if (query[ 'lowPrice' ]) {
            conditionInj += ` AND discountPrice >= ${query.lowPrice} `;
        }
        if (query[ 'highPrice' ]) {
            conditionInj += ` AND discountPrice <= ${query.highPrice} `;
        }
        conditionInj += constructPropertyCondition(query);
    }    
    
    return `\
      SELECT * FROM\
        (SELECT items.id as id, items.name as name, items.mainImage as mainImage,\
                 IFNULL(price, 0) AS price, IFNULL(discount, 0) AS discount,\
                 IFNULL(rate, 0) AS rate,\
                 CASE WHEN newItems.itemId IS NULL THEN false ELSE true END AS newItem,\
                 CAST(IFNULL(price, 0) * (1 - IFNULL(discountTable.discount, 0) / 100) AS DECIMAL(20,2)) AS discountPrice,\
                 items.categoryId AS categoryId, categories.name AS category,\
                 items.description AS description, items.shortDescription AS shortDescription\
        FROM items as items\
        \
        LEFT JOIN\
        (SELECT prices.itemId as itemId, prices.value as price\
          FROM prices as prices\
          INNER JOIN\
          (SELECT itemId, MAX(startDate) as maxStartDate \
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
          (SELECT itemId, MAX(startDate) as maxStartDate\
            FROM discountItems WHERE startDate <= now()\
            GROUP BY itemId\
          ) AS lastDiscountDates\
          ON discountItems.itemId = lastDiscountDates.itemId AND discountItems.startDate = lastDiscountDates.maxStartDate\
        ) AS discountTable\
        ON id = discountTable.itemIdDisc\
        \
        LEFT JOIN\
        (SELECT itemId, AVG(rate) as rate\
        FROM itemRates\
        GROUP BY itemId) AS rates\
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
      ${conditionInj}\
      ORDER BY name`;
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
function getPropertyComparisonQuery(req) {
    let conditionInj = '';
    let conditionInjProp;
    let idArray = req.query.id;

    conditionInj += ' WHERE (' + idArray.map(el => ` id = ${el} `).join(' OR ') + ') ';
    conditionInjProp = conditionInj.replace(new RegExp('id', 'g'), 'itemId');    

    return  `SELECT allPares.propertyId AS propertyId,\
                    allPares.propertyName AS propertyName,\
                    allPares.itemId AS itemId,\
                    propertyValues.value\
            FROM\
            (SELECT propertyId, propertyName, itemIds.itemId\
                FROM\
                (SELECT DISTINCT itemProperties.propertyId AS propertyId, properties.name AS propertyName\
                FROM itemProperties\
                INNER JOIN properties\
                ON itemProperties.propertyId = properties.id\
                ${conditionInjProp}\
                ) AS allProperties\
                INNER JOIN\
                (SELECT id AS itemId FROM items ${conditionInj}) AS itemIds\
                ON 1=1\
            ) AS allPares\
            LEFT JOIN\
            (SELECT * FROM itemProperties ${conditionInjProp}) AS propertyValues\
            ON allPares.itemId = propertyValues.itemId AND\
                allPares.propertyId = propertyValues.propertyId`;
}
//--------------------------------------------------------------------------------
function getPropertiesFilterQuery(categoryId) {        
    return `SELECT DISTINCT itemProperties.propertyId AS id,\
                properties.name,\
                value\
            FROM itemProperties\
            JOIN properties\
            ON itemProperties.propertyId = properties.id\
            WHERE itemId IN\
            (SELECT items.id\
            FROM items AS items\
            LEFT JOIN categoryhierarchy AS parents\
            ON items.categoryId = parents.categoryId\
            LEFT JOIN categoryhierarchy AS grandParents\
            ON parents.parentId = grandParents.categoryId\
            WHERE\
            (items.categoryId = ${categoryId} OR parents.parentId = ${categoryId} OR grandParents.parentId = ${categoryId} )\
            )\
            AND properties.filter\
            ORDER BY properties.name, value`;
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
                    INSERT INTO orders (orderDate,user) VALUES (now(), \'${body.email}\'); `;  

    for (let row of body.orderRows)  {
        querySQL += `INSERT INTO orderItems\
                     (orderId, itemId, sum) VALUES\
                     ((SELECT MAX(id) FROM orders), ${row.item.id},${row.total});`;
    }
    querySQL += 'SELECT MAX(id) AS orderNumber FROM orders;';
    querySQL += 'COMMIT;';

    return querySQL;
}
//--------------------------------------------------------------------------------
function getImageListQuery(data) {
  let querySQL = 'SELECT * FROM images WHERE (' +
                 data.map(el => ` itemId = ${el.id}`).join(' OR ') +
                 ') ORDER BY itemId';

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