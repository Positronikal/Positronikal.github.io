// Complete commands.js file with all functions
import { buildVirtualFS } from './tree';

const contentModules = import.meta.glob('/src/content/**/*.md', { eager: true });

const contentEntries = Object.entries(contentModules).map(([file, mod]) => ({
  file,
  module: mod,
}));

const commandRegistry = {
  // Core system commands
  help: {
    description: 'Display available commands',
    execute: async () => generateHelpOutput(),
  },
  about: {
    description: 'Display information about Positronikal',
    execute: async () => generateAboutOutput(),
  },
  whoami: {
    description: 'Display user information',
    execute: async () => commandRegistry['cat'].execute(['whoami.md']),
  },

  // File system commands
  ls: {
    description: 'List directory contents',
    execute: async args => generateLsOutput(args),
  },
  cat: {
    description: 'Display file contents',
    execute: async args => {
      if (!args || args.length === 0) {
        return errorOutput('Missing filename. Usage: cat [filename]');
      }
      return generateCatOutput(args[0]);
    },
  },
  cd: {
    description: 'Change directory',
    execute: async args => {
      if (!args || args.length === 0) {
        return textOutput('Current directory: /home/positronikal');
      }
      const directory = args[0];
      if (directory === '..') {
        const currentPath = window.location.pathname.split('/');
        if (currentPath.length > 1) {
          currentPath.pop();
          const newPath = currentPath.join('/') || '/';
          window.location.href = newPath;
          return textOutput(`Navigating to ${newPath}...`);
        } else {
          return textOutput('Already at root directory.');
        }
      }
      const validDirectories = ['projects', 'docs', 'about'];
      if (validDirectories.includes(directory)) {
        window.location.href = `/${directory}`;
        return textOutput(`Navigating to /${directory}...`);
      } else {
        return errorOutput(`Directory '${directory}' not found.`);
      }
    },
  },
  pwd: {
    description: 'Print working directory',
    execute: async () => {
      const path = window.location.pathname || '/';
      return textOutput(`/home/positronikal${path}`);
    },
  },

  // Digital forensics commands
  projects: {
    description: 'List digital forensics projects',
    execute: async () => generateProjectsOutput(),
  },
  ewftools: {
    description: 'Information about libewf-legacy-win project',
    execute: async () => generateEWFToolsOutput(),
  },
  carnivore: {
    description: 'Information about CarnivoreLE project',
    execute: async () => generateCarnivoreOutput(),
  },
  backup: {
    description: 'Information about simpleBackup project',
    execute: async () => generateBackupOutput(),
  },
  macports: {
    description: 'Information about macportsAssistant project',
    execute: async () => generateMacPortsOutput(),
  },

  // Security and development commands
  gpg: {
    description: 'Display GPG public key information',
    execute: async () => generateGPGOutput(),
  },
  dco: {
    description: 'Display Developer Certificate of Origin requirements',
    execute: async () => generateDCOOutput(),
  },
  security: {
    description: 'Display security policies and guidelines',
    execute: async () => generateSecurityOutput(),
  },

  // System information commands
  uname: {
    description: 'Print system information',
    execute: async () => textOutput('PositronikalOS Terminal v1.0.0 - Digital Forensics Platform'),
  },
  neofetch: {
    description: 'Display system information in cybersecurity style',
    execute: async () => generateNeofetchOutput(),
  },
  uptime: {
    description: 'Show system uptime',
    execute: async () => {
      const bootTime = new Date(window.positronikalData?.bootTime || Date.now());
      const uptime = Date.now() - bootTime.getTime();
      const hours = Math.floor(uptime / (1000 * 60 * 60));
      const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
      return textOutput(`System uptime: ${hours}h ${minutes}m`);
    },
  },

  // Utility commands
  clear: {
    description: 'Clear the terminal',
    execute: async () => {
      document.getElementById('terminal-output').innerHTML = '';
      return '';
    },
  },
  history: {
    description: 'Display command history',
    execute: async () => {
      const commandHistory = window.terminalHistory || [];
      if (commandHistory.length === 0) {
        return textOutput('No command history.');
      }
      let historyOutput = `<h2 class="text-terminal-yellow text-xl mb-4">Command History:</h2><div class="space-y-1">`;
      commandHistory.forEach((cmd, index) => {
        historyOutput += `<div><span class="text-terminal-gray">${index + 1}</span> <span class="text-terminal-white">${cmd}</span></div>`;
      });
      historyOutput += '</div>';
      return historyOutput;
    },
  },
  echo: {
    description: 'Display a line of text',
    execute: async args => {
      if (!args || args.length === 0) return textOutput('');
      return textOutput(args.join(' '));
    },
  },
  date: {
    description: 'Display current date and time',
    execute: async () => {
      const now = new Date();
      return textOutput(now.toUTCString());
    },
  },
  github: {
    description: 'Open Positronikal GitHub profile',
    execute: async () => {
      window.open('https://github.com/Positronikal', '_blank');
      return textOutput('Opening Positronikal GitHub profile...');
    },
  },
  contact: {
    description: 'Display contact information',
    execute: async () => generateContactOutput(),
  },
  man: {
    description: 'Display manual page for a command',
    execute: async args => {
      if (!args || args.length === 0) {
        return errorOutput('What manual page do you want? Usage: man [command]');
      }
      const command = args[0].toLowerCase();
      if (!commandRegistry[command]) {
        return errorOutput(`No manual entry for ${command}`);
      }
      return generateManOutput(command);
    },
  },
  matrix: {
    description: 'Activate matrix mode',
    execute: async () => {
      createMatrixEffect();
      return textOutput('Matrix mode activated... Follow the white rabbit.');
    },
  },
  hack: {
    description: 'Initiate hacking sequence (just for fun)',
    execute: async () => generateHackingSequence(),
  },
};

