import ora from "ora";
import inquirer from "inquirer";
import { createApiClient } from "../lib/http.js";
import { printError, printTable, printSuccess, printInfo, printWarning } from "../lib/output.js";

function normalizeArrayResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export function registerAdminCommands(program) {
  const admin = program.command("admin").description("Commandes administrateur");

  admin
    .command("dashboard")
    .description("Voir le tableau de bord administrateur")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await viewAdminDashboard(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement du tableau de bord.");
        process.exitCode = 1;
      }
    });

  admin
    .command("users")
    .description("Lister tous les utilisateurs")
    .option("--role <role>", "Filtrer par rôle (student/professor/admin)")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await listUsers(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement des utilisateurs.");
        process.exitCode = 1;
      }
    });

  admin
    .command("filieres")
    .description("Lister les filières")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await listFilieres(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement des filières.");
        process.exitCode = 1;
      }
    });

  admin
    .command("requests")
    .description("Gérer les demandes administratives")
    .option("--status <status>", "Filtrer par statut (pending/validated/rejected)")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await manageRequests(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement des demandes.");
        process.exitCode = 1;
      }
    });

  admin
    .command("timetable")
    .description("Voir l'emploi du temps global")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await viewTimetable(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement de l'emploi du temps.");
        process.exitCode = 1;
      }
    });

  admin
    .command("reservations")
    .description("Gérer les réservations de salles")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await manageReservations(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement des réservations.");
        process.exitCode = 1;
      }
    });

  admin
    .command("absences")
    .description("Voir les absences")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await viewAbsences(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement des absences.");
        process.exitCode = 1;
      }
    });
}

export async function viewAdminDashboard(options = {}) {
  const spinner = ora("Chargement du tableau de bord...").start();
  const client = createApiClient();
  const response = await client.get("/admin/dashboard/stats");
  spinner.stop();

  const stats = response.data;
  
  if (options.json) {
    console.log(JSON.stringify(stats, null, 2));
    return stats;
  }

  console.log("\n📊 Tableau de Bord Administrateur\n");
  console.log("👥 Statistiques Utilisateurs:");
  console.log(`  Étudiants: ${stats.students || 0}`);
  console.log(`  Professeurs: ${stats.professors || 0}`);
  console.log(`  Total: ${(stats.students || 0) + (stats.professors || 0)}\n`);

  console.log("📚 Statistiques Académiques:");
  console.log(`  Filières: ${stats.filieres || 0}`);
  console.log(`  Modules: ${stats.modules || 0}`);
  console.log(`  Salles: ${stats.salles || 0}\n`);

  return stats;
}

export async function listUsers(options = {}) {
  const spinner = ora("Chargement des utilisateurs...").start();
  const client = createApiClient();
  let url = "/admin/users";
  if (options.role) {
    url += `?role=${options.role}`;
  }
  const response = await client.get(url);
  spinner.stop();

  const users = normalizeArrayResponse(response.data);
  
  if (options.json) {
    console.log(JSON.stringify(users, null, 2));
    return users;
  }

  if (users.length === 0) {
    console.log("Aucun utilisateur trouvé.");
    return users;
  }

  const rows = users.map((u) => [
    u.id || "-",
    u.name || "-",
    u.email || "-",
    u.role || "-",
    new Date(u.created_at).toLocaleDateString('fr-FR') || "-"
  ]);
  printTable(["ID", "Nom", "Email", "Rôle", "Créé le"], rows);
  return users;
}

export async function listFilieres(options = {}) {
  const spinner = ora("Chargement des filières...").start();
  const client = createApiClient();
  const response = await client.get("/admin/academic/filieres");
  spinner.stop();

  const filieres = normalizeArrayResponse(response.data);
  
  if (options.json) {
    console.log(JSON.stringify(filieres, null, 2));
    return filieres;
  }

  if (filieres.length === 0) {
    console.log("Aucune filière trouvée.");
    return filieres;
  }

  const rows = filieres.map((f) => [
    f.id || "-",
    f.nom || "-",
    f.code || "-",
    f.groupes_count || 0,
    f.modules_count || 0
  ]);
  printTable(["ID", "Nom", "Code", "Groupes", "Modules"], rows);
  return filieres;
}

export async function manageRequests(options = {}) {
  const spinner = ora("Chargement des demandes...").start();
  const client = createApiClient();
  let url = "/admin/requests";
  if (options.status) {
    url += `?status=${options.status}`;
  }
  const response = await client.get(url);
  spinner.stop();

  const requests = normalizeArrayResponse(response.data);
  
  if (options.json) {
    console.log(JSON.stringify(requests, null, 2));
    return requests;
  }

  if (requests.length === 0) {
    console.log("Aucune demande administrative.");
    return requests;
  }

  const rows = requests.map((r) => [
    r.id || "-",
    r.user?.name || r.etudiant_nom || "-",
    r.type || "-",
    r.statut || "-",
    new Date(r.created_at).toLocaleDateString('fr-FR') || "-"
  ]);
  printTable(["ID", "Étudiant", "Type", "Statut", "Date"], rows);

  // Interactive mode for pending requests
  const pendingRequests = requests.filter(r => r.statut === 'pending');
  if (pendingRequests.length > 0 && !options.status) {
    console.log(`\n${pendingRequests.length} demande(s) en attente de traitement.`);
    
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Que voulez-vous faire?",
        choices: [
          { name: "Traiter une demande", value: "process" },
          { name: "Quitter", value: "quit" }
        ]
      }
    ]);

    if (action === "process") {
      await processRequestInteractive(pendingRequests);
    }
  }

  return requests;
}

