-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 11, 2026 at 09:46 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `g_universitaire`
--

-- --------------------------------------------------------

--
-- Table structure for table `absences`
--

DROP TABLE IF EXISTS `absences`;
CREATE TABLE IF NOT EXISTS `absences` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` bigint UNSIGNED NOT NULL,
  `module_id` bigint UNSIGNED NOT NULL,
  `date_absence` date NOT NULL,
  `seance_debut` time NOT NULL,
  `seance_fin` time NOT NULL,
  `est_justifie` tinyint(1) NOT NULL DEFAULT '0',
  `justification_file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statut_justification` enum('pending','validated','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `motif_rejet` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `absences_student_id_foreign` (`student_id`),
  KEY `absences_module_id_foreign` (`module_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `absences`
--

INSERT INTO `absences` (`id`, `student_id`, `module_id`, `date_absence`, `seance_debut`, `seance_fin`, `est_justifie`, `justification_file`, `statut_justification`, `motif_rejet`, `created_at`, `updated_at`) VALUES
(1, 5, 1, '2026-05-06', '08:30:00', '10:30:00', 1, NULL, 'validated', NULL, '2026-05-08 08:51:52', NULL),
(2, 5, 2, '2026-05-03', '10:30:00', '12:30:00', 0, NULL, 'pending', NULL, '2026-05-08 08:51:52', NULL),
(3, 6, 3, '2026-04-29', '14:00:00', '16:00:00', 0, NULL, 'pending', NULL, '2026-05-08 08:51:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cahier_textes`
--

DROP TABLE IF EXISTS `cahier_textes`;
CREATE TABLE IF NOT EXISTS `cahier_textes` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `prof_id` bigint UNSIGNED NOT NULL,
  `module_id` bigint UNSIGNED NOT NULL,
  `groupe_id` bigint UNSIGNED NOT NULL,
  `date_seance` date NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL,
  `objectif` text COLLATE utf8mb4_unicode_ci,
  `nature` enum('Cours','TD','TP') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cahier_textes_prof_id_foreign` (`prof_id`),
  KEY `cahier_textes_module_id_foreign` (`module_id`),
  KEY `cahier_textes_groupe_id_foreign` (`groupe_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cahier_textes`
--

INSERT INTO `cahier_textes` (`id`, `prof_id`, `module_id`, `groupe_id`, `date_seance`, `heure_debut`, `heure_fin`, `objectif`, `nature`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 1, '2026-05-06', '08:30:00', '10:30:00', 'Introduction à Laravel et architecture MVC. Routes, contrôleurs et vues.', 'Cours', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(2, 3, 2, 2, '2026-05-07', '08:30:00', '10:30:00', 'Configuration routeurs Cisco. Protocoles OSPF et EIGRP.', 'TP', '2026-05-08 08:51:52', '2026-05-08 08:51:52');

-- --------------------------------------------------------

--
-- Table structure for table `classroom_annonces`
--

DROP TABLE IF EXISTS `classroom_annonces`;
CREATE TABLE IF NOT EXISTS `classroom_annonces` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `module_id` bigint UNSIGNED NOT NULL,
  `prof_id` bigint UNSIGNED NOT NULL,
  `titre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contenu` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `classroom_annonces_module_id_foreign` (`module_id`),
  KEY `classroom_annonces_prof_id_foreign` (`prof_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classroom_commentaires`
--

DROP TABLE IF EXISTS `classroom_commentaires`;
CREATE TABLE IF NOT EXISTS `classroom_commentaires` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `annonce_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `contenu` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `classroom_commentaires_annonce_id_foreign` (`annonce_id`),
  KEY `classroom_commentaires_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classroom_documents`
--

DROP TABLE IF EXISTS `classroom_documents`;
CREATE TABLE IF NOT EXISTS `classroom_documents` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `module_id` bigint UNSIGNED NOT NULL,
  `prof_id` bigint UNSIGNED NOT NULL,
  `titre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('Cours','TD','TP','Autre') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Cours',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `classroom_documents_module_id_foreign` (`module_id`),
  KEY `classroom_documents_prof_id_foreign` (`prof_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `classroom_documents`
--

INSERT INTO `classroom_documents` (`id`, `module_id`, `prof_id`, `titre`, `file_path`, `type`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'Introduction à Laravel', '/documents/laravel-intro.pdf', 'Cours', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(2, 1, 2, 'TP - Création d\'une API REST', '/documents/tp-api-rest.pdf', 'TP', '2026-05-05 08:51:52', '2026-05-05 08:51:52'),
(3, 2, 3, 'Protocoles de Routage', '/documents/routage.pdf', 'Cours', '2026-05-03 08:51:52', '2026-05-03 08:51:52'),
(4, 3, 4, 'Machine Learning Basics', '/documents/ml-basics.pdf', 'Cours', '2026-05-01 08:51:52', '2026-05-01 08:51:52');

-- --------------------------------------------------------

--
-- Table structure for table `demandes_administratives`
--

DROP TABLE IF EXISTS `demandes_administratives`;
CREATE TABLE IF NOT EXISTS `demandes_administratives` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `motif` text COLLATE utf8mb4_unicode_ci,
  `statut` enum('pending','validated','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `motif_rejet` text COLLATE utf8mb4_unicode_ci,
  `document_path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `demandes_administratives_user_id_foreign` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `demandes_administratives`
--

INSERT INTO `demandes_administratives` (`id`, `user_id`, `type`, `motif`, `statut`, `motif_rejet`, `document_path`, `created_at`, `updated_at`) VALUES
(1, 5, 'Attestation de scolarité', 'Pour inscription en master', 'pending', NULL, NULL, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(2, 6, 'Relevé de notes', 'Demande de stage', 'validated', NULL, NULL, '2026-05-06 08:51:52', '2026-05-07 08:51:52');

-- --------------------------------------------------------

--
-- Table structure for table `emplois_du_temps`
--

DROP TABLE IF EXISTS `emplois_du_temps`;
CREATE TABLE IF NOT EXISTS `emplois_du_temps` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `groupe_id` bigint UNSIGNED NOT NULL,
  `module_id` bigint UNSIGNED NOT NULL,
  `prof_id` bigint UNSIGNED NOT NULL,
  `salle_id` bigint UNSIGNED NOT NULL,
  `jour` enum('Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi') COLLATE utf8mb4_unicode_ci NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `emplois_du_temps_groupe_id_foreign` (`groupe_id`),
  KEY `emplois_du_temps_module_id_foreign` (`module_id`),
  KEY `emplois_du_temps_prof_id_foreign` (`prof_id`),
  KEY `emplois_du_temps_salle_id_foreign` (`salle_id`)
) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `emplois_du_temps`
--

INSERT INTO `emplois_du_temps` (`id`, `groupe_id`, `module_id`, `prof_id`, `salle_id`, `jour`, `heure_debut`, `heure_fin`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 2, 1, 'Lundi', '08:30:00', '10:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(2, 1, 2, 3, 2, 'Lundi', '10:30:00', '12:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(3, 1, 3, 4, 5, 'Lundi', '14:00:00', '16:00:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(4, 1, 3, 4, 3, 'Mardi', '08:30:00', '10:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(5, 1, 1, 2, 6, 'Mardi', '10:30:00', '12:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(6, 1, 2, 3, 1, 'Mercredi', '08:30:00', '10:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(7, 1, 1, 2, 5, 'Mercredi', '14:00:00', '16:00:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(8, 1, 3, 4, 2, 'Jeudi', '08:30:00', '10:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(9, 1, 2, 3, 6, 'Jeudi', '10:30:00', '12:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(10, 1, 1, 2, 3, 'Jeudi', '14:00:00', '16:00:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(11, 1, 2, 3, 1, 'Vendredi', '08:30:00', '10:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(12, 1, 3, 4, 5, 'Vendredi', '10:30:00', '12:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(13, 2, 2, 3, 2, 'Lundi', '08:30:00', '10:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(14, 2, 3, 4, 3, 'Lundi', '10:30:00', '12:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(15, 2, 1, 2, 1, 'Lundi', '14:00:00', '16:00:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(16, 2, 1, 2, 6, 'Mardi', '08:30:00', '10:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(17, 2, 2, 3, 5, 'Mardi', '14:00:00', '16:00:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(18, 2, 3, 4, 2, 'Mercredi', '08:30:00', '10:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(19, 2, 1, 2, 1, 'Mercredi', '10:30:00', '12:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(20, 2, 2, 3, 6, 'Mercredi', '14:00:00', '16:00:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(21, 2, 3, 4, 3, 'Jeudi', '08:30:00', '10:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(22, 2, 1, 2, 2, 'Jeudi', '10:30:00', '12:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(23, 2, 2, 3, 5, 'Vendredi', '08:30:00', '10:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(24, 2, 3, 4, 1, 'Vendredi', '10:30:00', '12:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(25, 2, 1, 2, 6, 'Vendredi', '14:00:00', '16:00:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(26, 3, 4, 2, 3, 'Lundi', '08:30:00', '10:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(27, 3, 1, 2, 5, 'Lundi', '14:00:00', '16:00:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(28, 3, 4, 2, 6, 'Mardi', '08:30:00', '10:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(29, 3, 2, 3, 2, 'Mardi', '10:30:00', '12:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(30, 3, 3, 4, 1, 'Mardi', '14:00:00', '16:00:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(31, 3, 1, 2, 3, 'Mercredi', '08:30:00', '10:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(32, 3, 4, 2, 5, 'Mercredi', '10:30:00', '12:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(33, 3, 2, 3, 2, 'Jeudi', '08:30:00', '10:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(34, 3, 3, 4, 6, 'Jeudi', '14:00:00', '16:00:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(35, 3, 1, 2, 1, 'Vendredi', '08:30:00', '10:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(36, 3, 4, 2, 3, 'Vendredi', '10:30:00', '12:30:00', '2026-05-08 08:51:52', '2026-05-08 08:51:52');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `filieres`
--

DROP TABLE IF EXISTS `filieres`;
CREATE TABLE IF NOT EXISTS `filieres` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `filieres_code_unique` (`code`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `filieres`
--

INSERT INTO `filieres` (`id`, `nom`, `code`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Génie Informatique', 'GINFO', 'Formation en informatique et technologies numériques', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(2, 'Génie Systèmes Embarqués', 'GSE', 'Formation en systèmes embarqués et IoT', '2026-05-08 08:51:46', '2026-05-08 08:51:46');

-- --------------------------------------------------------

--
-- Table structure for table `groupes`
--

DROP TABLE IF EXISTS `groupes`;
CREATE TABLE IF NOT EXISTS `groupes` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filiere_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `groupes_filiere_id_foreign` (`filiere_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `groupes`
--

INSERT INTO `groupes` (`id`, `nom`, `filiere_id`, `created_at`, `updated_at`) VALUES
(1, 'GINFO3A', 1, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(2, 'GINFO3B', 1, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(3, 'GSE3A', 2, '2026-05-08 08:51:46', '2026-05-08 08:51:46');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_05_07_130853_create_university_tables', 1),
(5, '2026_05_10_161347_create_personal_access_tokens_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
CREATE TABLE IF NOT EXISTS `modules` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filiere_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `modules_filiere_id_foreign` (`filiere_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `nom`, `filiere_id`, `created_at`, `updated_at`) VALUES
(1, 'Technologie Web 2', 1, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(2, 'Réseaux Informatiques', 1, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(3, 'Intelligence Artificielle', 1, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(4, 'Internet des Objets', 2, '2026-05-08 08:51:46', '2026-05-08 08:51:46');

-- --------------------------------------------------------

--
-- Table structure for table `module_professor`
--

DROP TABLE IF EXISTS `module_professor`;
CREATE TABLE IF NOT EXISTS `module_professor` (
  `module_id` bigint UNSIGNED NOT NULL,
  `professor_id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`module_id`,`professor_id`),
  KEY `module_professor_professor_id_foreign` (`professor_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `module_professor`
--

INSERT INTO `module_professor` (`module_id`, `professor_id`) VALUES
(1, 2),
(2, 3),
(3, 4),
(4, 2);

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
CREATE TABLE IF NOT EXISTS `notes` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` bigint UNSIGNED NOT NULL,
  `module_id` bigint UNSIGNED NOT NULL,
  `cc1` decimal(5,2) DEFAULT NULL,
  `cc2` decimal(5,2) DEFAULT NULL,
  `examen` decimal(5,2) DEFAULT NULL,
  `note_finale` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notes_student_id_foreign` (`student_id`),
  KEY `notes_module_id_foreign` (`module_id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`id`, `student_id`, `module_id`, `cc1`, `cc2`, `examen`, `note_finale`, `created_at`, `updated_at`) VALUES
(1, 5, 1, 12.00, 16.00, 10.00, 12.67, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(2, 6, 1, 12.00, 18.00, 16.00, 15.33, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(3, 7, 1, 16.00, 10.00, 14.00, 13.33, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(4, 8, 1, 15.00, 18.00, 16.00, 16.33, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(5, 9, 1, 11.00, 11.00, 17.00, 13.00, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(6, 10, 1, 17.00, 18.00, 10.00, 15.00, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(7, 11, 1, 13.00, 11.00, 13.00, 12.33, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(8, 12, 1, 14.00, 17.00, 17.00, 16.00, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(9, 13, 2, 8.00, 9.00, 14.00, 10.33, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(10, 14, 2, 11.00, 12.00, 16.00, 13.00, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(11, 15, 2, 11.00, 11.00, 13.00, 11.67, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(12, 16, 2, 13.00, 14.00, 12.00, 13.00, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(13, 17, 2, 15.00, 17.00, 10.00, 14.00, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(14, 18, 2, 9.00, 18.00, 18.00, 15.00, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(15, 19, 2, 16.00, 10.00, 14.00, 13.33, '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(16, 20, 2, 17.00, 17.00, 17.00, 17.00, '2026-05-08 08:51:52', '2026-05-08 08:51:52');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(12, 'App\\Models\\User', 1, 'auth-token', '3d089f47c923f76d8e0159c80c2fdfd1285da45e59596ce380a31b1cfcf2d449', '[\"*\"]', '2026-05-11 20:41:37', NULL, '2026-05-11 20:33:00', '2026-05-11 20:41:37');

-- --------------------------------------------------------

--
-- Table structure for table `reservations_salles`
--

DROP TABLE IF EXISTS `reservations_salles`;
CREATE TABLE IF NOT EXISTS `reservations_salles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `salle_id` bigint UNSIGNED NOT NULL,
  `prof_id` bigint UNSIGNED NOT NULL,
  `date_reservation` date NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL,
  `motif` text COLLATE utf8mb4_unicode_ci,
  `statut` enum('pending','validated','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reservations_salles_salle_id_foreign` (`salle_id`),
  KEY `reservations_salles_prof_id_foreign` (`prof_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salles`
--

DROP TABLE IF EXISTS `salles`;
CREATE TABLE IF NOT EXISTS `salles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacite` int NOT NULL DEFAULT '30',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `salles_nom_unique` (`nom`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `salles`
--

INSERT INTO `salles` (`id`, `nom`, `capacite`, `created_at`, `updated_at`) VALUES
(1, 'Salle 101', 30, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(2, 'Salle 102', 30, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(3, 'Salle 201', 35, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(4, 'Amphi A', 100, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(5, 'Labo Info 1', 20, '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(6, 'Labo Info 2', 20, '2026-05-08 08:51:46', '2026-05-08 08:51:46');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('iwXWNcMmhBzUaaPhplrzuVpeId9n7cXYL7dgCoyH', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiI1eHJ6aVRUUUtXcnl0T0w5ZWMyWk5zdmtPMnRobkNMR3padHJoT0l6IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvMTI3LjAuMC4xOjgwMDBcL3Byb2Zlc3Nvclwvc2Vzc2lvbi1sb2ciLCJyb3V0ZSI6InByb2Zlc3Nvci5zZXNzaW9uLWxvZy5pbmRleCJ9LCJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI6Mn0=', 1778238594),
('tapUttjuYepm4mcql0gOAhXxThe6vKYtpX0so2sQ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJLcUhJRWg2d1dablNFbDA1bG1RRXBESTFXV1g3MWFaTUVBNUFkdkVwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1778432007),
('mkD6Y9QhvdYPsZt512qQB9GdGpwJwga4nJgq4pQ6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJid0VPWDZVWUhjdHA1bzhkcTFvV2VMM3VmWWZXamRpdjhaaVJNdExXIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1778484940);

-- --------------------------------------------------------

--
-- Table structure for table `student_group`
--

DROP TABLE IF EXISTS `student_group`;
CREATE TABLE IF NOT EXISTS `student_group` (
  `student_id` bigint UNSIGNED NOT NULL,
  `group_id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`student_id`,`group_id`),
  KEY `student_group_group_id_foreign` (`group_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_group`
--

INSERT INTO `student_group` (`student_id`, `group_id`) VALUES
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 2),
(14, 2),
(15, 2),
(16, 2),
(17, 2),
(18, 2),
(19, 2),
(20, 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('student','professor','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'student',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin UPF', 'admin@upf.ma', '2026-05-08 08:51:44', '$2y$12$VOEq/iBEWUoCl6LNeFoV/.RPm98EfitWgJrps.N/IIV8mu1jZNrkC', 'admin', 'tzPSidjulVbDZOhUwLXU56gQXukoJKpdFh4gJhuprefkrR2MGgiQJBjFUb3t', '2026-05-08 08:51:44', '2026-05-08 08:51:44'),
(2, 'Dr. Ahmed Bennani', 'a.bennani@upf.ma', '2026-05-08 08:51:45', '$2y$12$Zp8jgbij3CnLqXZtR7tcNeWUcbXKPck0ErtL5FaCOM7hil1u9ajMe', 'professor', 'ingOeSBZ81', '2026-05-08 08:51:45', '2026-05-08 08:51:45'),
(3, 'Prof. Fatima Zahra Idrissi', 'f.idrissi@upf.ma', '2026-05-08 08:51:45', '$2y$12$kSDsZo35Hm/cm/doQBc/Seb8WhQ.fzrOlbCMYpX/33NaTJQbEQtJ.', 'professor', 'ppC8dQnFQb', '2026-05-08 08:51:45', '2026-05-08 08:51:45'),
(4, 'Dr. Karim Tazi', 'k.tazi@upf.ma', '2026-05-08 08:51:46', '$2y$12$Sa1EGbFTHWiiM8cUpPzqvecpSVH/0.nQRvATbk4w/S.pQ29Yx5/K2', 'professor', 'bREmSAk9sa', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(5, 'Youssef Alami', 'y.alami@student.upf.ma', '2026-05-08 08:51:46', '$2y$12$IgGkeBiYi9oDbE0ZoJoiyOOhbEx.UkLdZnVVjRuooW70vb6MLciEm', 'student', 'gKT4fBB16y', '2026-05-08 08:51:46', '2026-05-08 08:51:46'),
(6, 'Amina Benkirane', 'a.benkirane@student.upf.ma', '2026-05-08 08:51:47', '$2y$12$yZYp0xo5IopP53yXpWZFzeaO1alDpKpIdIvQvif6meoBsH.TELgk.', 'student', 'xofWG89xSB', '2026-05-08 08:51:47', '2026-05-08 08:51:47'),
(7, 'Omar Chaoui', 'o.chaoui@student.upf.ma', '2026-05-08 08:51:47', '$2y$12$1TVKsFhvAQDE3CihYyj0juoGdCxyQhz6SRxsjKJmOksKf/q/t7a/q', 'student', 'dTYNlXDuMM', '2026-05-08 08:51:47', '2026-05-08 08:51:47'),
(8, 'Salma Derraj', 's.derraj@student.upf.ma', '2026-05-08 08:51:48', '$2y$12$u/2lgjcds9uPCm2scnfi7.Tn3BFb1lUnomtZ/INiVj3mdOb3eOg/S', 'student', 'iBS6CKcXA6', '2026-05-08 08:51:48', '2026-05-08 08:51:48'),
(9, 'Hamza El Fassi', 'h.elfassi@student.upf.ma', '2026-05-08 08:51:48', '$2y$12$7pT0ACJpZBkzmeHkW.Br/.jYpzHDcOa4jQgboGdcI/tnWhyQ/v4Im', 'student', 'I7YkLYjRoM', '2026-05-08 08:51:48', '2026-05-08 08:51:48'),
(10, 'Imane Guessous', 'i.guessous@student.upf.ma', '2026-05-08 08:51:48', '$2y$12$pdN/YxTCyKQryjdDS9CKdukKn67w9L6446o/Ka6.3p.JgcQeu.B3S', 'student', 'Kogg0EGONt', '2026-05-08 08:51:48', '2026-05-08 08:51:48'),
(11, 'Mehdi Hajji', 'm.hajji@student.upf.ma', '2026-05-08 08:51:49', '$2y$12$LT/xRsMU9cIgS.dwk.OGnelyrwi0B1YyKKB.kJvYixrn8psjKRtRS', 'student', 'hJmavn3dFa', '2026-05-08 08:51:49', '2026-05-08 08:51:49'),
(12, 'Nadia Iraqi', 'n.iraqi@student.upf.ma', '2026-05-08 08:51:49', '$2y$12$kpPBKxm5Duu5ZlERbpSWpugJNzw5PUxeVH47kKHSy9BL36092eOLO', 'student', 'KhoRsF7vd1', '2026-05-08 08:51:49', '2026-05-08 08:51:49'),
(13, 'Rachid Kabbaj', 'r.kabbaj@student.upf.ma', '2026-05-08 08:51:50', '$2y$12$dinIDYCUgZVVCE4ahSo5r.tS6eQxytV7GuBakbxTnKjEOA2tjRQA.', 'student', 'Osq4qJd2vC', '2026-05-08 08:51:50', '2026-05-08 08:51:50'),
(14, 'Leila Mansouri', 'l.mansouri@student.upf.ma', '2026-05-08 08:51:50', '$2y$12$QQno1KSgqX5k/sKfjW.UzOQCPmkX8Y.OYlYMNEbYSVFx716gwcnQi', 'student', 'El4FQUdFHd', '2026-05-08 08:51:50', '2026-05-08 08:51:50'),
(15, 'Ayoub Naji', 'a.naji@student.upf.ma', '2026-05-08 08:51:50', '$2y$12$jNFWRhhqRqgeDmTmXrFcVuMHRdzcVZ0DxiWG1T7OUYLZezdOBfOee', 'student', '0bz9F1GLvm', '2026-05-08 08:51:50', '2026-05-08 08:51:50'),
(16, 'Bouchra Ouazzani', 'b.ouazzani@student.upf.ma', '2026-05-08 08:51:51', '$2y$12$bEKQvnNZhl1ItnnOT2wNb.4cSnziRoXzlHvttfZsrZMBO.PW60At.', 'student', 'wO4JAaSj4B', '2026-05-08 08:51:51', '2026-05-08 08:51:51'),
(17, 'Zakaria Rahmani', 'z.rahmani@student.upf.ma', '2026-05-08 08:51:51', '$2y$12$xgmA96Kvybn9Ai7hSBE71uhb1xVxZbrHy8Q12GGafbwd4o2kqTuru', 'student', 'V60Xnywgzp', '2026-05-08 08:51:51', '2026-05-08 08:51:51'),
(18, 'Hajar Saadi', 'h.saadi@student.upf.ma', '2026-05-08 08:51:52', '$2y$12$5EERPVIYIbWmkFAP5apC3uhnbvmGtH5zX4oAcPPrYF8ZZlmlMGsQ2', 'student', 'MgDhNZTX0eO2uLEPZxBQHhPJdbgWpYjmT4UEbMyBas203iz4qLq0LA8qGV4C', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(19, 'Ismail Tahiri', 'i.tahiri@student.upf.ma', '2026-05-08 08:51:52', '$2y$12$55d9SJDAw19BTYJ.OPhm2uNbwKiD.CVEJt1qngrnSwjWzV/5/wFcO', 'student', 'zHdcMImFDO', '2026-05-08 08:51:52', '2026-05-08 08:51:52'),
(20, 'Khadija Ziani', 'k.ziani@student.upf.ma', '2026-05-08 08:51:52', '$2y$12$en67n1iqzlCvGVC.KH3JAOjS5oO6lVKLXGXgj4m3.kS35wEIx6RZm', 'student', 'sXm1QKX56E', '2026-05-08 08:51:52', '2026-05-08 08:51:52');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