// Helper functions
function textOutput(text) {
  return `<div class="text-terminal-gray">${text}</div>`;
}

function errorOutput(text) {
  return `<div class="text-terminal-error-red">ERROR: ${text}</div>`;
}

function warningOutput(text) {
  return `<div class="text-terminal-warning-amber">WARNING: ${text}</div>`;
}

function successOutput(text) {
  return `<div class="text-terminal-green">SUCCESS: ${text}</div>`;
}

function generateHelpOutput() {
  const categories = {
    'System': ['help', 'about', 'whoami', 'clear', 'uname', 'neofetch', 'uptime'],
    'Navigation': ['ls', 'cd', 'pwd', 'cat'],
    'Projects': ['projects', 'ewftools', 'carnivore', 'backup', 'macports'],
    'Security': ['gpg', 'dco', 'security'],
    'Utilities': ['history', 'echo', 'date', 'github', 'contact', 'man'],
    'Extras': ['matrix', 'hack']
  };

  let output = `<h2 class="text-terminal-yellow text-xl mb-4">Positronikal Terminal - Available Commands:</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">`;
  
  Object.entries(categories).forEach(([category, commands]) => {
    output += `<div class="mb-4"><h3 class="text-terminal-matrix-green font-bold mb-2">${category}:</h3>`;
    commands.forEach(cmd => {
      if (commandRegistry[cmd]) {
        output += `<div class="terminal-command-help ml-2"><span class="text-terminal-white">${cmd}</span><span class="text-terminal-gray"> - ${commandRegistry[cmd].description}</span></div>`;
      }
    });
    output += `</div>`;
  });

  output += `</div><div class="mt-4 text-terminal-cyan"><p>💡 Tip: Use Tab for command completion, ↑/↓ for history, Ctrl+L to clear</p></div>`;
  return output;
}

