

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- 1. Table: users
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'professor', 'admin') NOT NULL DEFAULT 'student',
  `remember_token` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table: filieres
CREATE TABLE IF NOT EXISTS `filieres` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nom` VARCHAR(255) NOT NULL,
  `code` VARCHAR(50) UNIQUE,
  `description` TEXT,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table: groupes
CREATE TABLE IF NOT EXISTS `groupes` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nom` VARCHAR(255) NOT NULL,
  `filiere_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`filiere_id`) REFERENCES `filieres`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table: modules
CREATE TABLE IF NOT EXISTS `modules` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nom` VARCHAR(255) NOT NULL,
  `filiere_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`filiere_id`) REFERENCES `filieres`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Table: module_professor (Many-to-Many)
CREATE TABLE IF NOT EXISTS `module_professor` (
  `module_id` BIGINT UNSIGNED NOT NULL,
  `professor_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`module_id`, `professor_id`),
  FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`professor_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Table: student_group (Registration)
CREATE TABLE IF NOT EXISTS `student_group` (
  `student_id` BIGINT UNSIGNED NOT NULL,
  `group_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`student_id`, `group_id`),
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`group_id`) REFERENCES `groupes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Table: salles
CREATE TABLE IF NOT EXISTS `salles` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nom` VARCHAR(50) NOT NULL UNIQUE,
  `capacite` INT DEFAULT 30,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Table: notes
CREATE TABLE IF NOT EXISTS `notes` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` BIGINT UNSIGNED NOT NULL,
  `module_id` BIGINT UNSIGNED NOT NULL,
  `cc1` DECIMAL(5,2) DEFAULT NULL,
  `cc2` DECIMAL(5,2) DEFAULT NULL,
  `examen` DECIMAL(5,2) DEFAULT NULL,
  `note_finale` DECIMAL(5,2) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Table: absences
CREATE TABLE IF NOT EXISTS `absences` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` BIGINT UNSIGNED NOT NULL,
  `module_id` BIGINT UNSIGNED NOT NULL,
  `date_absence` DATE NOT NULL,
  `seance_debut` TIME NOT NULL,
  `seance_fin` TIME NOT NULL,
  `est_justifie` BOOLEAN DEFAULT FALSE,
  `justification_file` VARCHAR(255) DEFAULT NULL,
  `statut_justification` ENUM('pending', 'validated', 'rejected') DEFAULT 'pending',
  `motif_rejet` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Table: cahier_textes
CREATE TABLE IF NOT EXISTS `cahier_textes` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `prof_id` BIGINT UNSIGNED NOT NULL,
  `module_id` BIGINT UNSIGNED NOT NULL,
  `groupe_id` BIGINT UNSIGNED NOT NULL,
  `date_seance` DATE NOT NULL,
  `heure_debut` TIME NOT NULL,
  `heure_fin` TIME NOT NULL,
  `objectif` TEXT,
  `nature` ENUM('Cours', 'TD', 'TP') NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`prof_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`groupe_id`) REFERENCES `groupes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Table: emplois_du_temps
CREATE TABLE IF NOT EXISTS `emplois_du_temps` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `groupe_id` BIGINT UNSIGNED NOT NULL,
  `module_id` BIGINT UNSIGNED NOT NULL,
  `prof_id` BIGINT UNSIGNED NOT NULL,
  `salle_id` BIGINT UNSIGNED NOT NULL,
  `jour` ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi') NOT NULL,
  `heure_debut` TIME NOT NULL,
  `heure_fin` TIME NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`groupe_id`) REFERENCES `groupes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`prof_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`salle_id`) REFERENCES `salles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Table: reservations_salles
CREATE TABLE IF NOT EXISTS `reservations_salles` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `salle_id` BIGINT UNSIGNED NOT NULL,
  `prof_id` BIGINT UNSIGNED NOT NULL,
  `date_reservation` DATE NOT NULL,
  `heure_debut` TIME NOT NULL,
  `heure_fin` TIME NOT NULL,
  `motif` TEXT,
  `statut` ENUM('pending', 'validated', 'rejected') DEFAULT 'pending',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`salle_id`) REFERENCES `salles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`prof_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Table: demandes_administratives
CREATE TABLE IF NOT EXISTS `demandes_administratives` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('Attestation de scolarité', 'Relevé de notes', 'Certificat d\'inscription', 'Attestation de travail', 'Ordre de mission') NOT NULL,
  `motif` TEXT,
  `statut` ENUM('pending', 'validated', 'rejected') DEFAULT 'pending',
  `motif_rejet` TEXT DEFAULT NULL,
  `document_path` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Table: classroom_annonces
CREATE TABLE IF NOT EXISTS `classroom_annonces` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `module_id` BIGINT UNSIGNED NOT NULL,
  `prof_id` BIGINT UNSIGNED NOT NULL,
  `titre` VARCHAR(255) NOT NULL,
  `contenu` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`prof_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. Table: classroom_documents
CREATE TABLE IF NOT EXISTS `classroom_documents` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `module_id` BIGINT UNSIGNED NOT NULL,
  `prof_id` BIGINT UNSIGNED NOT NULL,
  `titre` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `type` ENUM('Cours', 'TD', 'TP', 'Autre') DEFAULT 'Cours',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`prof_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. Table: classroom_commentaires
CREATE TABLE IF NOT EXISTS `classroom_commentaires` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `annonce_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `contenu` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`annonce_id`) REFERENCES `classroom_annonces`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
