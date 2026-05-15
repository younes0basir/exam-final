-- Additional realistic data for existing university database tables
-- Only INSERT statements - no table modifications

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Additional Users (Students, Professors)
-- --------------------------------------------------------

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(21, 'Dr. Sofia Martinez', 's.martinez@upf.ma', '2026-05-09 10:00:00', '$2y$12$VOEq/iBEWUoCl6LNeFoV/.RPm98EfitWgJrps.N/IIV8mu1jZNrkC', 'professor', 'abc123def456', '2026-05-09 10:00:00', '2026-05-09 10:00:00'),
(22, 'Prof. Mohamed El Amrani', 'm.elamrani@upf.ma', '2026-05-09 10:05:00', '$2y$12$Zp8jgbij3CnLqXZtR7tcNeWUcbXKPck0ErtL5FaCOM7hil1u9ajMe', 'professor', 'xyz789ghi012', '2026-05-09 10:05:00', '2026-05-09 10:05:00'),
(23, 'Dr. Leila Benali', 'l.benali@upf.ma', '2026-05-09 10:10:00', '$2y$12$kSDsZo35Hm/cm/doQBc/Seb8WhQ.fzrOlbCMYpX/33NaTJQbEQtJ.', 'professor', 'mno345pqr678', '2026-05-09 10:10:00', '2026-05-09 10:10:00'),
(24, 'Sara Idrissi', 's.idrissi@student.upf.ma', '2026-05-09 10:15:00', '$2y$12$IgGkeBiYi9oDbE0ZoJoiyOOhbEx.UkLdZnVVjRuooW70vb6MLciEm', 'student', 'stu001token', '2026-05-09 10:15:00', '2026-05-09 10:15:00'),
(25, 'Karim Bouchta', 'k.bouchta@student.upf.ma', '2026-05-09 10:20:00', '$2y$12$yZYp0xo5IopP53yXpWZFzeaO1alDpKpIdIvQvif6meoBsH.TELgk.', 'student', 'stu002token', '2026-05-09 10:20:00', '2026-05-09 10:20:00'),
(26, 'Nadia Fassi', 'n.fassi@student.upf.ma', '2026-05-09 10:25:00', '$2y$12$1TVKsFhvAQDE3CihYyj0juoGdCxyQhz6SRxsjKJmOksKf/q/t7a/q', 'student', 'stu003token', '2026-05-09 10:25:00', '2026-05-09 10:25:00'),
(27, 'Yassine Tazi', 'y.tazi@student.upf.ma', '2026-05-09 10:30:00', '$2y$12$u/2lgjcds9uPCm2scnfi7.Tn3BFb1lUnomtZ/INiVj3mdOb3eOg/S', 'student', 'stu004token', '2026-05-09 10:30:00', '2026-05-09 10:30:00'),
(28, 'Fatima Zahra Kabbaj', 'f.kabbaj@student.upf.ma', '2026-05-09 10:35:00', '$2y$12$7pT0ACJpZBkzmeHkW.Br/.jYpzHDcOa4jQgboGdcI/tnWhyQ/v4Im', 'student', 'stu005token', '2026-05-09 10:35:00', '2026-05-09 10:35:00'),
(29, 'Mehdi Alami', 'm.alami@student.upf.ma', '2026-05-09 10:40:00', '$2y$12$pdN/YxTCyKQryjdDS9CKdukKn67w9L6446o/Ka6.3p.JgcQeu.B3S', 'student', 'stu006token', '2026-05-09 10:40:00', '2026-05-09 10:40:00'),
(30, 'Aicha Bennani', 'a.bennani2@student.upf.ma', '2026-05-09 10:45:00', '$2y$12$LT/xRsMU9cIgS.dwk.OGnelyrwi0B1YyKKB.kJvYixrn8psjKRtRS', 'student', 'stu007token', '2026-05-09 10:45:00', '2026-05-09 10:45:00');

-- --------------------------------------------------------
-- Additional Groups
-- --------------------------------------------------------

