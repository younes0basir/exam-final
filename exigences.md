## Ce que le projet doit contenir

### 1. Informations générales

* Application web complète de gestion universitaire
* Travail individuel obligatoire
* Framework au choix :

  * Laravel (recommandé)
  * Symfony
* Base de données : MySQL
* Frontend :

  * Blade ou Twig
  * Bootstrap ou Tailwind CSS
* Architecture MVC obligatoire 

---

# Fonctionnalités principales

## 2. Espace Étudiant

* Consultation des notes :

  * CC1
  * CC2
  * Examen final
  * Note finale
* Consultation des supports de cours/TD/TP
* Classroom par module :

  * annonces
  * commentaires
* Consultation emploi du temps
* Consultation absences
* Dépôt justificatifs d’absence (PDF/Image)
* Demandes administratives :

  * attestation scolarité
  * relevé de notes
  * certificat d’inscription 

---

## 3. Espace Professeur

* Saisie des notes
* Calcul automatique note finale

La formule obligatoire :

\text{Note finale} = \frac{CC1 + CC2}{2} \times 0.4 + Examen \times 0.6

* Gestion des absences
* Cahier de texte :

  * date automatique
  * heure début/fin
  * objectif séance
  * type : Cours / TD / TP
* Dépôt supports et annonces
* Consultation EDT
* Réservation salles
* Demandes administratives :

  * attestation travail
  * ordre de mission 

---

## 4. Espace Administration

* Gestion totale des utilisateurs
* Gestion :

  * filières
  * modules
  * groupes
  * salles
* Gestion notes
* Gestion absences
* Validation justificatifs
* Gestion cahiers de texte
* Gestion complète emploi du temps
* Validation/refus demandes administratives
* Génération PDF automatique
* Gestion réservations salles 

---

# Modules obligatoires

## 5. Module Emploi du Temps

* EDT étudiant
* EDT professeur
* EDT administration
* Modifications visibles en temps réel 

---

## 6. Module Réservation de salles

* Consultation disponibilités
* Réservation par professeur
* Validation anti-conflit
* Administration peut modifier/supprimer 

---

## 7. Module Demandes administratives

Workflow obligatoire :

1. Soumission demande
2. Validation/refus admin
3. Génération PDF
4. Notification utilisateur 

---

## 8. Module Classroom

* Annonces professeur
* Dépôt documents
* Commentaires étudiants/professeurs 

---

## 9. Authentification

* Login unique
* Redirection selon rôle
* Middleware
* bcrypt
* Protection :

  * CSRF
  * validation formulaires 

---

## 10. API REST obligatoire

* Auth API :

  * Sanctum
  * Passport
  * JWT
* Endpoints :

  * notes
  * emploi du temps
  * absences
  * modules/cours
* Réponses JSON
* Documentation API :

  * Postman
  * Swagger
* Tests API dans rapport 

---

# Contraintes techniques

## 11. Architecture

* MVC stricte
* ORM :

  * Eloquent
  * Doctrine
* Migrations
* Seeders (5 données minimum/table) 

---

## 12. Sécurité

* Authentification sécurisée
* Contrôle accès par rôle
* Validation inputs
* Protection :

  * SQL Injection
  * XSS
  * CSRF 

---

## 13. Interface utilisateur

* Responsive desktop/mobile
* Bonne charte graphique
* Navigation claire
* Messages confirmation/erreur 

---

# Bonus possibles

* Dashboard statistiques
* Notifications temps réel
* Export PDF/Excel
* Multi-langue
* Dark mode
* Recherche avancée
* Emails automatiques
* Calendrier interactif FullCalendar 

---

# Livrables obligatoires

## 14. Code source

* ZIP du projet
* README
* GitHub/GitLab optionnel 

---

## 15. Base de données

* Script SQL
* Migrations
* Seeders 

---

## 16. Rapport PDF

Doit contenir :

* Introduction
* Description fonctionnelle
* UML :

  * Use Case
  * Classes
  * Séquences
* MCD / MLD
* Architecture technique
* Captures écran
* Difficultés/Solutions
* Conclusion 

---

## 17. Soutenance

* Démonstration live
* Questions/réponses 
