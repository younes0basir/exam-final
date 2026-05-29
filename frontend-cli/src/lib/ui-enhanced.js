import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import boxen from "boxen";
import terminalLink from "terminal-link";
import { createResponsiveBox, createResponsiveTable, createStatusBar, createAlert, createDivider } from "./responsive-ui.js";

// Color themes
export const themes = {
  primary: gradient("#667eea", "#764ba2"),
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  info: chalk.cyan,
  accent: gradient("#f093fb", "#f5576c")
};

// Enhanced banner with ASCII art - responsive version
export function showBanner() {
  const width = process.stdout.columns || 80;
  
  // Use smaller banner for narrow terminals
  if (width < 60) {
    console.log(chalk.bold.cyan("╔══════════════════════════════════╗"));
    console.log(chalk.bold.cyan("║       UPF CLI - Smart Edition   ║"));
    console.log(chalk.bold.cyan("╚══════════════════════════════════╝"));
  } else {
    const banner = figlet.textSync("UPF CLI", {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default"
    });
    console.log(themes.primary(banner));
  }
  
  console.log(chalk.dim("Université Privée de Fès - Smart Management System"));
  console.log("");
}

// Beautiful info box - responsive
export function showInfoBox(title, content, options = {}) {
  const { createResponsiveBox } = require("./responsive-ui.js");
  const box = createResponsiveBox(content, {
    title: title,
    borderColor: options.color || "cyan",
    ...options
  });
  
  console.log(box);
}

// Success notification
export function showSuccess(message) {
  console.log(chalk.green("✓ ") + chalk.bold.green(message));
}

// Error notification with details
export function showError(message, details = null) {
  console.log(chalk.red("✗ ") + chalk.bold.red(message));
  if (details) {
    console.log(chalk.dim("  → " + details));
  }
}

// Warning notification
export function showWarning(message) {
  console.log(chalk.yellow("⚠ ") + chalk.bold.yellow(message));
}

// Loading with custom spinner text
export function createSmartSpinner(text) {
  return {
    start: (customText) => {
      console.log(chalk.cyan("⟳ ") + chalk.dim(customText || text));
      return {
        succeed: (msg) => {
          console.log(chalk.green("✓ ") + chalk.green(msg));
        },
        fail: (msg) => {
          console.log(chalk.red("✗ ") + chalk.red(msg));
        }
      };
    }
  };
}

// Smart table with colors and responsiveness
export async function createSmartTable(headers, rows, options = {}) {
  const { createResponsiveTable } = await import("./responsive-ui.js");
  return createResponsiveTable(headers, rows, options);
}

// Progress bar simulation
export function showProgress(task, steps) {
  console.log(chalk.cyan(`\n${task}`));
  steps.forEach((step, index) => {
    const bar = "█".repeat(index + 1) + "░".repeat(steps.length - index - 1);
    console.log(chalk.dim(`  [${bar}] ${step}`));
  });
  console.log("");
}

// Smart suggestions based on context
export function showSuggestions(userRole, lastAction) {
  const suggestions = {
    admin: [
      "💡 Tip: Use 'upf admin dashboard' to see real-time statistics",
      "💡 Tip: Use 'upf admin users --role student' to filter users",
      "💡 Tip: Press Ctrl+C to cancel any operation"
    ],
    professor: [
      "💡 Tip: Use 'upf professor grades' to manage student grades",
      "💡 Tip: Use 'upf professor modules' to see your assigned courses",
      "💡 Tip: Your session expires after 24 hours"
    ],
    student: [
      "💡 Tip: Use 'upf student grades' to check your latest scores",
      "💡 Tip: Use 'upf student timetable' to view your schedule",
      "💡 Tip: Download materials with 'upf student materials'"
    ]
  };
  
  const roleSuggestions = suggestions[userRole] || [];
  if (roleSuggestions.length > 0) {
    console.log(chalk.dim("\n" + roleSuggestions.join("\n")));
  }
}

// Command history tracker
export async function trackCommand(command) {
  const fs = await import("fs");
  const path = await import("path");
  const os = await import("os");
  
  const historyFile = path.join(os.homedir(), ".upf-cli-history");
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${command}\n`;
  
  try {
    fs.appendFileSync(historyFile, entry);
  } catch (error) {
    // Silently fail if can't write history
  }
}

// Quick action shortcuts display
export function showQuickActions() {
  const actions = [
    ["q", "Quit"],
    ["h", "Help"],
    ["r", "Refresh"],
    ["b", "Back"]
  ];
  
  const shortcutText = actions.map(([key, desc]) => 
    chalk.dim(`${chalk.bold(key)}: ${desc}`)
  ).join("  |  ");
  
  console.log("\n" + chalk.dim(shortcutText));
}

// Animated loading sequence
export async function animateLoading(text, duration = 1000) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const frame = frames[Math.floor(elapsed / 80) % frames.length];
      
      process.stdout.write(`\r${chalk.cyan(frame)} ${text}`);
      
      if (elapsed >= duration) {
        clearInterval(interval);
        process.stdout.write("\r" + " ".repeat(text.length + 5) + "\r");
        resolve();
      }
    }, 80);
  });
}

// Status indicator with pulse animation
export function getStatusIndicator(status) {
  const indicators = {
    online: chalk.green("● Online"),
    offline: chalk.red("● Offline"),
    syncing: chalk.yellow("● Syncing..."),
    ready: chalk.cyan("● Ready")
  };
  
  return indicators[status] || status;
}