async function processRequestInteractive(requests) {
  const { requestId } = await inquirer.prompt([
    {
      type: "list",
      name: "requestId",
      message: "Sélectionnez une demande à traiter:",
      choices: requests.map(r => ({
        name: `${r.id} - ${r.user?.name || r.etudiant_nom} (${r.type})`,
        value: r.id
      }))
    }
  ]);

  const { decision } = await inquirer.prompt([
    {
      type: "list",
      name: "decision",
      message: "Décision:",
      choices: [
        { name: "✅ Valider", value: "validated" },
        { name: "❌ Rejeter", value: "rejected" }
      ]
    }
  ]);

  let motif_rejet = "";
  if (decision === "rejected") {
    const { reason } = await inquirer.prompt([
      {
        type: "input",
        name: "reason",
        message: "Motif du rejet:",
        validate: (input) => input.trim() !== "" || "Le motif est requis"
      }
    ]);
    motif_rejet = reason;
  }

  const spinner = ora("Traitement de la demande...").start();
  const client = createApiClient();
  await client.patch(`/admin/requests/${requestId}`, {
    statut: decision,
    motif_rejet: motif_rejet || undefined
  });
  spinner.succeed("Demande traitée avec succès");
  printSuccess(`Demande ${decision === 'validated' ? 'validée' : 'rejetée'}`);
}

export async function viewTimetable(options = {}) {
  const spinner = ora("Chargement de l'emploi du temps...").start();
  const client = createApiClient();
  const response = await client.get("/admin/timetable");
  spinner.stop();

  const timetable = normalizeArrayResponse(response.data);
  
  if (options.json) {
    console.log(JSON.stringify(timetable, null, 2));
    return timetable;
  }

  if (timetable.length === 0) {
    console.log("Aucun cours programmé.");
    return timetable;
  }

  const rows = timetable.slice(0, 50).map((t) => [
    t.jour || "-",
    t.heure_debut?.substring(0, 5) || "-",
    t.heure_fin?.substring(0, 5) || "-",
    t.module || "-",
    t.salle || "-",
    t.professeur || "-"
  ]);
  printTable(["Jour", "Début", "Fin", "Module", "Salle", "Professeur"], rows);
  
  if (timetable.length > 50) {
    printWarning(`Affichage des 50 premiers résultats sur ${timetable.length}`);
  }
  
  return timetable;
}

export async function manageReservations(options = {}) {
  const spinner = ora("Chargement des réservations...").start();
  const client = createApiClient();
  const response = await client.get("/admin/reservations");
  spinner.stop();

  const reservations = normalizeArrayResponse(response.data);
  
  if (options.json) {
    console.log(JSON.stringify(reservations, null, 2));
    return reservations;
  }

  if (reservations.length === 0) {
    console.log("Aucune réservation.");
    return reservations;
  }

  const rows = reservations.map((r) => [
    r.id || "-",
    r.professeur?.name || "-",
    r.salle?.nom || "-",
    r.date_reservation || "-",
    r.heure_debut?.substring(0, 5) || "-",
    r.heure_fin?.substring(0, 5) || "-",
    r.statut || "-"
  ]);
  printTable(["ID", "Professeur", "Salle", "Date", "Début", "Fin", "Statut"], rows);

  // Interactive mode for pending reservations
  const pendingReservations = reservations.filter(r => r.statut === 'pending');
  if (pendingReservations.length > 0) {
    console.log(`\n${pendingReservations.length} réservation(s) en attente.`);
    
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Que voulez-vous faire?",
        choices: [
          { name: "Traiter une réservation", value: "process" },
          { name: "Quitter", value: "quit" }
        ]
      }
    ]);

    if (action === "process") {
      await processReservationInteractive(pendingReservations);
    }
  }

  return reservations;
}

async function processReservationInteractive(reservations) {
  const { reservationId } = await inquirer.prompt([
    {
      type: "list",
      name: "reservationId",
      message: "Sélectionnez une réservation à traiter:",
      choices: reservations.map(r => ({
        name: `${r.id} - ${r.professeur?.name} (${r.salle?.nom}, ${r.date_reservation})`,
        value: r.id
      }))
    }
  ]);

  const { decision } = await inquirer.prompt([
    {
      type: "list",
      name: "decision",
      message: "Décision:",
      choices: [
        { name: "✅ Valider", value: "validated" },
        { name: "❌ Rejeter", value: "rejected" }
      ]
    }
  ]);

  const spinner = ora("Traitement de la réservation...").start();
  const client = createApiClient();
  await client.patch(`/admin/reservations/${reservationId}/status`, {
    statut: decision
  });
  spinner.succeed("Réservation traitée avec succès");
  printSuccess(`Réservation ${decision === 'validated' ? 'validée' : 'rejetée'}`);
}

export async function viewAbsences(options = {}) {
  const spinner = ora("Chargement des absences...").start();
  const client = createApiClient();
  const response = await client.get("/admin/absences");
  spinner.stop();

  const absences = normalizeArrayResponse(response.data);
  
  if (options.json) {
    console.log(JSON.stringify(absences, null, 2));
    return absences;
  }

  if (absences.length === 0) {
    console.log("Aucune absence enregistrée.");
    return absences;
  }

  const rows = absences.map((a) => [
    a.student?.name || "-",
    a.module?.nom || "-",
    a.date_absence || "-",
    a.est_justifie ? "Oui" : "Non",
    a.statut_justification || "-"
  ]);
  printTable(["Étudiant", "Module", "Date", "Justifiée", "Statut"], rows);
  return absences;
}
