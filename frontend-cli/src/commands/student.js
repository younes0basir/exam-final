import ora from "ora";
import { createApiClient } from "../lib/http.js";
import { printError, printTable, printSuccess, printInfo } from "../lib/output.js";

function normalizeArrayResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export function registerStudentCommands(program) {
  const student = program.command("student").description("Commandes étudiant");

  student
    .command("dashboard")
    .description("Voir le tableau de bord étudiant")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await viewStudentDashboard(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement du tableau de bord.");
        process.exitCode = 1;
      }
    });

  student
    .command("grades")
    .description("Voir les notes")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await viewGrades(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement des notes.");
        process.exitCode = 1;
      }
    });

  student
    .command("timetable")
    .description("Voir l'emploi du temps")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await viewTimetable(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement de l'emploi du temps.");
        process.exitCode = 1;
      }
    });

  student
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

  student
    .command("materials")
    .description("Voir les supports de cours")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await viewMaterials(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement des supports.");
        process.exitCode = 1;
      }
    });

  student
    .command("requests")
    .description("Voir les demandes administratives")
    .option("--json", "Sortie JSON")
    .action(async (options) => {
      try {
        await viewRequests(options);
      } catch (error) {
        printError(error?.response?.data?.message || "Erreur lors du chargement des demandes.");
        process.exitCode = 1;
      }
    });
}

export async function viewStudentDashboard(options = {}) {
  const spinner = ora("Chargement du tableau de bord...").start();
  const client = createApiClient();
  const response = await client.get("/student/dashboard/stats");
  spinner.stop();

  const data = response.data;
  
  if (options.json) {
    console.log(JSON.stringify(data, null, 2));
    return data;
  }

  console.log("\n📊 Tableau de Bord Étudiant\n");
  printInfo(`Bienvenue ${data.user?.name || 'Étudiant'}`);
  console.log(`Groupe: ${data.groupe?.nom || 'N/A'}`);
  console.log(`Filière: ${data.filiere?.nom || 'N/A'}\n`);

  if (data.stats) {
    console.log("📈 Statistiques:");
    console.log(`  Moyenne générale: ${data.stats.moyenne_generale || 'N/A'}/20`);
    console.log(`  Taux de présence: ${data.stats.taux_presence || 'N/A'}%`);
    console.log(`  Absences justifiées: ${data.stats.absences_justifiees || 0}`);
    console.log(`  Absences non justifiées: ${data.stats.absences_non_justifiees || 0}\n`);
  }

  return data;
}

export async function viewGrades(options = {}) {
  const spinner = ora("Chargement des notes...").start();
  const client = createApiClient();
  const response = await client.get("/student/grades");
  spinner.stop();

  const grades = normalizeArrayResponse(response.data);
  
  if (options.json) {
    console.log(JSON.stringify(grades, null, 2));
    return grades;
  }

  if (grades.length === 0) {
    console.log("Aucune note disponible.");
    return grades;
  }

  const rows = grades.map((g) => [
    g.module?.nom || g.module || "-",
    g.cc1 ?? "-",
    g.cc2 ?? "-",
    g.examen ?? "-",
    g.note_finale ?? "-"
  ]);
  printTable(["Module", "CC1", "CC2", "Examen", "Note Finale"], rows);
  return grades;
}

export async function viewTimetable(options = {}) {
  const spinner = ora("Chargement de l'emploi du temps...").start();
  const client = createApiClient();
  const response = await client.get("/student/timetable");
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

  const rows = timetable.map((t) => [
    t.jour || "-",
    t.heure_debut?.substring(0, 5) || "-",
    t.heure_fin?.substring(0, 5) || "-",
    t.module?.nom || t.module || "-",
    t.salle?.nom || t.salle || "-",
    t.professeur?.name || t.professeur || "-"
  ]);
  printTable(["Jour", "Début", "Fin", "Module", "Salle", "Professeur"], rows);
  return timetable;
}

export async function viewAbsences(options = {}) {
  const spinner = ora("Chargement des absences...").start();
  const client = createApiClient();
  const response = await client.get("/student/absences");
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
    a.date_absence || "-",
    a.seance_debut?.substring(0, 5) || "-",
    a.seance_fin?.substring(0, 5) || "-",
    a.module?.nom || a.module || "-",
    a.est_justifie ? "Oui" : "Non",
    a.statut_justification || "-"
  ]);
  printTable(["Date", "Début", "Fin", "Module", "Justifiée", "Statut"], rows);
  return absences;
}

export async function viewMaterials(options = {}) {
  const spinner = ora("Chargement des supports de cours...").start();
  const client = createApiClient();
  const response = await client.get("/student/materials");
  spinner.stop();

  const materials = normalizeArrayResponse(response.data);
  
  if (options.json) {
    console.log(JSON.stringify(materials, null, 2));
    return materials;
  }

  if (materials.length === 0) {
    console.log("Aucun support de cours disponible.");
    return materials;
  }

  const rows = materials.map((m) => [
    m.id || "-",
    m.titre || "-",
    m.type || "-",
    m.module?.nom || m.module || "-",
    new Date(m.created_at).toLocaleDateString('fr-FR') || "-"
  ]);
  printTable(["ID", "Titre", "Type", "Module", "Date"], rows);
  return materials;
}

export async function viewRequests(options = {}) {
  const spinner = ora("Chargement des demandes...").start();
  const client = createApiClient();
  const response = await client.get("/student/requests");
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
    r.type || "-",
    r.statut || "-",
    new Date(r.created_at).toLocaleDateString('fr-FR') || "-"
  ]);
  printTable(["ID", "Type", "Statut", "Date"], rows);
  return requests;
}
