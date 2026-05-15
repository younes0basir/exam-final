import ora from "ora";
import inquirer from "inquirer";
import { createApiClient } from "../lib/http.js";
import { printError, printTable, printSuccess, printInfo } from "../lib/output.js";

function normalizeArrayResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export function registerProfessorCommands(program) {
  const professor = program.command("professor").description("Commandes professeur");

  professor
    .command("dashboard")
    .description("Voir le tableau de bord professeur")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await viewProfessorDashboard(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement du tableau de bord.");
        process.exitCode = 1;
      }
    });

  professor
    .command("modules")
    .description("Lister les modules enseignés")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await listProfessorModules(options);
      } catch (error) {
        const message =
          error?.code === "ERR_NETWORK"
            ? "Connexion impossible au backend (http://localhost:8000)."
            : error?.response?.data?.message || "Echec du chargement des modules.";
        printError(message);
        process.exitCode = 1;
      }
    });

  professor
    .command("grades")
    .description("Gérer les notes d'un module")
    .option("--module-id <id>", "ID du module")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await manageGrades(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement des notes.");
        process.exitCode = 1;
      }
    });

  professor
    .command("absences")
    .description("Gérer les absences")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await manageAbsences(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement des absences.");
        process.exitCode = 1;
      }
    });

  professor
    .command("sessions")
    .description("Voir les sessions de cours (cahier de textes)")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await viewSessions(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement des sessions.");
        process.exitCode = 1;
      }
    });

  professor
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
}

export async function listProfessorModules(options = {}) {
  const spinner = ora("Chargement des modules...").start();
  const client = createApiClient();
  const response = await client.get("/professor/modules");
  spinner.stop();

  const modules = normalizeArrayResponse(response.data);
  if (options.json) {
    console.log(JSON.stringify(modules, null, 2));
    return modules;
  }

  if (modules.length === 0) {
    console.log("Aucun module trouve.");
    return modules;
  }

  const rows = modules.map((m) => [
    m.id ?? "-",
    m.nom ?? "-",
    m.code ?? "-",
    typeof m.filiere === "object" ? m.filiere?.nom ?? "-" : m.filiere ?? "-"
  ]);
  printTable(["ID", "Module", "Code", "Filiere"], rows);
  return modules;
}

export async function viewProfessorDashboard(options = {}) {
  const spinner = ora("Chargement du tableau de bord...").start();
  const client = createApiClient();
  const response = await client.get("/professor/dashboard/stats");
  spinner.stop();

  const data = response.data;
  
  if (options.json) {
    console.log(JSON.stringify(data, null, 2));
    return data;
  }

  console.log("\n📊 Tableau de Bord Professeur\n");
  printInfo(`Bienvenue ${data.user?.name || 'Professeur'}`);
  console.log(`Email: ${data.user?.email || 'N/A'}\n`);

  if (data.stats) {
    console.log("📈 Statistiques:");
    console.log(`  Modules enseignés: ${data.stats.total_modules || 0}`);
    console.log(`  Sessions cette semaine: ${data.stats.sessions_this_week || 0}`);
    console.log(`  Absences en attente: ${data.stats.pending_absences || 0}\n`);
  } else {
    // If stats are directly in the response
    console.log("📈 Statistiques:");
    console.log(`  Modules enseignés: ${data.total_modules || 0}`);
    console.log(`  Sessions cette semaine: ${data.sessions_this_week || 0}`);
    console.log(`  Absences en attente: ${data.pending_absences || 0}\n`);
  }

  return data;
}