function generateAboutOutput() {
  return `
    <div class="space-y-4">
      <h2 class="text-terminal-yellow text-2xl">About Positronikal</h2>
      
      <div class="cyber-card">
        <p class="text-terminal-white mb-4">
          <strong>Positronikal</strong> is the research and development moniker for 
          <span class="text-terminal-yellow">Hoyt Harness</span>, a digital forensics and 
          cybersecurity specialist with over 20 years of experience.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h3 class="text-terminal-matrix-green font-bold mb-2">Background:</h3>
            <ul class="list-disc list-inside space-y-1 text-terminal-gray">
              <li>Former government cyber investigator</li>
              <li>Senior Curriculum Developer, Digital Forensics</li>
              <li>Independent security researcher</li>
              <li>Open source contributor</li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-terminal-matrix-green font-bold mb-2">Focus Areas:</h3>
            <ul class="list-disc list-inside space-y-1 text-terminal-gray">
              <li>Digital forensics tools</li>
              <li>Cyber investigation techniques</li>
              <li>Evidence acquisition & analysis</li>
              <li>Security research & development</li>
            </ul>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-terminal-forensics-blue bg-opacity-20 border border-terminal-forensics-blue border-opacity-30 rounded">
          <p class="text-terminal-info-cyan text-sm">
            All public projects emphasize security, reliability, and adherence to forensic standards.
            GPG signature verification and Developer Certificate of Origin are required for all contributions.
          </p>
        </div>
      </div>
    </div>
  `;
}

function generateProjectsOutput() {
  return `
    <h2 class="text-terminal-yellow text-xl mb-4">Digital Forensics Projects:</h2>
    
    <div class="space-y-4">
      <div class="project-card">
        <h3 class="project-title text-terminal-white font-bold">libewf-legacy-win</h3>
        <span class="project-status status-active">Active</span>
        <p class="text-terminal-gray mt-2">Expert Witness Format tools for Windows AMD64. Complete build environment with Visual Studio 2022 support.</p>
        <a href="https://github.com/Positronikal/libewf-legacy-win" class="project-link">→ View Project</a>
      </div>
      
      <div class="project-card">
        <h3 class="project-title text-terminal-white font-bold">CarnivoreLE</h3>
        <span class="project-status status-deprecated">Deprecated</span>
        <p class="text-terminal-gray mt-2">Legacy network packet capture and analysis tool (archived as of Dec 31, 2020).</p>
        <a href="https://github.com/Positronikal/CarnivoreLE" class="project-link">→ View Archive</a>
      </div>
      
      <div class="project-card">
        <h3 class="project-title text-terminal-white font-bold">simpleBackup</h3>
        <span class="project-status status-active">Active</span>
        <p class="text-terminal-gray mt-2">Bash-based backup utility for Debian systems using rsync and dialog.</p>
        <a href="https://github.com/Positronikal/simpleBackup" class="project-link">→ View Project</a>
      </div>
      
      <div class="project-card">
        <h3 class="project-title text-terminal-white font-bold">macportsAssistant</h3>
        <span class="project-status status-maintenance">Maintenance</span>
        <p class="text-terminal-gray mt-2">macOS version-agnostic MacPorts installation and maintenance automation.</p>
        <a href="https://github.com/Positronikal/macportsAssistant" class="project-link">→ View Project</a>
      </div>
    </div>
    
    <div class="mt-6 text-terminal-cyan">
      <p>Use commands like 'ewftools', 'carnivore', 'backup', or 'macports' for detailed project information.</p>
    </div>
  `;
}

