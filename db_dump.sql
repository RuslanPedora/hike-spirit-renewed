-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: hike_spirit
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carriers`
--

DROP TABLE IF EXISTS `carriers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carriers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(50) NOT NULL,
  `cost` decimal(20,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carriers`
--

LOCK TABLES `carriers` WRITE;
/*!40000 ALTER TABLE `carriers` DISABLE KEYS */;
INSERT INTO `carriers` VALUES (4,'Nova poshta',20.00),(5,'Courier',10.00),(6,'Ukrposhta',15.00);
/*!40000 ALTER TABLE `carriers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `image` char(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (30,'walking','walking.jpg'),(31,'camping','camping.jpg'),(32,'tents','tents.jpg'),(33,'rucksacks','rucksacks.jpg'),(34,'fishing','fishing.jpg'),(35,'cycling','cycling.jpg'),(36,'climbing','climbing.jpg'),(37,'Bags & Rucksacks',NULL),(38,'Bikes',NULL),(39,'Sleeping Bags',NULL),(40,'Travel Packs',NULL),(41,'Mountain Bikes',NULL),(42,'Mummy Shape',NULL),(43,'equipment',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoryhierarchy`
--

DROP TABLE IF EXISTS `categoryhierarchy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categoryhierarchy` (
  `categoryId` int(11) NOT NULL,
  `parentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`categoryId`),
  KEY `parentId` (`parentId`),
  CONSTRAINT `categoryhierarchy_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`),
  CONSTRAINT `categoryhierarchy_ibfk_2` FOREIGN KEY (`parentId`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoryhierarchy`
--

LOCK TABLES `categoryhierarchy` WRITE;
/*!40000 ALTER TABLE `categoryhierarchy` DISABLE KEYS */;
INSERT INTO `categoryhierarchy` VALUES (30,NULL),(31,NULL),(32,NULL),(33,NULL),(34,NULL),(35,NULL),(36,NULL),(43,30),(39,31),(38,35),(40,37),(41,38),(42,39),(37,43);
/*!40000 ALTER TABLE `categoryhierarchy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discountitems`
--

DROP TABLE IF EXISTS `discountitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `discountitems` (
  `itemId` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `discount` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`itemId`,`startDate`),
  CONSTRAINT `discountitems_ibfk_1` FOREIGN KEY (`itemId`) REFERENCES `items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discountitems`
--

LOCK TABLES `discountitems` WRITE;
/*!40000 ALTER TABLE `discountitems` DISABLE KEYS */;
INSERT INTO `discountitems` VALUES (344,'2017-01-01',12.00),(345,'2017-01-01',10.00),(346,'2017-01-01',12.00),(410,'2017-01-01',7.00),(411,'2017-01-01',13.00),(412,'2017-01-01',7.00),(419,'2017-01-01',15.00);
/*!40000 ALTER TABLE `discountitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `images` (
  `itemId` int(11) NOT NULL,
  `smallImage` char(100) NOT NULL,
  `mediumImage` char(100) DEFAULT '',
  `bigImage` char(100) DEFAULT '',
  PRIMARY KEY (`itemId`,`smallImage`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (344,'38728-150115160149-2120741122.jpg','38728-150115160149-2120741122.jpg','38728-150115160149-2120741122.jpg'),(344,'38729-150115160152-1036429656.jpg','38729-150115160152-1036429656.jpg','38729-150115160152-1036429656.jpg'),(344,'38731-150115160159-1036429656.jpg','38731-150115160159-1036429656.jpg','38731-150115160159-1036429656.jpg'),(344,'38735-150115160216-1036429656.jpg','38735-150115160216-1036429656.jpg','38735-150115160216-1036429656.jpg'),(344,'camping.jpg','camping.jpg','camping.jpg'),(344,'climbing.jpg','climbing.jpg','climbing.jpg'),(344,'cycling.jpg','cycling.jpg','cycling.jpg'),(344,'fishing.jpg','fishing.jpg','fishing.jpg'),(344,'rucksacks.jpg','rucksacks.jpg','rucksacks.jpg'),(344,'tents.jpg','tents.jpg','tents.jpg'),(344,'walking.jpg','walking.jpg','walking.jpg'),(345,'52282-250816122646-1036429656.jpg','52282-250816122646-1036429656.jpg','52282-250816122646-1036429656.jpg'),(346,'36124-070814091049-1036429656.jpg','36124-070814091049-1036429656.jpg','36124-070814091049-1036429656.jpg'),(346,'56302-240217094954-1036429656.jpg','56302-240217094954-1036429656.jpg','56302-240217094954-1036429656.jpg');
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemproperties`
--

DROP TABLE IF EXISTS `itemproperties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `itemproperties` (
  `itemId` int(11) NOT NULL,
  `propertyId` int(11) NOT NULL,
  `value` char(255) NOT NULL,
  PRIMARY KEY (`itemId`,`propertyId`),
  KEY `propertyId` (`propertyId`),
  CONSTRAINT `itemproperties_ibfk_1` FOREIGN KEY (`itemId`) REFERENCES `items` (`id`),
  CONSTRAINT `itemproperties_ibfk_2` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemproperties`
--

LOCK TABLES `itemproperties` WRITE;
/*!40000 ALTER TABLE `itemproperties` DISABLE KEYS */;
INSERT INTO `itemproperties` VALUES (344,12,'-3.2'),(344,13,'-9.6'),(344,14,'-22'),(344,15,'2 to 3 Season'),(344,16,'Mummy'),(344,17,'300T Ripstop Microfibre Polyester / Brushed 190T Microfibre Polyester'),(344,18,'Yes'),(344,19,'230 x 80cm'),(344,20,'1650g'),(344,21,'Right Hand'),(344,22,'250g/m? Double Layer 3D & 6D Hollowfibre'),(344,23,'Yes'),(344,24,'Synthetic'),(344,25,'42 x 23cm'),(344,26,'Yes'),(345,27,'26\"'),(345,28,'6061 aircraft grade hydroformed alloy frame'),(345,29,'Suntour XCT'),(345,30,'21'),(345,31,'Shimano EZ Fire'),(345,32,'24x34x42T triple chainset'),(345,33,'Mechanical Disc'),(345,34,'Double-wall alloy rims'),(345,35,'Steel'),(345,36,'Steel'),(345,37,'Unisex'),(346,12,'-50+50'),(346,15,'all'),(346,21,'left'),(346,37,'Womens'),(346,38,'2620'),(346,39,'65');
/*!40000 ALTER TABLE `itemproperties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemrates`
--

DROP TABLE IF EXISTS `itemrates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `itemrates` (
  `itemId` int(11) NOT NULL,
  `user` char(50) NOT NULL DEFAULT '',
  `rateDate` date NOT NULL,
  `rate` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`itemId`,`user`,`rateDate`),
  CONSTRAINT `itemrates_ibfk_1` FOREIGN KEY (`itemId`) REFERENCES `items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemrates`
--

LOCK TABLES `itemrates` WRITE;
/*!40000 ALTER TABLE `itemrates` DISABLE KEYS */;
INSERT INTO `itemrates` VALUES (344,'','2017-01-01',0.10),(345,'','2017-01-01',4.20),(346,'','2017-01-01',0.80),(347,'','2017-01-01',4.40),(348,'','2017-01-01',3.10),(386,'','2017-01-01',3.10),(387,'','2017-01-01',3.70),(388,'','2017-01-01',3.20),(389,'','2017-01-01',4.60),(390,'','2017-01-01',2.60),(391,'','2017-01-01',0.00),(391,'1','2017-01-01',3.00),(391,'2','2017-01-01',3.00),(391,'3','2017-01-01',3.00),(391,'4','2017-01-01',4.00),(391,'5','2017-01-01',4.00),(391,'6','2017-01-01',4.00),(391,'7','2017-01-01',4.00),(392,'','2017-01-01',2.90),(393,'','2017-01-01',4.90),(394,'','2017-01-01',1.40),(395,'','2017-01-01',2.00),(396,'','2017-01-01',4.90),(397,'','2017-01-01',3.90),(398,'','2017-01-01',2.20),(399,'','2017-01-01',2.00),(400,'','2017-01-01',1.30),(401,'','2017-01-01',3.40),(402,'','2017-01-01',2.30),(403,'','2017-01-01',1.50),(404,'','2017-01-01',0.70),(405,'','2017-01-01',4.70),(406,'','2017-01-01',0.10),(407,'','2017-01-01',0.60),(408,'','2017-01-01',1.40),(409,'','2017-01-01',1.30),(410,'','2017-01-01',0.10),(411,'','2017-01-01',2.30),(412,'','2017-01-01',2.10),(413,'','2017-01-01',4.10),(414,'','2017-01-01',3.20),(415,'','2017-01-01',2.50),(416,'','2017-01-01',3.70),(417,'','2017-01-01',2.10),(418,'','2017-01-01',0.80),(419,'','2017-01-01',3.20),(420,'','2017-01-01',1.10),(421,'','2017-01-01',0.60),(422,'','2017-01-01',5.00);
/*!40000 ALTER TABLE `itemrates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `mainImage` varchar(255) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `description` text,
  `shortDescription` text,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=423 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (344,'Pioneer 250 Sleeping Bag','38728-150115160149-791591112.jpg',42,'The Hi Gear Pioneer 250 Sleeping Bag combines a great balance of light weight and cosy warmth, giving you complete comfort and really good value for money.The insulation is a double layered 250g/m2 synthetic Hollowfibre which traps warm air close to the body, and will even perform well when damp. The ripstop outer fabric is soft yet durable, while the brushed polyester lining gives you great next to skin comfort. Neck and zip baffles help to eliminate drafts and cold spots, with the drawcord letting you close the hood around your head in colder conditions, whilst the full length zip allows you to ventilate the bag if you get too warm.Ideal for spring to autumn camping,  the Pioneer 250 has all the features you need to sleep in comfort in the outdoors - theres even a handy inner pocket to stash your phone/mp3 player.It also comes in its own stuff sack, compressing down easily to a decent pack size that wont take up much room, or weigh you down.','A great 2-3 season sleeping bag which is lightweight, with warm synthetic insulation'),(345,'Crag Mountain Bike','52282-2508161226461973763845.jpg',41,'The Calibre Crag Mountain Bike gives you great value XC performance with full Shimano shifting, mechanical disc brakes and Suntour suspension forks, with a fresh new livery for 2016. The frame itself is constructed from aerospace-grade 6061 aluminium, hydroformed for optimum trail ruggedness and precisely hand-welded at every join. The geometry is designed around the 26\"\" wheels for classic XC handling while modern touches like a slackened head angle bring things right up the minute with better handling on tougher trails. Suntour XCT forks provide 100mm of responsive, coil-sprung front suspension to keep you in control over rough terrain. Full Shimano shifting ensures an efficient drivetrain to keep you moving fast. A 24x34x42T triple chainset combines with a 7-speed rear derailleur for a huge range of 21 gears, each of which is easily, quickly, and smoothly accessible with the Shimano EZ-Fire shifters on your handlebars. Whatever the terrain throws at you, youll have a gear to handle it. When you do need to slow down, powerful mechanical disc brakes with 160mm rotors will provide the stopping power consistently and reliably every time. The bike rolls on 26\"\" wheels with durable double-wall alloy rims and hardwearing steel hubs. 26\"\" wheels are easier to control than bigger 27.5\"\" or 29\"\" wheels, making them great for newer mountain bikers who are still honing their skills. The wheels are shod with 2.1\"\" tyres with a fast and grippy tread for great versatility in varied conditions and terrain. In short, the Crag is like the Two.Two but even better. The frame has proven itself time and time again, impressing experts in the media and regular Go Outdoors customers alike. With a brand new spec and the same amazing value for money, the Crag is set for even bigger things.','A classic hardtail mountain bike which builds on the success of the award-winning Calibre Two.Two.'),(346,'Women\"\"s Sherpa 65 Rucksack','56302-2402170949541177228853.jpg',40,'A tough and functional Vango classic. the Womens Sherpa 65 backpack is versatile enough to adapt to your changing circumstances and load. keeping you comfortable as you walk.The Sherpa 65s adjustable. ventilated back system coupled with the shaped. adjustable harness lets you customise the fit as you move. and there are plenty of pocket and organisation options to help you stabilise your load for a less troublesome trek.','Ideal for DofE expeditions and longer stays away from home.'),(347,'2__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(348,'3__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',43,NULL,NULL),(386,'4__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(387,'5__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(388,'6__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(389,'7__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(390,'8__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(391,'9__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(392,'10__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(393,'11__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(394,'12__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(395,'13__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(396,'14__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(397,'15__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(398,'16__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(399,'17__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(400,'18__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(401,'19__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(402,'20__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(403,'21__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(404,'22__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(405,'23__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(406,'24__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(407,'25__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(408,'26__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(409,'27__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(410,'28__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(411,'29__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(412,'30__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(413,'31__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(414,'32__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(415,'33__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(416,'34__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(417,'35__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(418,'36__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(419,'37__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(420,'38__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(421,'39__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL),(422,'40__Pioneer 250 Sleeping Bag','52282-2508161226461973763845.jpg',42,NULL,NULL);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newitems`
--

DROP TABLE IF EXISTS `newitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `newitems` (
  `itemId` int(11) NOT NULL,
  PRIMARY KEY (`itemId`),
  CONSTRAINT `newitems_ibfk_1` FOREIGN KEY (`itemId`) REFERENCES `items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newitems`
--

LOCK TABLES `newitems` WRITE;
/*!40000 ALTER TABLE `newitems` DISABLE KEYS */;
INSERT INTO `newitems` VALUES (348),(394),(407),(412);
/*!40000 ALTER TABLE `newitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orderitems` (
  `orderId` int(11) DEFAULT NULL,
  `itemId` int(11) DEFAULT NULL,
  `sum` decimal(20,2) DEFAULT NULL,
  KEY `orderId` (`orderId`),
  KEY `itemId` (`itemId`),
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`),
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`itemId`) REFERENCES `items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitems`
--

LOCK TABLES `orderitems` WRITE;
/*!40000 ALTER TABLE `orderitems` DISABLE KEYS */;
/*!40000 ALTER TABLE `orderitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderDate` date NOT NULL,
  `user` char(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prices`
--

DROP TABLE IF EXISTS `prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prices` (
  `itemId` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `value` decimal(20,4) DEFAULT NULL,
  PRIMARY KEY (`itemId`,`startDate`),
  CONSTRAINT `prices_ibfk_1` FOREIGN KEY (`itemId`) REFERENCES `items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prices`
--

LOCK TABLES `prices` WRITE;
/*!40000 ALTER TABLE `prices` DISABLE KEYS */;
INSERT INTO `prices` VALUES (344,'2017-01-01',51.0000),(345,'2017-01-01',53.0000),(346,'2017-01-01',22.0000),(347,'2017-01-01',91.0000),(348,'2017-01-01',48.0000),(386,'2017-01-01',10.0000),(387,'2017-01-01',36.0000),(388,'2017-01-01',18.0000),(389,'2017-01-01',5.0000),(390,'2017-01-01',83.0000),(391,'2017-01-01',29.0000),(392,'2017-01-01',47.0000),(393,'2017-01-01',46.0000),(394,'2017-01-01',79.0000),(395,'2017-01-01',34.0000),(396,'2017-01-01',91.0000),(397,'2017-01-01',100.0000),(398,'2017-01-01',56.0000),(399,'2017-01-01',99.0000),(400,'2017-01-01',13.0000),(401,'2017-01-01',40.0000),(402,'2017-01-01',26.0000),(403,'2017-01-01',24.0000),(404,'2017-01-01',61.0000),(405,'2017-01-01',87.0000),(406,'2017-01-01',6.0000),(407,'2017-01-01',63.0000),(408,'2017-01-01',4.0000),(409,'2017-01-01',65.0000),(410,'2017-01-01',18.0000),(411,'2017-01-01',79.0000),(412,'2017-01-01',97.0000),(413,'2017-01-01',72.0000),(414,'2017-01-01',53.0000),(415,'2017-01-01',88.0000),(416,'2017-01-01',76.0000),(417,'2017-01-01',16.0000),(418,'2017-01-01',46.0000),(419,'2017-01-01',50.0000),(420,'2017-01-01',65.0000),(421,'2017-01-01',31.0000),(422,'2017-01-01',35.0000);
/*!40000 ALTER TABLE `prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `properties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(50) NOT NULL,
  `viewPriority` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (12,'Comfort Temperature',0),(13,'Limit Temperature',0),(14,'Extreme Temperature',0),(15,'Season',0),(16,'Shape',0),(17,'Shell Fabric',0),(18,'Stuff Sack',0),(19,'Unpacked Size',0),(20,'Weight',0),(21,'Zip Side',0),(22,'Fill Weight',0),(23,'Hood',0),(24,'Insulation Type',0),(25,'Packed Size',0),(26,'Draught Collar',0),(27,'Wheel Size',0),(28,'Frame',0),(29,'Fork',0),(30,'No. of Gears',0),(31,'Gear Shifters',0),(32,'Chainset',0),(33,'Brakes - Type',0),(34,'Rims',0),(35,'Front Hub',0),(36,'Rear Hub',0),(37,'Gender',0),(38,'Weight (g)',0),(39,'Volume (L)',0),(40,'Rear Hub',0);
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-05-19  9:37:52
