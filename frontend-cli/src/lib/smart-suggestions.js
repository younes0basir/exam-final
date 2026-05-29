import { getUser, getApiBaseUrl } from "../config.js";
import chalk from "chalk";

// Smart command suggestions based on user role and context
export function getSmartSuggestions(context = {}) {
  const user = getUser();
  if (!user) return [];

  const suggestions = {
    admin: [
      {
        command: "upf admin dashboard",
        description: "View real-time university statistics",
        icon: "📊",
        priority: 1
      },
      {
        command: "upf admin users --role student",
        description: "List all students",
        icon: "👥",
        priority: 2
      },
      {
        command: "upf admin requests",
        description: "Process pending administrative requests",
        icon: "📝",
        priority: 3
      },
      {
        command: "upf admin absences",
        description: "Monitor student attendance",
        icon: "📋",
        priority: 4
      }
    ],
    professor: [
      {
        command: "upf professor dashboard",
        description: "View your teaching overview",
        icon: "📚",
        priority: 1
      },
      {
        command: "upf professor modules",
        description: "See your assigned courses",
        icon: "📖",
        priority: 2
      },
      {
        command: "upf professor grades",
        description: "Manage student grades",
        icon: "✏️",
        priority: 3
      },
      {
        command: "upf professor sessions",
        description: "View course sessions (cahier de textes)",
        icon: "📅",
        priority: 4
      }
    ],
    student: [
      {
        command: "upf student dashboard",
        description: "View your academic summary",
        icon: "🎓",
        priority: 1
      },
      {
        command: "upf student grades",
        description: "Check your latest grades",
        icon: "📈",
        priority: 2
      },
      {
        command: "upf student timetable",
        description: "View your weekly schedule",
        icon: "⏰",
        priority: 3
      },
      {
        command: "upf student materials",
        description: "Access course materials",
        icon: "📁",
        priority: 4
      }
    ]
  };

  const roleSuggestions = suggestions[user.role] || [];
  
  // Filter based on context if provided
  if (context.lastCommand) {
    // Could add contextual filtering logic here
  }

  return roleSuggestions.sort((a, b) => a.priority - b.priority);
}

// Display smart suggestions with formatting
export function displaySmartSuggestions(context = {}) {
  const suggestions = getSmartSuggestions(context);
  
  if (suggestions.length === 0) return;

  console.log(chalk.dim("\n" + "─".repeat(50)));
  console.log(chalk.bold.cyan("💡 Smart Suggestions:"));
  console.log(chalk.dim("─".repeat(50)));
  
  suggestions.slice(0, 3).forEach((suggestion, index) => {
    const number = chalk.yellow(`${index + 1}.`);
    const icon = suggestion.icon;
    const cmd = chalk.green(suggestion.command);
    const desc = chalk.dim(suggestion.description);
    
    console.log(`  ${number} ${icon} ${cmd}\n     ${desc}`);
  });
  
  console.log(chalk.dim("─".repeat(50) + "\n"));
}

// Predict next likely command based on usage patterns
export function predictNextCommand(lastCommands = []) {
  const user = getUser();
  if (!user || lastCommands.length === 0) return null;

  const patterns = {
    admin: {
      "dashboard": "users",
      "users": "requests",
      "requests": "absences"
    },
    professor: {
      "dashboard": "modules",
      "modules": "grades",
      "grades": "sessions"
    },
    student: {
      "dashboard": "grades",
      "grades": "timetable",
      "timetable": "materials"
    }
  };

  const lastCmd = lastCommands[lastCommands.length - 1];
  const userPatterns = patterns[user.role];
  
  return userPatterns[lastCmd] || null;
}

// Quick tips based on time of day
export function getTimeBasedTip() {
  const hour = new Date().getHours();
  const user = getUser();
  
  if (!user) return null;

  const tips = {
    morning: {
      admin: "🌅 Good morning! Check overnight administrative requests.",
      professor: "🌅 Good morning! Review today's teaching schedule.",
      student: "🌅 Good morning! Check today's classes and assignments."
    },
    afternoon: {
      admin: "☀️ Midday reminder: Process pending reservations.",
      professor: "☀️ Afternoon tip: Update course sessions after classes.",
      student: "☀️ Afternoon tip: Review morning lecture materials."
    },
    evening: {
      admin: "🌆 Evening check: Review daily statistics.",
      professor: "🌆 Evening reminder: Grade submissions before deadline.",
      student: "🌆 Evening tip: Prepare for tomorrow's classes."
    }
  };

  let timePeriod = "morning";
  if (hour >= 12 && hour < 17) timePeriod = "afternoon";
  else if (hour >= 17) timePeriod = "evening";

  return tips[timePeriod][user.role];
}

// Show contextual help
export function showContextualHelp(currentCommand) {
  const helpMap = {
    "dashboard": [
      "Use --json flag to export data",
      "Data refreshes automatically every 60 seconds",
      "Press Ctrl+C to return to menu"
    ],
    "grades": [
      "Filter by module using --module-id",
      "Export grades with --json > grades.csv",
      "Only professors can modify grades"
    ],
    "users": [
      "Filter by role: --role student|professor|admin",
      "Search by name or email",
      "Admin only: Can create and delete users"
    ]
  };

  const tips = helpMap[currentCommand];
  if (!tips) return;

  console.log(chalk.dim("\nℹ️  Quick Help:"));
  tips.forEach(tip => {
    console.log(chalk.dim(`   • ${tip}`));
  });
  console.log("");
}