// Simplified function stubs for remaining generate functions
function generateEWFToolsOutput() {
  return `
    <div class="cyber-card">
      <h2 class="text-terminal-yellow text-xl mb-4">libewf-legacy-win Project</h2>
      
      <div class="mb-4">
        <span class="project-status status-active">Active Development</span>
        <span class="license-badge ml-2">LGPL-3.0</span>
      </div>
      
      <p class="text-terminal-white mb-4">
        A comprehensive Windows AMD64 build of the Expert Witness Format (EWF) tools, 
        forked from libyal/libewf-legacy with Windows-specific optimizations.
      </p>
      
      <div class="forensics-log">
        <h3 class="text-terminal-forensics-blue font-bold mb-2">Technical Details:</h3>
        <ul class="list-disc list-inside space-y-1 text-terminal-gray">
          <li>Built with Visual Studio 2022</li>
          <li>Includes PowerShell build automation scripts</li>
          <li>Pre-compiled binaries available</li>
          <li>Upgraded prerequisite files for modern Windows</li>
          <li>Complete supporting library stack</li>
        </ul>
      </div>
      
      <div class="mt-4">
        <h3 class="text-terminal-matrix-green font-bold mb-2">Available Tools:</h3>
        <div class="grid grid-cols-2 gap-2 text-sm font-mono">
          <span class="text-terminal-cyan">ewfacquire</span>
          <span class="text-terminal-cyan">ewfacquirestream</span>
          <span class="text-terminal-cyan">ewfexport</span>
          <span class="text-terminal-cyan">ewfinfo</span>
          <span class="text-terminal-cyan">ewfmount</span>
          <span class="text-terminal-cyan">ewfrecover</span>
          <span class="text-terminal-cyan">ewfverify</span>
          <span class="text-terminal-cyan">ewfdebug</span>
        </div>
      </div>
      
      <div class="mt-4 text-terminal-yellow">
        <p><strong>Repository:</strong> <a href="https://github.com/Positronikal/libewf-legacy-win" class="project-link">github.com/Positronikal/libewf-legacy-win</a></p>
      </div>
    </div>
  `;
}
function generateCarnivoreOutput() { return `<p class="text-terminal-yellow">Carnivore LE information would go here...</p>`; }
function generateBackupOutput() { return `<p class="text-terminal-yellow">simpleBackup information would go here...</p>`; }
function generateMacPortsOutput() { return `<p class="text-terminal-yellow">macportsAssistant information would go here...</p>`; }
function generateGPGOutput() { return `<p class="text-terminal-yellow">GPG information would go here...</p>`; }
function generateDCOOutput() { return `<p class="text-terminal-yellow">DCO information would go here...</p>`; }
function generateSecurityOutput() { return `<p class="text-terminal-yellow">Security information would go here...</p>`; }
function generateContactOutput() { return `<p class="text-terminal-yellow">Contact information would go here...</p>`; }
function generateNeofetchOutput() {
  return `
    <div class="flex flex-col md:flex-row gap-6 text-sm font-mono">
      <div class="ascii-art text-terminal-matrix-green">
    ██████╗  ██████╗ ███████╗██╗████████╗██████╗  ██████╗ ███╗   ██╗██╗██╗  ██╗ █████╗ ██╗     
    ██╔══██╗██╔═══██╗██╔════╝██║╚══██╔══╝██╔══██╗██╔═══██╗████╗  ██║██║██║ ██╔╝██╔══██╗██║     
    ██████╔╝██║   ██║███████╗██║   ██║   ██████╔╝██║   ██║██╔██╗ ██║██║█████╔╝ ███████║██║     
    ██╔═══╝ ██║   ██║╚════██║██║   ██║   ██╔══██╗██║   ██║██║╚██╗██║██║██╔═██╗ ██╔══██║██║     
    ██║     ╚██████╔╝███████║██║   ██║   ██║  ██║╚██████╔╝██║ ╚████║██║██║  ██╗██║  ██║███████╗
    ╚═╝      ╚═════╝ ╚══════╝╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
      </div>
      
      <div class="flex flex-col justify-center space-y-1 text-terminal-green">
        <div>
          <span class="text-terminal-yellow font-bold w-32 inline-block">Platform:</span>
          Digital Forensics Terminal
        </div>
        <div>
          <span class="text-terminal-yellow font-bold w-32 inline-block">Framework:</span>
          Astro 5 + TypeScript
        </div>
        <div>
          <span class="text-terminal-yellow font-bold w-32 inline-block">Host:</span>
          positronikal@github.io
        </div>
        <div>
          <span class="text-terminal-yellow font-bold w-32 inline-block">Shell:</span>
          CyberShell v1.0.0
        </div>
        <div>
          <span class="text-terminal-yellow font-bold w-32 inline-block">Uptime:</span>
          ${Math.floor((Date.now() - new Date(window.positronikalData?.bootTime || Date.now()).getTime()) / 60000)} minutes
        </div>
        <div>
          <span class="text-terminal-yellow font-bold w-32 inline-block">Security:</span>
          GPG Enforced
        </div>
        <div>
          <span class="text-terminal-yellow font-bold w-32 inline-block">Packages:</span>
          4 active projects
        </div>
        <div>
          <span class="text-terminal-yellow font-bold w-32 inline-block">License:</span>
          CC-BY-4.0 / GPL-3.0
        </div>
        <div>
          <span class="text-terminal-yellow font-bold w-32 inline-block">Purpose:</span>
          Digital Forensics Research
        </div>
      </div>
    </div>
  `;
}
function generateHackingSequence() { return `<p class="text-terminal-yellow">Hacking sequence simulation would go here...</p>`; }

