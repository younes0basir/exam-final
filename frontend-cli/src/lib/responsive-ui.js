import chalk from "chalk";
import boxen from "boxen";

// Responsive width detection
function getTerminalWidth() {
  return process.stdout.columns || 80;
}

function getResponsiveWidth(preferredWidth = 60) {
  const terminalWidth = getTerminalWidth();
  return Math.min(preferredWidth, terminalWidth - 4);
}

// Enhanced box with responsive width
export function createResponsiveBox(content, options = {}) {
  const width = getResponsiveWidth(options.width || 60);
  
  return boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: options.borderStyle || "round",
    borderColor: options.borderColor || "cyan",
    title: options.title ? chalk.bold(options.title) : undefined,
    titleAlignment: "center",
    textAlignment: options.textAlignment || "left",
    ...options
  });
}

// Responsive table that adapts to terminal width
export function createResponsiveTable(headers, rows, options = {}) {
  const Table = require("cli-table3");
  const terminalWidth = getTerminalWidth();
  
  // Calculate optimal column widths
  const numCols = headers.length;
  const availableWidth = terminalWidth - 10; // Account for borders
  const baseColWidth = Math.floor(availableWidth / numCols);
  
  const colWidths = options.colWidths || Array(numCols).fill(baseColWidth);
  
  const table = new Table({
    head: headers.map(h => chalk.bold.cyan(h)),
    colWidths: colWidths,
    style: {
      head: ["cyan"],
      border: ["gray"]
    },
    wordWrap: true,
    wrapOnWordBoundary: true,
    ...options
  });
  
  rows.forEach(row => {
    table.push(row.map((cell, idx) => {
      // Auto-detect and color status columns
      if (typeof cell === "string") {
        const lowerCell = cell.toLowerCase();
        if (lowerCell.includes("success") || lowerCell.includes("validé") || lowerCell.includes("active")) {
          return chalk.green(cell);
        }
        if (lowerCell.includes("error") || lowerCell.includes("rejeté") || lowerCell.includes("inactive")) {
          return chalk.red(cell);
        }
        if (lowerCell.includes("pending") || lowerCell.includes("en attente") || lowerCell.includes("waiting")) {
          return chalk.yellow(cell);
        }
      }
      return cell;
    }));
  });
  
  return table.toString();
}

// Responsive menu with better spacing
export function createResponsiveMenu(title, choices, options = {}) {
  const width = getResponsiveWidth(options.width || 50);
  const lines = [];
  
  // Title with border
  lines.push(chalk.bold.cyan("─".repeat(width)));
  lines.push(chalk.bold.cyan(title.center(width)));
  lines.push(chalk.bold.cyan("─".repeat(width)));
  lines.push("");
  
  // Choices with icons and better spacing
  choices.forEach((choice, index) => {
    const number = chalk.yellow(`${index + 1}.`.padEnd(3));
    const name = choice.name || choice;
    const disabled = choice.disabled ? chalk.dim(" (disabled)") : "";
    
    lines.push(`  ${number} ${name}${disabled}`);
  });
  
  lines.push("");
  lines.push(chalk.bold.cyan("─".repeat(width)));
  
  return lines.join("\n");
}

// Responsive info panel
export function createInfoPanel(title, items, options = {}) {
  const width = getResponsiveWidth(options.width || 50);
  const content = [];
  
  content.push(chalk.bold.cyan(title));
  content.push(chalk.dim("─".repeat(width)));
  
  items.forEach(item => {
    const label = chalk.bold(`${item.label}:`);
    const value = item.value || "-";
    content.push(`  ${label.padEnd(25)} ${value}`);
  });
  
  return createResponsiveBox(content.join("\n"), {
    borderColor: options.color || "cyan",
    borderStyle: "round"
  });
}

// Responsive status bar
export function createStatusBar(items) {
  const width = getTerminalWidth();
  const segments = [];
  
  items.forEach(item => {
    const icon = item.icon || "•";
    const text = `${icon} ${item.label}: ${chalk.bold(item.value)}`;
    segments.push(text);
  });
  
  const statusBar = segments.join("  |  ");
  
  return chalk.dim("─".repeat(width)) + "\n" + 
         statusBar + "\n" + 
         chalk.dim("─".repeat(width));
}

