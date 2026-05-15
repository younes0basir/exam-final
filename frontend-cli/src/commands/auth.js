import inquirer from "inquirer";
import ora from "ora";
import { createApiClient, createAuthClient } from "../lib/http.js";
import { setAuth, clearAuth, getUser, setApiBaseUrl } from "../config.js";
import { printSuccess, printError, printInfo } from "../lib/output.js";

export async function loginFlow(options = {}) {
  if (options.baseUrl) {
    setApiBaseUrl(options.baseUrl);
  }

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Email:",
      default: options.email
    },
    {
      type: "password",
      name: "password",
      message: "Mot de passe:",
      mask: "*",
      default: options.password
    }
  ]);

  const spinner = ora("Connexion...").start();
  const authClient = createAuthClient();
  const response = await authClient.post("/api/login", {
    email: answers.email,
    password: answers.password
  });

  setAuth(response.data.token, response.data.user);
  spinner.succeed("Connecte");
  printSuccess(`Bienvenue ${response.data.user.name} (${response.data.user.role})`);
  return response.data.user;
}

export async function logoutFlow() {
  try {
    const spinner = ora("Deconnexion...").start();
    const client = createApiClient();
    await client.post("/logout");
    clearAuth();
    spinner.succeed("Deconnecte");
    printSuccess("Session supprimee.");
  } catch {
    clearAuth();
    printInfo("Session locale supprimee.");
    printError("Backend indisponible pour logout distant, mais session locale effacee.");
  }
}

export async function whoamiFlow() {
  const localUser = getUser();
  if (!localUser) {
    throw new Error("Aucune session");
  }

  const spinner = ora("Verification session...").start();
  const client = createApiClient();
  const response = await client.get("/user");
  spinner.succeed("Session valide");
  printInfo(`${response.data.name} | ${response.data.email} | role=${response.data.role}`);
  return response.data;
}

export function registerAuthCommands(program) {
  const auth = program.command("auth").description("Authentification");

  auth
    .command("login")
    .description("Connexion et stockage du token")
    .option("-e, --email <email>", "Email")
    .option("-p, --password <password>", "Mot de passe")
    .option("--base-url <url>", "API base url (ex: http://localhost:8000)")
    .action(async (options) => {
      try {
        await loginFlow(options);
      } catch (error) {
        printError(
          error?.response?.data?.message ||
            "Echec de connexion. Verifiez les identifiants et l'etat du backend."
        );
        process.exitCode = 1;
      }
    });

  auth
    .command("logout")
    .description("Suppression de la session locale + logout API")
    .action(async () => {
      await logoutFlow();
    });

  auth
    .command("whoami")
    .description("Afficher utilisateur courant")
    .action(async () => {
      try {
        await whoamiFlow();
      } catch {
        printError("Session invalide ou backend indisponible.");
        process.exitCode = 1;
      }
    });
}