function generateLsOutput(args = []) {
  return `<p class="text-terminal-cyan">Directory listing for ${args[0] || 'current directory'}</p>`;
}

async function generateCatOutput(filename) {
  const entry = contentEntries.find(e => e.file.endsWith(filename));
  if (entry) {
    try {
      const html = await entry.module.compiledContent();
      return `<div class="markdown-content">${html}</div>`;
    } catch (error) {
      return errorOutput(`Error reading file: ${filename}`);
    }
  }
  return errorOutput(`File '${filename}' not found.`);
}

function generateManOutput(command) {
  const cmd = commandRegistry[command];
  if (!cmd) {
    return errorOutput(`No manual entry for ${command}`);
  }
  return `<h2 class="text-terminal-yellow">Manual: ${command}</h2><p class="text-terminal-gray">${cmd.description}</p>`;
}

function getCommandSynopsis(command) {
  return command;
}

function getCommandDescription(command) {
  return commandRegistry[command]?.description || 'No description available.';
}

function createMatrixEffect() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789日本ハッカー';
  const matrix = document.createElement('div');
  matrix.className = 'fixed inset-0 pointer-events-none z-50 opacity-50';
  
  // Create falling matrix columns
  for (let i = 0; i < 50; i++) {
    const column = document.createElement('div');
    column.className = 'absolute text-terminal-matrix-green font-mono text-xs';
    column.style.left = Math.random() * 100 + '%';
    column.style.top = '-100px';
    column.style.whiteSpace = 'pre';
    
    // Create column of characters
    let columnText = '';
    for (let j = 0; j < 30; j++) {
      columnText += chars[Math.floor(Math.random() * chars.length)] + '\n';
    }
    column.textContent = columnText;
    
    // Animate the column falling
    const animationDuration = Math.random() * 3 + 2; // 2-5 seconds
    const delay = Math.random() * 2; // 0-2 second delay
    
    column.style.animation = `matrix-fall ${animationDuration}s linear ${delay}s infinite`;
    matrix.appendChild(column);
  }
  
  // Add CSS animation if not already present
  if (!document.querySelector('#matrix-animation-style')) {
    const style = document.createElement('style');
    style.id = 'matrix-animation-style';
    style.textContent = `
      @keyframes matrix-fall {
        0% { transform: translateY(-100vh); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(100vh); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(matrix);
  
  // Clean up after 8 seconds
  setTimeout(() => {
    if (matrix.parentNode) {
      matrix.parentNode.removeChild(matrix);
    }
  }, 8000);
}

export { commandRegistry, textOutput, errorOutput, warningOutput, successOutput };