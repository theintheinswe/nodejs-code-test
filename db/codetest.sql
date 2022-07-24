/*
SQLyog Community v13.1.9 (64 bit)
MySQL - 8.0.20 : Database - codetest
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`codetest` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `codetest`;

/*Table structure for table `customer` */

DROP TABLE IF EXISTS `customer`;

CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `customer_name` varchar(50) DEFAULT NULL,
  `customer_phone` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `customer` */

insert  into `customer`(`id`,`customer_email`,`customer_name`,`customer_phone`) values 
(1,'customer@gmail.com','Customer',1234567894);

/*Table structure for table `evoucher` */

DROP TABLE IF EXISTS `evoucher`;

CREATE TABLE `evoucher` (
  `evoucher_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` mediumtext,
  `expiry_date` datetime DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `amount` double(10,2) DEFAULT NULL,
  `payment_method_id` int DEFAULT NULL,
  `payment_status` enum('Paid','Unpaid','Cancel') CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT 'Unpaid',
  `discount` double(10,2) DEFAULT NULL,
  `quantity` double(10,2) DEFAULT NULL,
  `qr_code_image` varchar(255) DEFAULT NULL,
  `promo_code` varchar(50) DEFAULT NULL,
  `max_limit` double(10,2) DEFAULT NULL,
  `user_limit` double(10,2) DEFAULT NULL,
  `buy_type` enum('Onlyme','Others') DEFAULT NULL,
  `status` enum('Active','Inactive') CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT 'Active' COMMENT 'Active = Unused, Inactive = Used',
  PRIMARY KEY (`evoucher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `evoucher` */

insert  into `evoucher`(`evoucher_id`,`customer_id`,`title`,`description`,`expiry_date`,`image`,`amount`,`payment_method_id`,`payment_status`,`discount`,`quantity`,`qr_code_image`,`promo_code`,`max_limit`,`user_limit`,`buy_type`,`status`) values 
(1,1,'Voucher1','Testing','2022-07-23 23:58:03','',100.00,NULL,'Unpaid',10.00,5.00,NULL,NULL,5.00,NULL,'Onlyme','Active'),
(2,1,'Voucher2','Testing','2022-07-23 23:58:03','',100.00,NULL,'Unpaid',10.00,5.00,NULL,NULL,5.00,NULL,'Onlyme','Active'),
(3,1,'Voucher3','Testing','2022-07-26 23:58:03','',100.00,1,'Paid',10.00,5.00,'/images/qr_code_image','1234asdf',5.00,2.00,'Others','Inactive');

/*Table structure for table `payment_methods` */

DROP TABLE IF EXISTS `payment_methods`;

CREATE TABLE `payment_methods` (
  `payment_method_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`payment_method_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `payment_methods` */

insert  into `payment_methods`(`payment_method_id`,`name`) values 
(1,'Visa'),
(2,'Mastercard ');

/*Table structure for table `sessions` */

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sessions` */

insert  into `sessions`(`session_id`,`expires`,`data`) values 
('-xSBIhHfJab5d6_Vg3LRYxbhRJI_xisj',1658646433,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"name\":\"testing@gmail.com\"}}');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