INSERT INTO `groupes` (`id`, `nom`, `filiere_id`, `created_at`, `updated_at`) VALUES
(4, 'GINFO4A', 1, '2026-05-09 11:00:00', '2026-05-09 11:00:00'),
(5, 'GSE4A', 2, '2026-05-09 11:05:00', '2026-05-09 11:05:00');

-- --------------------------------------------------------
-- Additional Modules
-- --------------------------------------------------------

INSERT INTO `modules` (`id`, `nom`, `filiere_id`, `created_at`, `updated_at`) VALUES
(5, 'Développement Mobile', 1, '2026-05-09 11:10:00', '2026-05-09 11:10:00'),
(6, 'Cloud Computing', 1, '2026-05-09 11:15:00', '2026-05-09 11:15:00'),
(7, 'Cybersécurité', 2, '2026-05-09 11:20:00', '2026-05-09 11:20:00');

-- --------------------------------------------------------
-- Module-Professor Assignments
-- --------------------------------------------------------

INSERT INTO `module_professor` (`module_id`, `professor_id`) VALUES
(5, 21),
(6, 22),
(7, 23);

-- --------------------------------------------------------
-- Student-Group Assignments
-- --------------------------------------------------------

INSERT INTO `student_group` (`student_id`, `group_id`) VALUES
(24, 3),
(25, 3),
(26, 3),
(27, 4),
(28, 4),
(29, 4),
(30, 5);

-- --------------------------------------------------------
-- Additional Salles (Classrooms)
-- --------------------------------------------------------

INSERT INTO `salles` (`id`, `nom`, `capacite`, `created_at`, `updated_at`) VALUES
(7, 'Salle 301', 40, '2026-05-09 11:30:00', '2026-05-09 11:30:00'),
(8, 'Amphi B', 150, '2026-05-09 11:35:00', '2026-05-09 11:35:00'),
(9, 'Labo Réseaux', 25, '2026-05-09 11:40:00', '2026-05-09 11:40:00');

-- --------------------------------------------------------
-- Additional Emplois du Temps (Schedule entries)
-- --------------------------------------------------------

INSERT INTO `emplois_du_temps` (`id`, `groupe_id`, `module_id`, `prof_id`, `salle_id`, `jour`, `heure_debut`, `heure_fin`, `created_at`, `updated_at`) VALUES
(37, 3, 4, 2, 7, 'Lundi', '08:30:00', '10:30:00', '2026-05-09 12:00:00', '2026-05-09 12:00:00'),
(38, 3, 5, 21, 5, 'Lundi', '10:30:00', '12:30:00', '2026-05-09 12:05:00', '2026-05-09 12:05:00'),
(39, 3, 6, 22, 8, 'Mardi', '14:00:00', '16:00:00', '2026-05-09 12:10:00', '2026-05-09 12:10:00'),
(40, 4, 1, 2, 1, 'Mercredi', '08:30:00', '10:30:00', '2026-05-09 12:15:00', '2026-05-09 12:15:00'),
(41, 4, 7, 23, 9, 'Mercredi', '10:30:00', '12:30:00', '2026-05-09 12:20:00', '2026-05-09 12:20:00'),
(42, 5, 2, 3, 2, 'Jeudi', '08:30:00', '10:30:00', '2026-05-09 12:25:00', '2026-05-09 12:25:00'),
(43, 5, 4, 2, 6, 'Jeudi', '14:00:00', '16:00:00', '2026-05-09 12:30:00', '2026-05-09 12:30:00');

-- --------------------------------------------------------
-- Additional Cahier Textes (Course logs)
-- --------------------------------------------------------

INSERT INTO `cahier_textes` (`id`, `prof_id`, `module_id`, `groupe_id`, `date_seance`, `heure_debut`, `heure_fin`, `objectif`, `nature`, `created_at`, `updated_at`) VALUES
(3, 21, 5, 3, '2026-05-08', '10:30:00', '12:30:00', 'Introduction à React Native et création de composants mobiles', 'Cours', '2026-05-09 13:00:00', '2026-05-09 13:00:00'),
(4, 22, 6, 3, '2026-05-09', '14:00:00', '16:00:00', 'Services AWS: EC2, S3, Lambda. Déploiement d''applications cloud', 'TP', '2026-05-09 13:05:00', '2026-05-09 13:05:00'),
(5, 23, 7, 4, '2026-05-10', '10:30:00', '12:30:00', 'Cryptographie et sécurité des réseaux. Tests de pénétration', 'Cours', '2026-05-09 13:10:00', '2026-05-09 13:10:00');

