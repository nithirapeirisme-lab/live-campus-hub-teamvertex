-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: vertex-db-vertexdb.f.aivencloud.com    Database: myprojectdb
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '04572f40-1f6e-11f1-8ec9-56aa9e09392e:1-27,
1fa10bba-1f6f-11f1-acc5-de0703da70fe:1-16,
5211c8db-45fb-11f1-9add-a61e8ad99445:1-441';

--
-- Table structure for table `bus`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus` (
  `arrival_time` datetime(6) NOT NULL,
  `departure_time` datetime(6) NOT NULL,
  `arrival` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `bus_id` varchar(255) NOT NULL,
  `bus_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `departure` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` enum('ARRIVED','CANCELLED','DELAYED','ON_TIME') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`bus_id`),
  UNIQUE KEY `unique_bus_id` (`bus_id`),
  UNIQUE KEY `unique_bus_number` (`bus_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus`
--

LOCK TABLES `bus` WRITE;
/*!40000 ALTER TABLE `bus` DISABLE KEYS */;
INSERT INTO `bus` VALUES ('2026-04-07 14:30:00.000000','2026-04-07 10:30:00.000000','MALABE','BUS_002','BC-8062','GAMPAHA','ON_TIME');
/*!40000 ALTER TABLE `bus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `check_in`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `check_in` (
  `check_in_time` datetime(6) NOT NULL,
  `checkin_id` varchar(255) NOT NULL,
  `location_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `student_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`checkin_id`),
  UNIQUE KEY `unique_checkin_id` (`checkin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `check_in`
--

LOCK TABLES `check_in` WRITE;
/*!40000 ALTER TABLE `check_in` DISABLE KEYS */;
INSERT INTO `check_in` VALUES ('2026-05-21 03:06:20.806549','checkin_d5f0832a-5a36-4325-ad7f-6e6619b958b7','LIB_MAIN','STU_014'),('2026-05-18 23:20:50.959847','checkin_e01413a7-57cf-432a-96a9-8ad09518f955','MAIN_CANTEEN','STU_008');
/*!40000 ALTER TABLE `check_in` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clubs`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubs` (
  `status` bit(1) NOT NULL,
  `club_id` varchar(255) NOT NULL,
  `club_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`club_id`),
  UNIQUE KEY `unique_club_id` (`club_id`),
  UNIQUE KEY `unique_club_name` (`club_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubs`
--

LOCK TABLES `clubs` WRITE;
/*!40000 ALTER TABLE `clubs` DISABLE KEYS */;
INSERT INTO `clubs` VALUES (_binary '','club_32e54ad6-922a-449e-9326-8883a424f5e3','Sports Club'),(_binary '','club_3fca2fdd-af45-4234-896e-ac4addfda784','Badminton Club');
/*!40000 ALTER TABLE `clubs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `department_id` varchar(255) NOT NULL,
  `department_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `unique_department_id` (`department_id`),
  UNIQUE KEY `unique_department_name` (`department_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES ('D002','Computing'),('D003','Health Science'),('D001','Management');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_date` date NOT NULL,
  `event_time` time NOT NULL,
  `event_id` varchar(255) NOT NULL,
  `event_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `club_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `location_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`event_id`),
  UNIQUE KEY `unique_event_id` (`event_id`),
  UNIQUE KEY `unique_event_title` (`event_title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES ('2026-10-30','10:30:00','event_603d6b09-2a79-4baa-b94c-a78e35a3c7fa','Chess Battle','Chess Club','Canteen'),('2023-04-15','10:00:00','event_91ad10bb-b82a-4bff-9977-e39f925f04d0','Padura','Leo Club','Car Park');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `capacity` int NOT NULL,
  `location_id` varchar(255) NOT NULL,
  `location_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`location_id`),
  UNIQUE KEY `unique_location_id` (`location_id`),
  UNIQUE KEY `unique_location_name` (`location_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (2000,'CAR_PARK','Car Park'),(500,'GYM_01','Gym'),(1000,'LIB_MAIN','Main Library'),(1500,'MAIN_CANTEEN','Main Cafetaria');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rewards`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rewards` (
  `reward_id` varchar(255) NOT NULL,
  `reward_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `discount_percentage` int NOT NULL,
  `reward_points` int NOT NULL,
  PRIMARY KEY (`reward_id`),
  UNIQUE KEY `unique_reward_id` (`reward_id`),
  UNIQUE KEY `unique_reward_name` (`reward_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rewards`
--

LOCK TABLES `rewards` WRITE;
/*!40000 ALTER TABLE `rewards` DISABLE KEYS */;
INSERT INTO `rewards` VALUES ('DISC_1','25% discount',25,1080),('DISC_15','15% discount',15,1500),('DISC_2','80% discount',80,500),('DISC_3','20% discount',20,550);
/*!40000 ALTER TABLE `rewards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `is_admin` bit(1) NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `profile_image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `staff_id` varchar(255) NOT NULL,
  `staff_pwd` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`staff_id`),
  UNIQUE KEY `unique_staff_id` (`staff_id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (_binary '','charuka.hashen@gmail.com','Hashen','Charuka',NULL,'STF_001','$2a$10$VyHTA44ki/rKhbEmas5v3OtR1ILEuhtm5MHh/QK759YF6p0bXJeIK'),(_binary '','pamudisasaara@gmail.com','Sasaara','Pamudi',NULL,'STF_002','$2a$10$UoVoYtJICnuE6VI52LSATuagyKmtJKF1EVwHr4QHndBh9pLPWNDIO'),(_binary '','dularikanchana@gmail.com','Dulari','Kanchana',NULL,'STF_003','STF_6521'),(_binary '','malith@gmail.com','','',NULL,'STF_040','$2a$10$4o9NnhbpquHGnPZFdYDlOerYCWB/OYn4dSRaUAW68Cco5SFUU1kHy'),(_binary '','namal@gmail.com','Namal','Udugama',NULL,'STF_042','$2a$10$Vr4m1miIO46yV8S2u73RruXSyFAj6EMoOei0O1GDV2nUY2z36Lw2S'),(_binary '','mahinda@gmail.com','','',NULL,'STF_043','$2a$10$94oySSYUi.n.N93uollM7eVYq3iTUjrnBy/yoidUO4BwF5tceCrka');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_reward`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_reward` (
  `earned_date` date NOT NULL,
  `is_redeemed` bit(1) NOT NULL,
  `redeemed_date` date NOT NULL,
  `reward_id` varchar(255) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `points` decimal(38,2) DEFAULT NULL,
  PRIMARY KEY (`reward_id`,`student_id`),
  KEY `FK5op2r1gf3mj4qte6ub01bo7u` (`student_id`),
  CONSTRAINT `FK40n14fbqna30mm6urjr6shev8` FOREIGN KEY (`reward_id`) REFERENCES `rewards` (`reward_id`),
  CONSTRAINT `FK5op2r1gf3mj4qte6ub01bo7u` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_reward`
--

LOCK TABLES `student_reward` WRITE;
/*!40000 ALTER TABLE `student_reward` DISABLE KEYS */;
INSERT INTO `student_reward` VALUES ('2026-05-01',_binary '','2026-05-09','DISC_1','STU_006',1080.00),('2026-05-01',_binary '','2026-05-09','DISC_1','STU_014',1080.00),('2026-05-05',_binary '','2026-05-09','DISC_2','STU_008',500.00),('2026-05-09',_binary '','2026-05-09','DISC_3','STU_007',550.00),('2026-05-07',_binary '','2026-05-09','DISC_3','STU_013',550.00);
/*!40000 ALTER TABLE `student_reward` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `points` decimal(38,2) DEFAULT NULL,
  `department_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `enrolled_year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `profile_image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `student_id` varchar(255) NOT NULL,
  `student_pwd` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `unique_student_id` (`student_id`),
  UNIQUE KEY `unique_email` (`email`),
  UNIQUE KEY `unique_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (NULL,'D002','nimashak@gmail.com','2025','Nimasha','Kalhari','0715472527',NULL,'STU_001','$2a$10$I/C3p0Pc1Trnf1mfJWR.FeQ9VmYrDllxNERS0javK5AV27ZbcR7tq'),(NULL,'D005','nithira@gmail.com','2025','Nithira','Peiris','071768870',NULL,'STU_006','$2a$10$sGGZjvXz0frV5/yr7nakXuM0VXvrp0KgVvHk8581CQR5pFULscSoO'),(NULL,'D004','Malmi@gmail.com','2020','Malmi','Manora','076520493',NULL,'STU_007','$2a$10$pR5hrGnT6fob30Q0OJnq8em5ZxpD8g5ygFQZezWrBZgEsqcZ/gxDq'),(5.00,'D005','champajayasinghe@gmail.com','2025','Medha','Munasinghe','0714568012',NULL,'STU_008','$2a$10$/zAHX0cw2PiB1KRzwODBLeQcXmkvI51J43C8bb4FLaBRLVgwQBrD.'),(NULL,'D001','charukahashen@gmail.com','2023','Hashen','Charuka','0722129599',NULL,'STU_013','$2a$10$90Z6xEBlIn.F9PMeGkBEW.yzqd22pQf4eKSFAGuhT/zlSGlCkpgDy'),(0.00,'D004','dularik@gmail.com','2023','Dulari','Kanchana','0728942731',NULL,'STU_014','$2a$10$QQAXbebXWDgTu1JA.0/K.eqth/u06hcSGhwEacAlg.hgWxj3lSCHa'),(NULL,'D002','himal@gmail.com','2025','','','0746394741',NULL,'STU_030','$2a$10$n3jdyxbRVVevlMqKakNDBObSLP3dGtNy6A19KbTmWHO3egtDUovlq');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students_club`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students_club` (
  `active_status` bit(1) NOT NULL,
  `joined_date` date NOT NULL,
  `club_id` varchar(255) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  PRIMARY KEY (`club_id`,`student_id`),
  KEY `FKc5s6aa00w8wfj0i258n1o4hbe` (`student_id`),
  CONSTRAINT `FK3he1fdtkg6pbmocjkkmj1fjeh` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`club_id`),
  CONSTRAINT `FKc5s6aa00w8wfj0i258n1o4hbe` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students_club`
--

LOCK TABLES `students_club` WRITE;
/*!40000 ALTER TABLE `students_club` DISABLE KEYS */;
INSERT INTO `students_club` VALUES (_binary '','2026-05-21','club_32e54ad6-922a-449e-9326-8883a424f5e3','STU_008'),(_binary '','2026-05-21','club_3fca2fdd-af45-4234-896e-ac4addfda784','STU_008');
/*!40000 ALTER TABLE `students_club` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'myprojectdb'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-23  6:58:04
