-- Enhanced University Management System Database
-- Additional tables and realistic data for g_universitaire

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Additional Tables for Enhanced Functionality
-- --------------------------------------------------------

--
-- Table structure for table `departements`
--

DROP TABLE IF EXISTS `departements`;
CREATE TABLE IF NOT EXISTS `departements` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `chef_departement_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departements_code_unique` (`code`),
  KEY `departements_chef_departement_id_foreign` (`chef_departement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departements`
--

INSERT INTO `departements` (`id`, `nom`, `code`, `description`, `chef_departement_id`, `created_at`, `updated_at`) VALUES
(1, 'Département Informatique', 'INFO', 'Département des sciences informatiques et technologies', 2, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(2, 'Département Réseaux', 'RESEAU', 'Département des réseaux et télécommunications', 3, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(3, 'Département IA & Data Science', 'IA', 'Département intelligence artificielle et science des données', 4, '2026-05-08 08:51:46', '2026-05-08 08:51:46');

-- --------------------------------------------------------

--
-- Add departement_id to filieres table
--

ALTER TABLE `filieres` ADD COLUMN `departement_id` bigint UNSIGNED AFTER `code`;
ALTER TABLE `filieres` ADD KEY `filieres_departement_id_foreign` (`departement_id`);

UPDATE `filieres` SET `departement_id` = 1 WHERE `id` IN (1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `annees_academiques`
--

DROP TABLE IF EXISTS `annees_academiques`;
CREATE TABLE IF NOT EXISTS `annees_academiques` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `annee` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `est_active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `annees_academiques_annee_unique` (`annee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `annees_academiques`
--

INSERT INTO `annees_academiques` (`id`, `annee`, `date_debut`, `date_fin`, `est_active`, `created_at`, `updated_at`) VALUES
(1, '2024-2025', '2024-09-01', '2025-07-31', 0, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(2, '2025-2026', '2025-09-01', '2026-07-31', 1, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(3, '2026-2027', '2026-09-01', '2027-07-31', 0, '2026-05-08 08:51:46', '2026-05-08 08:51:46');

-- --------------------------------------------------------

--
-- Add annee_academique_id to groupes table
--

ALTER TABLE `groupes` ADD COLUMN `annee_academique_id` bigint UNSIGNED AFTER `filiere_id`;
ALTER TABLE `groupes` ADD KEY `groupes_annee_academique_id_foreign` (`annee_academique_id`);

UPDATE `groupes` SET `annee_academique_id` = 2;

-- --------------------------------------------------------

--
-- Table structure for table `inscriptions`
--

DROP TABLE IF EXISTS `inscriptions`;
CREATE TABLE IF NOT EXISTS `inscriptions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` bigint UNSIGNED NOT NULL,
  `groupe_id` bigint UNSIGNED NOT NULL,
  `annee_academique_id` bigint UNSIGNED NOT NULL,
  `statut` enum('active','inactive','diplome','abandon') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `date_inscription` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `inscriptions_unique` (`student_id`, `groupe_id`, `annee_academique_id`),
  KEY `inscriptions_groupe_id_foreign` (`groupe_id`),
  KEY `inscriptions_annee_academique_id_foreign` (`annee_academique_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inscriptions`
--

INSERT INTO `inscriptions` (`id`, `student_id`, `groupe_id`, `annee_academique_id`, `statut`, `date_inscription`, `created_at`, `updated_at`) VALUES
(1, 5, 1, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(2, 6, 1, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(3, 7, 1, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(4, 8, 1, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(5, 9, 1, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(6, 10, 1, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(7, 11, 1, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(8, 12, 1, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(9, 13, 2, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(10, 14, 2, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(11, 15, 2, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(12, 16, 2, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(13, 17, 2, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(14, 18, 2, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(15, 19, 2, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(16, 20, 2, 2, 'active', '2025-09-01', '2026-05-08 08:51:46', '2026-05-08 08:51:46');

-- --------------------------------------------------------

--
-- Table structure for table `matieres` (Detailed course content)
--

DROP TABLE IF EXISTS `matieres`;
CREATE TABLE IF NOT EXISTS `matieres` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `module_id` bigint UNSIGNED NOT NULL,
  `titre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `volume_horaire` int NOT NULL DEFAULT '0',
  `ordre` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `matieres_module_id_foreign` (`module_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `matieres`
--

INSERT INTO `matieres` (`id`, `module_id`, `titre`, `description`, `volume_horaire`, `ordre`, `created_at`, `updated_at`) VALUES
(1, 1, 'Introduction à Laravel', 'Présentation du framework Laravel et son écosystème', 4, 1, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(2, 1, 'Architecture MVC', 'Modèle-Vue-Contrôleur dans Laravel', 6, 2, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(3, 1, 'Eloquent ORM', 'Manipulation de base de données avec Eloquent', 8, 3, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(4, 1, 'API RESTful', 'Création d\'APIs REST avec Laravel', 6, 4, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(5, 2, 'Fondamentaux des réseaux', 'Concepts de base des réseaux informatiques', 4, 1, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(6, 2, 'Protocoles TCP/IP', 'Étude détaillée des protocoles Internet', 8, 2, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(7, 2, 'Routage dynamique', 'OSPF, EIGRP et BGP', 6, 3, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(8, 2, 'Sécurité réseau', 'Firewalls, VPN et sécurité', 6, 4, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(9, 3, 'Introduction au Machine Learning', 'Concepts fondamentaux du ML', 4, 1, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(10, 3, 'Algorithmes supervisés', 'Régression, classification, arbres de décision', 8, 2, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(11, 3, 'Réseaux de neurones', 'Deep Learning et CNN', 8, 3, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(12, 3, 'Traitement du langage naturel', 'NLP et applications', 6, 4, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(13, 4, 'Introduction à l\'IoT', 'Concepts et architectures IoT', 4, 1, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(14, 4, 'Capteurs et actionneurs', 'Types et utilisation des capteurs', 6, 2, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(15, 4, 'Communication sans fil', 'Protocoles Zigbee, LoRa, MQTT', 8, 3, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(16, 4, 'Plateformes IoT', 'Arduino, Raspberry Pi, ESP32', 6, 4, '2026-05-08 08:51:46', '2026-05-08 08:51:46');

-- --------------------------------------------------------

--
-- Table structure for table `presences` (Attendance tracking)
--

DROP TABLE IF EXISTS `presences`;
CREATE TABLE IF NOT EXISTS `presences` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `cahier_texte_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `statut` enum('present','absent','retard','excuse') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'present',
  `heure_arrivee` time DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `presences_unique` (`cahier_texte_id`, `student_id`),
  KEY `presences_student_id_foreign` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `presences`
--

INSERT INTO `presences` (`id`, `cahier_texte_id`, `student_id`, `statut`, `heure_arrivee`, `created_at`, `updated_at`) VALUES
(1, 1, 5, 'present', '08:25:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(2, 1, 6, 'present', '08:28:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(3, 1, 7, 'retard', '08:45:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(4, 1, 8, 'present', '08:20:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(5, 1, 9, 'absent', NULL, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(6, 1, 10, 'present', '08:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(7, 1, 11, 'present', '08:27:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(8, 1, 12, 'present', '08:29:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(9, 2, 13, 'present', '08:25:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(10, 2, 14, 'present', '08:28:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(11, 2, 15, 'absent', NULL, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(12, 2, 16, 'present', '08:22:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(13, 2, 17, 'retard', '08:50:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(14, 2, 18, 'present', '08:26:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(15, 2, 19, 'present', '08:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(16, 2, 20, 'present', '08:24:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52');

-- --------------------------------------------------------

--
-- Table structure for table `devoirs` (Assignments/Homework)
--

DROP TABLE IF EXISTS `devoirs`;
CREATE TABLE IF NOT EXISTS `devoirs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `module_id` bigint UNSIGNED NOT NULL,
  `prof_id` bigint UNSIGNED NOT NULL,
  `titre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `date_publication` date NOT NULL,
  `date_limite` date NOT NULL,
  `coefficient` decimal(3,2) NOT NULL DEFAULT '1.00',
  `type` enum('TD','TP','Projet','Examen') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TD',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `devoirs_module_id_foreign` (`module_id`),
  KEY `devoirs_prof_id_foreign` (`prof_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `devoirs`
--

INSERT INTO `devoirs` (`id`, `module_id`, `prof_id`, `titre`, `description`, `date_publication`, `date_limite`, `coefficient`, `type`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'TP1 - Installation Laravel', 'Installation et configuration de Laravel', '2026-04-15', '2026-04-22', 1.00, 'TP', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(2, 1, 2, 'TD1 - Routes et Contrôleurs', 'Exercices sur les routes et contrôleurs', '2026-04-20', '2026-04-27', 1.00, 'TD', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(3, 1, 2, 'Projet - Application CRUD', 'Création d\'une application CRUD complète', '2026-05-01', '2026-05-20', 2.00, 'Projet', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(4, 2, 3, 'TP1 - Configuration Cisco', 'Configuration de routeurs Cisco', '2026-04-18', '2026-04-25', 1.00, 'TP', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(5, 2, 3, 'TD1 - Calculs de sous-réseaux', 'Exercices de subnetting', '2026-04-22', '2026-04-29', 1.00, 'TD', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(6, 3, 4, 'TP1 - Introduction Python ML', 'Premiers pas avec scikit-learn', '2026-04-16', '2026-04-23', 1.00, 'TP', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(7, 3, 4, 'Projet - Classification d\'images', 'Projet de classification avec CNN', '2026-05-05', '2026-05-25', 2.50, 'Projet', '2026-05-08 08:51:52', '2026-05-08 08:51:52');

-- --------------------------------------------------------

--
-- Table structure for table `rendus_devoirs` (Assignment submissions)
--

DROP TABLE IF EXISTS `rendus_devoirs`;
CREATE TABLE IF NOT EXISTS `rendus_devoirs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `devoir_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `note` decimal(5,2) DEFAULT NULL,
  `commentaire` text COLLATE utf8mb4_unicode_ci,
  `file_path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_rendu` datetime DEFAULT NULL,
  `statut` enum('en_attente','rendu','corrige','en_retard') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rendus_devoirs_unique` (`devoir_id`, `student_id`),
  KEY `rendus_devoirs_student_id_foreign` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rendus_devoirs`
--

INSERT INTO `rendus_devoirs` (`id`, `devoir_id`, `student_id`, `note`, `commentaire`, `file_path`, `date_rendu`, `statut`, `created_at`, `updated_at`) VALUES
(1, 1, 5, 15.00, 'Bon travail', '/rendus/tp1_youssef.zip', '2026-04-21 14:30:00', 'corrige', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(2, 1, 6, 17.50, 'Excellent', '/rendus/tp1_amina.zip', '2026-04-21 16:45:00', 'corrige', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(3, 1, 7, 12.00, 'À améliorer', '/rendus/tp1_omar.zip', '2026-04-22 10:00:00', 'corrige', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(4, 2, 5, 14.00, NULL, '/rendus/td1_youssef.pdf', '2026-04-26 18:20:00', 'corrige', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(5, 2, 6, 16.50, 'Très bien', '/rendus/td1_amina.pdf', '2026-04-26 20:15:00', 'corrige', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(6, 3, 5, NULL, NULL, NULL, NULL, 'en_attente', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(7, 3, 6, NULL, NULL, NULL, NULL, 'en_attente', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(8, 4, 13, 13.00, 'Correct', '/rendus/tp1_rachid.zip', '2026-04-24 15:30:00', 'corrige', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(9, 4, 14, 16.00, 'Bien', '/rendus/tp1_leila.zip', '2026-04-24 17:00:00', 'corrige', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(10, 5, 13, 11.50, NULL, '/rendus/td1_rachid.pdf', '2026-04-28 22:30:00', 'en_retard', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(11, 5, 14, 15.00, 'Bon', '/rendus/td1_leila.pdf', '2026-04-28 19:45:00', 'corrige', '2026-05-08 08:51:52', '2026-05-08 08:51:52');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `titre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `est_lue` tinyint(1) NOT NULL DEFAULT '0',
  `data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `titre`, `message`, `type`, `est_lue`, `data`, `created_at`, `updated_at`) VALUES
(1, 5, 'Nouvelle note publiée', 'Votre note pour le module Technologie Web 2 a été publiée', 'note', 1, '{"module_id": 1, "note": 12.67}', '2026-05-08 09:00:00', '2026-05-08 10:30:00'),
(2, 5, 'Absence enregistrée', 'Une absence a été enregistrée pour le 06/05/2026', 'absence', 1, '{"date": "2026-05-06"}', '2026-05-08 09:15:00', '2026-05-08 11:00:00'),
(3, 6, 'Devoir à rendre', 'Le projet Application CRUD doit être rendu avant le 20/05/2026', 'devoir', 0, '{"devoir_id": 3, "date_limite": "2026-05-20"}', '2026-05-10 08:00:00', '2026-05-10 08:00:00'),
(4, 2, 'Nouvelle demande administrative', 'Youssef Alami a soumis une demande d\'attestation de scolarité', 'demande_admin', 0, '{"demande_id": 1, "user_id": 5}', '2026-05-08 08:52:00', '2026-05-08 08:52:00'),
(5, 13, 'Note publiée', 'Votre note pour le module Réseaux Informatiques a été publiée', 'note', 1, '{"module_id": 2, "note": 10.33}', '2026-05-08 09:30:00', '2026-05-08 12:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `evenements` (Events/Calendar)
--

DROP TABLE IF EXISTS `evenements`;
CREATE TABLE IF NOT EXISTS `evenements` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `titre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `date_debut` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `lieu` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('examen','reunion','conference','vacances','autre') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'autre',
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `evenements_created_by_foreign` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `evenements`
--

INSERT INTO `evenements` (`id`, `titre`, `description`, `date_debut`, `date_fin`, `lieu`, `type`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Examen Final - Technologie Web 2', 'Examen final du module Technologie Web 2', '2026-06-15 09:00:00', '2026-06-15 11:00:00', 'Amphi A', 'examen', 2, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(2, 'Examen Final - Réseaux Informatiques', 'Examen final du module Réseaux Informatiques', '2026-06-16 09:00:00', '2026-06-16 11:00:00', 'Salle 101', 'examen', 3, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(3, 'Examen Final - Intelligence Artificielle', 'Examen final du module Intelligence Artificielle', '2026-06-17 14:00:00', '2026-06-17 16:00:00', 'Labo Info 1', 'examen', 4, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(4, 'Réunion Département Informatique', 'Réunion mensuelle du département', '2026-05-20 10:00:00', '2026-05-20 12:00:00', 'Salle de réunion A', 'reunion', 1, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(5, 'Conférence IA et Éthique', 'Conférence sur l\'éthique en intelligence artificielle', '2026-05-25 14:00:00', '2026-05-25 17:00:00', 'Amphi A', 'conference', 4, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(6, 'Vacances d\'été', 'Période de vacances estivales', '2026-07-01 00:00:00', '2026-08-31 23:59:59', NULL, 'vacances', 1, '2026-05-08 08:51:52', '2026-05-08 08:51:52');

-- --------------------------------------------------------

--
-- Table structure for table `ressources_pedagogiques` (Learning resources)
--

DROP TABLE IF EXISTS `ressources_pedagogiques`;
CREATE TABLE IF NOT EXISTS `ressources_pedagogiques` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `module_id` bigint UNSIGNED NOT NULL,
  `titre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('video','livre','article','site_web','outil') COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ressources_pedagogiques_module_id_foreign` (`module_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ressources_pedagogiques`
--

INSERT INTO `ressources_pedagogiques` (`id`, `module_id`, `titre`, `type`, `url`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 'Documentation officielle Laravel', 'site_web', 'https://laravel.com/docs', 'Documentation complète de Laravel', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(2, 1, 'Laracasts - Tutoriels vidéo', 'video', 'https://laracasts.com', 'Tutoriels vidéo pour apprendre Laravel', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(3, 2, 'Cisco Networking Academy', 'site_web', 'https://www.netacad.com', 'Cours officiels Cisco', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(4, 2, 'Wireshark - Analyse de paquets', 'outil', 'https://www.wireshark.org', 'Outil d\'analyse de réseau', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(5, 3, 'Coursera - Machine Learning', 'video', 'https://www.coursera.org/learn/machine-learning', 'Cours de Andrew Ng sur le ML', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(6, 3, 'TensorFlow Documentation', 'site_web', 'https://www.tensorflow.org', 'Documentation TensorFlow', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(7, 4, 'Arduino Project Hub', 'site_web', 'https://create.arduino.cc/projecthub', 'Projets Arduino inspirants', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(8, 4, 'MQTT Essentials', 'article', 'https://www.hivemq.com/mqtt-essentials/', 'Guide complet sur MQTT', '2026-05-08 08:51:52', '2026-05-08 08:51:52');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks` (Course feedback)
--

DROP TABLE IF EXISTS `feedbacks`;
CREATE TABLE IF NOT EXISTS `feedbacks` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `module_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `rating` int NOT NULL,
  `commentaire` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `feedbacks_unique` (`module_id`, `student_id`),
  KEY `feedbacks_student_id_foreign` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `module_id`, `student_id`, `rating`, `commentaire`, `created_at`, `updated_at`) VALUES
(1, 1, 5, 5, 'Excellent cours, très pratique', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(2, 1, 6, 4, 'Très bon contenu', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(3, 2, 13, 4, 'Cours intéressant mais rythme rapide', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(4, 3, 5, 5, 'Passionnant!', '2026-05-08 08:51:52', '2026-05-08 08:51:52');

-- --------------------------------------------------------

--
-- Add additional fields to users table for more realistic profiles
--

ALTER TABLE `users` 
ADD COLUMN `telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `email`,
ADD COLUMN `adresse` text COLLATE utf8mb4_unicode_ci AFTER `telephone`,
ADD COLUMN `date_naissance` date DEFAULT NULL AFTER `adresse`,
ADD COLUMN `photo_profile` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `date_naissance`,
ADD COLUMN `biographie` text COLLATE utf8mb4_unicode_ci AFTER `photo_profile`,
ADD COLUMN `specialite` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `biographie`;

-- Update users with additional information
UPDATE `users` SET 
  `telephone` = '+212 6 12 34 56 78',
  `adresse` = 'Rue 1, Quartier Hassan, Rabat',
  `date_naissance` = '1980-03-15',
  `photo_profile` = '/profiles/admin.jpg',
  `biographie` = 'Administrateur principal de l\'université',
  `specialite` = 'Administration'
WHERE `id` = 1;

UPDATE `users` SET 
  `telephone` = '+212 6 23 45 67 89',
  `adresse` = 'Avenue Mohammed V, Rabat',
  `date_naissance` = '1975-07-22',
  `photo_profile` = '/profiles/bennani.jpg',
  `biographie` = 'Professeur spécialisé en développement web et frameworks PHP',
  `specialite` = 'Développement Web'
WHERE `id` = 2;

UPDATE `users` SET 
  `telephone` = '+212 6 34 56 78 90',
  `adresse` = 'Boulevard Al Massira, Salé',
  `date_naissance` = '1978-11-08',
  `photo_profile` = '/profiles/idrissi.jpg',
  `biographie` = 'Experte en réseaux informatiques et sécurité',
  `specialite` = 'Réseaux et Sécurité'
WHERE `id` = 3;

UPDATE `users` SET 
  `telephone` = '+212 6 45 67 89 01',
  `adresse` = 'Rue Ibn Sina, Agdal, Rabat',
  `date_naissance` = '1982-05-30',
  `photo_profile` = '/profiles/tazi.jpg',
  `biographie` = 'Chercheur en intelligence artificielle et machine learning',
  `specialite` = 'Intelligence Artificielle'
WHERE `id` = 4;

UPDATE `users` SET 
  `telephone` = '+212 6 56 78 90 12',
  `adresse` = 'Hay Riad, Rabat',
  `date_naissance` = '2003-01-15',
  `photo_profile` = '/profiles/alami.jpg'
WHERE `id` = 5;

UPDATE `users` SET 
  `telephone` = '+212 6 67 89 01 23',
  `adresse` = 'Agdal, Rabat',
  `date_naissance` = '2003-04-20',
  `photo_profile` = '/profiles/benkirane.jpg'
WHERE `id` = 6;

UPDATE `users` SET 
  `telephone` = '+212 6 78 90 12 34',
  `adresse` = 'Hassan, Rabat',
  `date_naissance` = '2002-09-10',
  `photo_profile` = '/profiles/chaoui.jpg'
WHERE `id` = 7;

UPDATE `users` SET 
  `telephone` = '+212 6 89 01 23 45',
  `adresse` = 'Ocean, Rabat',
  `date_naissance` = '2003-06-25',
  `photo_profile` = '/profiles/derraj.jpg'
WHERE `id` = 8;

-- --------------------------------------------------------

--
-- Add code field to modules table
--

ALTER TABLE `modules` ADD COLUMN `code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `nom`;
ALTER TABLE `modules` ADD UNIQUE KEY `modules_code_unique` (`code`);

UPDATE `modules` SET `code` = 'TW2' WHERE `id` = 1;
UPDATE `modules` SET `code` = 'RI' WHERE `id` = 2;
UPDATE `modules` SET `code` = 'IA' WHERE `id` = 3;
UPDATE `modules` SET `code` = 'IOT' WHERE `id` = 4;

-- --------------------------------------------------------

--
-- Add description and volume_horaire to modules table
--

ALTER TABLE `modules` 
ADD COLUMN `description` text COLLATE utf8mb4_unicode_ci AFTER `code`,
ADD COLUMN `volume_horaire_total` int NOT NULL DEFAULT '0' AFTER `description`,
ADD COLUMN `credits` int NOT NULL DEFAULT '0' AFTER `volume_horaire_total`,
ADD COLUMN `semestre` int NOT NULL DEFAULT '1' AFTER `credits`;

UPDATE `modules` SET 
  `description` = 'Développement web avancé avec Laravel, API REST, et architecture MVC',
  `volume_horaire_total` = 45,
  `credits` = 6,
  `semestre` = 5
WHERE `id` = 1;

UPDATE `modules` SET 
  `description` = 'Réseaux informatiques, protocoles TCP/IP, routage et sécurité',
  `volume_horaire_total` = 40,
  `credits` = 5,
  `semestre` = 5
WHERE `id` = 2;

UPDATE `modules` SET 
  `description` = 'Intelligence artificielle, machine learning et deep learning',
  `volume_horaire_total` = 50,
  `credits` = 6,
  `semestre` = 6
WHERE `id` = 3;

UPDATE `modules` SET 
  `description` = 'Internet des objets, capteurs, communication sans fil et plateformes IoT',
  `volume_horaire_total` = 40,
  `credits` = 5,
  `semestre` = 6
WHERE `id` = 4;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