-- --------------------------------------------------------
-- Additional Classroom Documents
-- --------------------------------------------------------

INSERT INTO `classroom_documents` (`id`, `module_id`, `prof_id`, `titre`, `file_path`, `type`, `created_at`, `updated_at`) VALUES
(5, 5, 21, 'React Native Basics', '/documents/react-native-basics.pdf', 'Cours', '2026-05-09 13:15:00', '2026-05-09 13:15:00'),
(6, 5, 21, 'TP - Application Mobile', '/documents/tp-mobile-app.pdf', 'TP', '2026-05-09 13:20:00', '2026-05-09 13:20:00'),
(7, 6, 22, 'AWS Cloud Services', '/documents/aws-services.pdf', 'Cours', '2026-05-09 13:25:00', '2026-05-09 13:25:00'),
(8, 7, 23, 'Network Security Fundamentals', '/documents/network-security.pdf', 'Cours', '2026-05-09 13:30:00', '2026-05-09 13:30:00'),
(9, 7, 23, 'TP - Penetration Testing', '/documents/tp-pentest.pdf', 'TP', '2026-05-09 13:35:00', '2026-05-09 13:35:00');

-- --------------------------------------------------------
-- Additional Classroom Announcements
-- --------------------------------------------------------

INSERT INTO `classroom_annonces` (`id`, `module_id`, `prof_id`, `titre`, `contenu`, `created_at`, `updated_at`) VALUES
(1, 5, 21, 'Projet Mobile - Deadline', 'Le projet d''application mobile doit être rendu avant le 25 mai 2026. Utilisez React Native.', '2026-05-09 14:00:00', '2026-05-09 14:00:00'),
(2, 6, 22, 'Certification AWS', 'Une session de préparation à la certification AWS Cloud Practitioner aura lieu le 30 mai.', '2026-05-09 14:05:00', '2026-05-09 14:05:00'),
(3, 7, 23, 'CTF Competition', 'Participation au CTF (Capture The Flag) de cybersécurité le 15 juin. Inscription obligatoire.', '2026-05-09 14:10:00', '2026-05-09 14:10:00');

-- --------------------------------------------------------
-- Additional Classroom Comments
-- --------------------------------------------------------

INSERT INTO `classroom_commentaires` (`id`, `annonce_id`, `user_id`, `contenu`, `created_at`, `updated_at`) VALUES
(1, 1, 24, 'Est-ce qu''on peut utiliser Flutter aussi?', '2026-05-09 14:30:00', '2026-05-09 14:30:00'),
(2, 1, 21, 'Oui, Flutter est accepté pour le projet.', '2026-05-09 14:35:00', '2026-05-09 14:35:00'),
(3, 2, 25, 'Très intéressant! Je m''inscris.', '2026-05-09 14:40:00', '2026-05-09 14:40:00'),
(4, 3, 27, 'Comment s''inscrire au CTF?', '2026-05-09 14:45:00', '2026-05-09 14:45:00'),
(5, 3, 23, 'Lien d''inscription envoyé par email.', '2026-05-09 14:50:00', '2026-05-09 14:50:00');

-- --------------------------------------------------------
-- Additional Notes (Grades)
-- --------------------------------------------------------