// Responsive card layout
export function createCard(title, content, options = {}) {
  const width = getResponsiveWidth(options.width || 40);
  
  const cardContent = [
    chalk.bold.cyan(title),
    chalk.dim("─".repeat(width)),
    "",
    content,
    ""
  ];
  
  return boxen(cardContent.join("\n"), {
    padding: 1,
    margin: 1,
    borderStyle: options.borderStyle || "single",
    borderColor: options.color || "cyan",
    titleAlignment: "center"
  });
}

// Multi-column responsive layout
export function createMultiColumn(columns, options = {}) {
  const terminalWidth = getTerminalWidth();
  const numColumns = columns.length;
  const colWidth = Math.floor((terminalWidth - (numColumns - 1) * 4) / numColumns);
  
  const lines = [];
  const maxRows = Math.max(...columns.map(col => col.length));
  
  for (let i = 0; i < maxRows; i++) {
    const rowParts = [];
    
    columns.forEach((col, colIdx) => {
      const cell = col[i] || "";
      rowParts.push(cell.padEnd(colWidth));
    });
    
    lines.push(rowParts.join("  "));
  }
  
  return lines.join("\n");
}

// Responsive progress bar
export function createProgressBar(current, total, options = {}) {
  const width = options.width || 30;
  const percentage = Math.round((current / total) * 100);
  const filled = Math.round((width * current) / total);
  const empty = width - filled;
  
  const bar = chalk.green("█".repeat(filled)) + chalk.gray("░".repeat(empty));
  const text = ` ${percentage}%`;
  
  return `[${bar}]${text}`;
}

// Responsive alert/notification
export function createAlert(message, type = "info") {
  const colors = {
    success: { border: "green", icon: "✓", color: "green" },
    error: { border: "red", icon: "✗", color: "red" },
    warning: { border: "yellow", icon: "⚠", color: "yellow" },
    info: { border: "cyan", icon: "ℹ", color: "cyan" }
  };
  
  const config = colors[type] || colors.info;
  const icon = chalk[config.color](config.icon);
  
  return boxen(`${icon} ${message}`, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: config.color
  });
}

// Responsive divider with optional text
export function createDivider(text = "", char = "─") {
  const width = getTerminalWidth();
  
  if (!text) {
    return chalk.dim(char.repeat(width));
  }
  
  const sideWidth = Math.floor((width - text.length - 2) / 2);
  const left = char.repeat(sideWidth);
  const right = char.repeat(width - sideWidth - text.length - 2);
  
  return chalk.dim(`${left} ${text} ${right}`);
}

// Compact list for small screens
export function createCompactList(items, options = {}) {
  const width = getResponsiveWidth(options.width || 40);
  const lines = [];
  
  items.forEach((item, index) => {
    const bullet = options.bullet || "•";
    const icon = item.icon || "";
    const text = `${icon} ${item.text || item}`;
    
    // Wrap text if too long
    if (text.length > width) {
      const wrapped = text.match(new RegExp(`.{1,${width}}`, 'g')) || [text];
      wrapped.forEach((line, idx) => {
        lines.push(idx === 0 ? `${bullet} ${line}` : `  ${line}`);
      });
    } else {
      lines.push(`${bullet} ${text}`);
    }
  });
  
  return lines.join("\n");
}

// Smart truncation for long text
export function smartTruncate(text, maxLength = 40) {
  if (text.length <= maxLength) return text;
  
  const half = Math.floor((maxLength - 3) / 2);
  return text.substring(0, half) + "..." + text.substring(text.length - half);
}

// Format numbers responsively
export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

// Responsive key-value display
export function createKeyValuePairs(pairs, options = {}) {
  const width = getResponsiveWidth(options.width || 50);
  const lines = [];
  
  pairs.forEach(pair => {
    const key = chalk.bold(`${pair.key}:`).padEnd(20);
    const value = pair.value || "-";
    
    // Handle long values
    if ((key.length + value.length) > width) {
      lines.push(key);
      lines.push(`  ${value}`);
    } else {
      lines.push(`${key} ${value}`);
    }
  });
  
  return lines.join("\n");
}