export async function manageGrades(options = {}) {
  let moduleId = options.moduleId;
  
  if (!moduleId) {
    // Fetch modules and let user choose
    const spinner = ora("Chargement des modules...").start();
    const client = createApiClient();
    const modulesResponse = await client.get("/professor/modules");
    spinner.stop();
    
    const modules = normalizeArrayResponse(modulesResponse.data);
    
    if (modules.length === 0) {
      console.log("Aucun module disponible.");
      return [];
    }

    const { selectedModuleId } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedModuleId",
        message: "Sélectionnez un module:",
        choices: modules.map(m => ({
          name: `${m.nom} (${m.code})`,
          value: m.id
        }))
      }
    ]);
    moduleId = selectedModuleId;
  }

  const spinner = ora("Chargement des notes...").start();
  const client = createApiClient();
  const response = await client.get(`/professor/grades/${moduleId}`);
  spinner.stop();

  const grades = normalizeArrayResponse(response.data);
  
  if (options.json) {
    console.log(JSON.stringify(grades, null, 2));
    return grades;
  }

  if (grades.length === 0) {
    console.log("Aucune note pour ce module.");
    return grades;
  }

  const rows = grades.map((g) => [
    g.student?.name || "-",
    g.cc1 ?? "-",
    g.cc2 ?? "-",
    g.examen ?? "-",
    g.note_finale ?? "-"
  ]);
  printTable(["Étudiant", "CC1", "CC2", "Examen", "Note Finale"], rows);
  return grades;
}

export async function manageAbsences(options = {}) {
  const spinner = ora("Chargement des absences...").start();
  const client = createApiClient();
  const response = await client.get("/professor/absences");
  spinner.stop();

  const absences = normalizeArrayResponse(response.data);
  
  if (options.json) {
    console.log(JSON.stringify(absences, null, 2));
    return absences;
  }

  if (absences.length === 0) {
    console.log("Aucune absence à traiter.");
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

  // Interactive mode for pending justifications
  const pendingAbsences = absences.filter(a => a.statut_justification === 'pending');
  if (pendingAbsences.length > 0) {
    console.log(`\n${pendingAbsences.length} absence(s) en attente de justification.`);
    
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Que voulez-vous faire?",
        choices: [
          { name: "Traiter une absence", value: "process" },
          { name: "Quitter", value: "quit" }
        ]
      }
    ]);

    if (action === "process") {
      await processAbsenceInteractive(pendingAbsences);
    }
  }

  return absences;
}

async function processAbsenceInteractive(absences) {
  const { absenceId } = await inquirer.prompt([
    {
      type: "list",
      name: "absenceId",
      message: "Sélectionnez une absence à traiter:",
      choices: absences.map(a => ({
        name: `${a.student?.name} - ${a.date_absence} (${a.module?.nom})`,
        value: a.id
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

  const spinner = ora("Traitement de l'absence...").start();
  const client = createApiClient();
  await client.patch(`/professor/absences/${absenceId}/validate`, {
    statut_justification: decision,
    motif_rejet: motif_rejet || undefined
  });
  spinner.succeed("Absence traitée avec succès");
  printSuccess(`Absence ${decision === 'validated' ? 'validée' : 'rejetée'}`);
}

export async function viewSessions(options = {}) {
  const spinner = ora("Chargement des sessions...").start();
  const client = createApiClient();
  const response = await client.get("/professor/sessions");
  spinner.stop();

  const sessions = normalizeArrayResponse(response.data);
  
  if (options.json) {
    console.log(JSON.stringify(sessions, null, 2));
    return sessions;
  }

  if (sessions.length === 0) {
    console.log("Aucune session enregistrée.");
    return sessions;
  }

  const rows = sessions.slice(0, 20).map((s) => [
    s.date_seance || "-",
    s.heure_debut?.substring(0, 5) || "-",
    s.heure_fin?.substring(0, 5) || "-",
    s.module?.nom || "-",
    s.groupe?.nom || "-",
    s.nature || "-"
  ]);
  printTable(["Date", "Début", "Fin", "Module", "Groupe", "Nature"], rows);
  
  if (sessions.length > 20) {
    printInfo(`Affichage des 20 premières sessions sur ${sessions.length}`);
  }
  
  return sessions;
}

export async function manageReservations(options = {}) {
  const spinner = ora("Chargement des réservations...").start();
  const client = createApiClient();
  const response = await client.get("/professor/reservations");
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
    r.salle?.nom || "-",
    r.date_reservation || "-",
    r.heure_debut?.substring(0, 5) || "-",
    r.heure_fin?.substring(0, 5) || "-",
    r.motif || "-",
    r.statut || "-"
  ]);
  printTable(["ID", "Salle", "Date", "Début", "Fin", "Motif", "Statut"], rows);
  return reservations;
}