INSERT INTO `notes` (`id`, `student_id`, `module_id`, `cc1`, `cc2`, `examen`, `note_finale`, `created_at`, `updated_at`) VALUES
(17, 24, 4, 14.00, 15.00, 13.00, 14.00, '2026-05-09 15:00:00', '2026-05-09 15:00:00'),
(18, 25, 4, 16.00, 17.00, 15.00, 16.00, '2026-05-09 15:05:00', '2026-05-09 15:05:00'),
(19, 26, 4, 12.00, 13.00, 14.00, 13.00, '2026-05-09 15:10:00', '2026-05-09 15:10:00'),
(20, 27, 1, 15.00, 16.00, 14.00, 15.00, '2026-05-09 15:15:00', '2026-05-09 15:15:00'),
(21, 28, 1, 13.00, 14.00, 15.00, 14.00, '2026-05-09 15:20:00', '2026-05-09 15:20:00'),
(22, 29, 1, 17.00, 18.00, 16.00, 17.00, '2026-05-09 15:25:00', '2026-05-09 15:25:00'),
(23, 30, 2, 11.00, 12.00, 13.00, 12.00, '2026-05-09 15:30:00', '2026-05-09 15:30:00');

-- --------------------------------------------------------
-- Additional Absences
-- --------------------------------------------------------

INSERT INTO `absences` (`id`, `student_id`, `module_id`, `date_absence`, `seance_debut`, `seance_fin`, `est_justifie`, `justification_file`, `statut_justification`, `motif_rejet`, `created_at`, `updated_at`) VALUES
(4, 24, 4, '2026-05-07', '08:30:00', '10:30:00', 0, NULL, 'pending', NULL, '2026-05-09 16:00:00', '2026-05-09 16:00:00'),
(5, 25, 5, '2026-05-08', '10:30:00', '12:30:00', 1, '/justifications/absence_25.pdf', 'validated', NULL, '2026-05-09 16:05:00', '2026-05-09 16:05:00'),
(6, 27, 1, '2026-05-09', '08:30:00', '10:30:00', 0, NULL, 'pending', NULL, '2026-05-09 16:10:00', '2026-05-09 16:10:00'),
(7, 28, 7, '2026-05-10', '10:30:00', '12:30:00', 0, NULL, 'rejected', 'Justification non reçue dans les délais', '2026-05-09 16:15:00', '2026-05-09 16:20:00');

-- --------------------------------------------------------
-- Additional Administrative Requests
-- --------------------------------------------------------

INSERT INTO `demandes_administratives` (`id`, `user_id`, `type`, `motif`, `statut`, `motif_rejet`, `document_path`, `created_at`, `updated_at`) VALUES
(3, 24, 'Relevé de notes', 'Demande de stage en entreprise', 'pending', NULL, NULL, '2026-05-09 16:30:00', '2026-05-09 16:30:00'),
(4, 25, 'Attestation de scolarité', 'Pour renouvellement carte étudiant', 'validated', NULL, '/documents/attestation_25.pdf', '2026-05-08 10:00:00', '2026-05-09 09:00:00'),
(5, 27, 'Convention de stage', 'Stage d''été en développement web', 'pending', NULL, NULL, '2026-05-09 16:35:00', '2026-05-09 16:35:00'),
(6, 28, 'Attestation de réussite', 'Pour inscription en master', 'rejected', 'Module IA non validé', NULL, '2026-05-07 14:00:00', '2026-05-08 10:00:00');

-- --------------------------------------------------------
-- Additional Room Reservations
-- --------------------------------------------------------

INSERT INTO `reservations_salles` (`id`, `salle_id`, `prof_id`, `date_reservation`, `heure_debut`, `heure_fin`, `motif`, `statut`, `created_at`, `updated_at`) VALUES
(1, 5, 21, '2026-05-20', '14:00:00', '16:00:00', 'TP Développement Mobile', 'validated', '2026-05-09 17:00:00', '2026-05-09 17:05:00'),
(2, 9, 23, '2026-05-22', '10:00:00', '12:00:00', 'TP Cybersécurité - Pentesting', 'pending', '2026-05-09 17:10:00', '2026-05-09 17:10:00'),
(3, 8, 22, '2026-05-25', '09:00:00', '11:00:00', 'Conférence Cloud Computing', 'validated', '2026-05-09 17:15:00', '2026-05-09 17:20:00'),
(4, 7, 2, '2026-05-18', '14:00:00', '16:00:00', 'Cours Laravel avancé', 'rejected', '2026-05-09 17:25:00', '2026-05-09 17:30:00');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
