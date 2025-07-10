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
    description: 'Information about EWF Tools for Windows x64 project',
    execute: async () => generateEWFToolsOutput(),
  },
  carnivore: {
    description: 'Information about CarnivoreLE project',
    execute: async () => generateCarnivoreOutput(),
  },
  davinci: {
    description: 'Information about DaVinci MCP Professional project',
    execute: async () => generateDaVinciOutput(),
  },
  doxygen: {
    description: 'Information about Doxygen MCP project',
    execute: async () => generateDoxygenOutput(),
  },
  macports: {
    description: 'Information about macportsAssistant project',
    execute: async () => generateMacPortsOutput(),
  },

  // Security and development commands
  standards: {
    description: 'Display Positronikal Coding Standards information',
    execute: async () => generateStandardsOutput(),
  },
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
  credits: {
    description: 'Display credits and acknowledgments',
    execute: async () => generateCreditsOutput(),
  },
  matrix: {
    description: 'Activate matrix mode',
    execute: async () => {
      createMatrixEffect();
      return textOutput('Matrix mode activated... Follow the white rabbit.');
    },
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
    'Projects': ['projects', 'ewftools', 'carnivore', 'davinci', 'doxygen', 'macports'],
    'Security': ['gpg', 'dco', 'security'],
    'Utilities': ['history', 'echo', 'date', 'github', 'contact', 'man', 'credits'],
    'Extras': ['matrix']
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
      
      <div class="cyber-card">
        <h3 class="text-terminal-matrix-green font-bold mb-3 flex items-center">
          <span class="mr-2">🤖</span>
          AI Development Partner
        </h3>
        <p class="text-terminal-white mb-3">
          This cybersecurity platform was developed in collaboration with 
          <a href="https://claude.ai" class="text-terminal-cyan hover:text-terminal-white font-bold transition-colors duration-200">Claude</a>, 
          an AI assistant created by 
          <a href="https://anthropic.com" class="text-terminal-cyan hover:text-terminal-white font-bold transition-colors duration-200">Anthropic</a>. 
          From terminal roll-up functionality to GitHub Flow implementation, every feature was 
          built through collaborative problem-solving and iterative development.
        </p>
        <div class="text-terminal-gray text-sm">
          <p class="mb-2">
            💻 <strong class="text-terminal-warning-amber">Technical contributions:</strong> 
            Astro 5 implementation, terminal interface design, cybersecurity theming, 
            GitHub Flow workflow, and repository migration strategy.
          </p>
          <p>
            🎯 <strong class="text-terminal-warning-amber">Partnership approach:</strong> 
            Collaborative development, technical mentoring, and respectful of your vision 
            and 20+ years of cybersecurity expertise.
          </p>
        </div>
      </div>
      
      <div class="cyber-card">
        <h3 class="text-terminal-matrix-green font-bold mb-3 flex items-center">
          <span class="mr-2">🤖</span>
          AI Development Partner
        </h3>
        <p class="text-terminal-white mb-3">
          This cybersecurity platform was developed in collaboration with 
          <a href="https://claude.ai" class="text-terminal-cyan hover:text-terminal-white font-bold transition-colors duration-200">Claude</a>, 
          an AI assistant created by 
          <a href="https://anthropic.com" class="text-terminal-cyan hover:text-terminal-white font-bold transition-colors duration-200">Anthropic</a>. 
          From terminal roll-up functionality to GitHub Flow implementation, every feature was 
          built through collaborative problem-solving and iterative development.
        </p>
        <div class="text-terminal-gray text-sm">
          <p class="mb-2">
            💻 <strong class="text-terminal-warning-amber">Technical contributions:</strong> 
            Astro 5 implementation, terminal interface design, cybersecurity theming, 
            GitHub Flow workflow, and repository migration strategy.
          </p>
          <p>
            🎯 <strong class="text-terminal-warning-amber">Partnership approach:</strong> 
            Collaborative development, technical mentoring, and respectful of your vision 
            and 20+ years of cybersecurity expertise.
          </p>
        </div>
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
        <h3 class="project-title text-terminal-white font-bold">EWF Tools for Windows x64</h3>
        <span class="project-status status-active">Active</span>
        <p class="text-terminal-gray mt-2">Expert Witness Format tools for Windows AMD64. Complete build environment with Visual Studio 2022 support.</p>
        <a href="https://github.com/Positronikal/ewf-tools-win64" class="project-link">→ View Project</a>
      </div>
      
      <div class="project-card">
        <h3 class="project-title text-terminal-white font-bold">DaVinci MCP Professional</h3>
        <span class="project-status status-active">Active</span>
        <p class="text-terminal-gray mt-2">Enterprise-grade MCP server exposing full DaVinci Resolve functionality to Claude for Windows and Cursor MCP clients.</p>
        <a href="https://github.com/Positronikal/davinci-mcp-professional" class="project-link">→ View Project</a>
      </div>
      
      <div class="project-card">
        <h3 class="project-title text-terminal-white font-bold">Doxygen MCP</h3>
        <span class="project-status status-active">Active</span>
        <p class="text-terminal-gray mt-2">MCP server exposing full Doxygen functionality to automate documentation generation from source code comments.</p>
        <a href="https://github.com/Positronikal/doxygen-mcp" class="project-link">→ View Project</a>
      </div>
      
      <div class="project-card">
        <h3 class="project-title text-terminal-white font-bold">CarnivoreLE</h3>
        <span class="project-status status-deprecated">Deprecated</span>
        <p class="text-terminal-gray mt-2">Legacy network packet capture and analysis tool (archived as of Dec 31, 2020).</p>
        <a href="https://github.com/Positronikal/CarnivoreLE" class="project-link">→ View Archive</a>
      </div>
      
      <div class="project-card">
        <h3 class="project-title text-terminal-white font-bold">macportsAssistant</h3>
        <span class="project-status status-maintenance">Maintenance</span>
        <p class="text-terminal-gray mt-2">macOS version-agnostic MacPorts installation and maintenance automation.</p>
        <a href="https://github.com/Positronikal/macportsAssistant" class="project-link">→ View Project</a>
      </div>
    </div>
    
    <div class="mt-6 text-terminal-cyan">
      <p>Use commands like 'ewftools', 'davinci', 'doxygen', 'carnivore', or 'macports' for detailed project information.</p>
    </div>
  `;
}

// Simplified function stubs for remaining generate functions
function generateEWFToolsOutput() {
  return `
    <div class="cyber-card">
      <h2 class="text-terminal-yellow text-xl mb-4">EWF Tools for Windows x64 Project</h2>
      
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
        <p><strong>Repository:</strong> <a href="https://github.com/Positronikal/ewf-tools-win64" class="project-link">github.com/Positronikal/ewf-tools-win64</a></p>
      </div>
    </div>
  `;
}
function generateCarnivoreOutput() {
  return `
    <div class="cyber-card">
      <h2 class="text-terminal-yellow text-xl mb-4">CarnivoreLE Project</h2>
      
      <div class="mb-4">
        <span class="project-status status-deprecated">Deprecated</span>
        <span class="license-badge ml-2">GPLv3</span>
      </div>
      
      <div class="mt-4 p-4 bg-terminal-error-red bg-opacity-20 border border-terminal-error-red border-opacity-30 rounded">
        <p class="text-terminal-white mb-3">
          <strong>⚠️ Project Status:</strong> This repository has been deprecated as of December 31, 2020 
          and exists as a placeholder only.
        </p>
        
        <p class="text-terminal-gray text-sm mb-3">
          All Carnivore code released prior to this date pertaining specifically to CarnivoreLE 
          or any other part of the larger project will continue to be licensed under GPLv3.
        </p>
        
        <p class="text-terminal-error-red text-sm font-bold">
          No new changes or pull requests will be accepted.
        </p>
      </div>
      
      <div class="mt-4 text-terminal-yellow">
        <p><strong>Repository:</strong> <a href="https://github.com/Positronikal/CarnivoreLE" class="project-link">github.com/Positronikal/CarnivoreLE</a></p>
      </div>
    </div>
  `;
}

function generateDaVinciOutput() {
  return `
    <div class="cyber-card">
      <h2 class="text-terminal-yellow text-xl mb-4">DaVinci MCP Professional</h2>
      
      <div class="mb-4">
        <span class="project-status status-active">Active Development</span>
        <span class="license-badge ml-2">GPLv3</span>
      </div>
      
      <p class="text-terminal-white mb-4">
        Enterprise-grade Model Context Protocol (MCP) server that exposes the full functionality 
        of DaVinci Resolve and DaVinci Resolve Studio through version 20 to AI clients.
      </p>
      
      <div class="forensics-log">
        <h3 class="text-terminal-forensics-blue font-bold mb-2">Technical Details:</h3>
        <ul class="list-disc list-inside space-y-1 text-terminal-gray">
          <li>Compatible with Claude for Windows MCP client</li>
          <li>Compatible with Cursor MCP clients</li>
          <li>Supports DaVinci Resolve through version 20</li>
          <li>Enterprise-grade automation capabilities</li>
          <li>Full video editing workflow automation</li>
        </ul>
      </div>
      
      <div class="mt-4">
        <h3 class="text-terminal-matrix-green font-bold mb-2">Key Features:</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <span class="text-terminal-cyan">• Project automation</span>
          <span class="text-terminal-cyan">• Timeline management</span>
          <span class="text-terminal-cyan">• Color grading control</span>
          <span class="text-terminal-cyan">• Export automation</span>
          <span class="text-terminal-cyan">• Media management</span>
          <span class="text-terminal-cyan">• Effects control</span>
        </div>
      </div>
      
      <div class="mt-4 text-terminal-yellow">
        <p><strong>Repository:</strong> <a href="https://github.com/Positronikal/davinci-mcp-professional" class="project-link">github.com/Positronikal/davinci-mcp-professional</a></p>
      </div>
    </div>
  `;
}

function generateDoxygenOutput() {
  return `
    <div class="cyber-card">
      <h2 class="text-terminal-yellow text-xl mb-4">Doxygen MCP Server</h2>
      
      <div class="mb-4">
        <span class="project-status status-active">Active Development</span>
        <span class="license-badge ml-2">GPLv3</span>
      </div>
      
      <p class="text-terminal-white mb-4">
        Model Context Protocol (MCP) server that exposes the full functionality of Doxygen 
        to Claude for Windows MCP client, enabling automated documentation generation from 
        source code comments.
      </p>
      
      <div class="forensics-log">
        <h3 class="text-terminal-forensics-blue font-bold mb-2">Technical Details:</h3>
        <ul class="list-disc list-inside space-y-1 text-terminal-gray">
          <li>Automated source code documentation</li>
          <li>Parses classes, functions, and variables</li>
          <li>Multiple output formats: HTML, PDF, LaTeX</li>
          <li>Integration with Claude for Windows</li>
          <li>Streamlined documentation workflows</li>
        </ul>
      </div>
      
      <div class="mt-4">
        <h3 class="text-terminal-matrix-green font-bold mb-2">Output Formats:</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <span class="text-terminal-cyan">• HTML documentation</span>
          <span class="text-terminal-cyan">• PDF generation</span>
          <span class="text-terminal-cyan">• LaTeX output</span>
          <span class="text-terminal-cyan">• XML documentation</span>
          <span class="text-terminal-cyan">• RTF format</span>
          <span class="text-terminal-cyan">• Man pages</span>
        </div>
      </div>
      
      <div class="mt-4 text-terminal-yellow">
        <p><strong>Repository:</strong> <a href="https://github.com/Positronikal/doxygen-mcp" class="project-link">github.com/Positronikal/doxygen-mcp</a></p>
      </div>
    </div>
  `;
}

function generateMacPortsOutput() {
  return `
    <div class="cyber-card">
      <h2 class="text-terminal-yellow text-xl mb-4">macportsAssistant Project</h2>
      
      <div class="mb-4">
        <span class="project-status status-maintenance">Maintenance Mode</span>
        <span class="license-badge ml-2">GPL-3.0</span>
      </div>
      
      <p class="text-terminal-white mb-4">
        macOS version-agnostic MacPorts installation and maintenance automation. 
        Formerly known as "montereyMacports" (now deprecated).
      </p>
      
      <div class="forensics-log">
        <h3 class="text-terminal-forensics-blue font-bold mb-2">Project Evolution:</h3>
        <p class="text-terminal-gray text-sm mb-3">
          This project was formerly known as "montereyMacports". That project has been deprecated 
          due to being specific to macOS Monterey. macportsAssistant is macOS version agnostic and 
          should work for earlier versions of macOS to some extent and will be easier to maintain 
          support for new versions as they are released.
        </p>
        <p class="text-terminal-warning-amber text-sm mb-3">
          <strong>Testing Note:</strong> Has only been tested on macOS Ventura. 
          Bear this in mind regarding testing on any previous macOS version.
        </p>
      </div>
      
      <div class="mt-4">
        <h3 class="text-terminal-matrix-green font-bold mb-2">Features:</h3>
        <ul class="list-disc list-inside space-y-1 text-terminal-gray text-sm">
          <li>Automates MacPorts installation or upgrade if an earlier version exists</li>
          <li>Creates ~/bin/MacPorts directory for working files</li>
          <li>Installs macports_updater.sh utility in ~/bin for automated updates</li>
          <li>Automatically adds ~/bin to PATH environment variable</li>
          <li>All utilities must be run as root</li>
        </ul>
      </div>
      
      <div class="mt-4 p-3 bg-terminal-warning-amber bg-opacity-20 border border-terminal-warning-amber border-opacity-30 rounded">
        <p class="text-terminal-warning-amber text-sm">
          <strong>Improvement Opportunities:</strong> Contributors/testers may find areas for improvement, 
          including combining install/upgrade utilities into a single runtime-detection script.
        </p>
      </div>
      
      <div class="mt-4 text-terminal-yellow">
        <p><strong>Repository:</strong> <a href="https://github.com/Positronikal/macportsAssistant" class="project-link">github.com/Positronikal/macportsAssistant</a></p>
      </div>
    </div>
  `;
}

function generateGPGOutput() {
  return `
    <div class="cyber-card">
      <h2 class="text-terminal-yellow text-xl mb-4">GPG Security Requirements</h2>
      
      <div class="mb-4 p-4 bg-terminal-forensics-blue bg-opacity-20 border border-terminal-forensics-blue border-opacity-30 rounded">
        <p class="text-terminal-white mb-3">
          <strong>🔒 Mandatory Requirement:</strong> All commits in pull requests must be GPG signed.
        </p>
      </div>
      
      <div class="forensics-log">
        <h3 class="text-terminal-forensics-blue font-bold mb-2">Setup Instructions:</h3>
        <ul class="list-disc list-inside space-y-2 text-terminal-gray text-sm">
          <li>
            See GitHub's guidance regarding 
            <a href="https://help.github.com/articles/signing-commits-with-gpg" 
               class="text-terminal-cyan hover:text-terminal-white transition-colors duration-200"
               target="_blank" rel="noopener noreferrer">
              signing commits with GPG
            </a>
          </li>
          <li>
            Use of a keyserver is highly recommended, as is having your public key signed by others who can vouch for you
          </li>
          <li>
            Instructions on key signing are available 
            <a href="https://www.gnupg.org/gph/en/manual/x457.html" 
               class="text-terminal-cyan hover:text-terminal-white transition-colors duration-200"
               target="_blank" rel="noopener noreferrer">
              here
            </a>
          </li>
        </ul>
      </div>
      
      <div class="mt-4 p-3 bg-terminal-matrix-green bg-opacity-20 border border-terminal-matrix-green border-opacity-30 rounded">
        <h4 class="text-terminal-matrix-green font-bold mb-2">Hoyt Harness Public Key:</h4>
        <p class="text-terminal-white text-sm mb-2">
          My public key (Hoyt Harness) can be retrieved from MIT's keyserver:
        </p>
        <a href="https://pgp.mit.edu/" 
           class="inline-flex items-center text-terminal-yellow hover:text-terminal-white font-bold transition-colors duration-200"
           target="_blank" rel="noopener noreferrer">
          <span class="mr-2">🔑</span>
          MIT PGP Keyserver
        </a>
      </div>
    </div>
  `;
}

function generateDCOOutput() {
  return `
    <div class="cyber-card">
      <h2 class="text-terminal-yellow text-xl mb-4">Developer Certificate of Origin (DCO)</h2>
      
      <div class="mb-4 p-4 bg-terminal-forensics-blue bg-opacity-20 border border-terminal-forensics-blue border-opacity-30 rounded">
        <p class="text-terminal-white mb-3">
          <strong>📜 Mandatory Requirement:</strong> All contributors must have a signed Developer 
          Certificate of Origin (DCO) on file with Positronikal before any code is accepted or reviewed.
        </p>
      </div>
      
      <div class="forensics-log">
        <h3 class="text-terminal-forensics-blue font-bold mb-2">Additional DCO Requirements:</h3>
        <p class="text-terminal-gray text-sm mb-3">
          If your contributed code was:
        </p>
        <ul class="list-disc list-inside space-y-1 text-terminal-gray text-sm ml-4">
          <li>Written as a result of your job</li>
          <li>You coded a significant portion during work hours</li>
          <li>Any other circumstances exist that might give rise to your employer exercising a right to ownership at any time in the future</li>
        </ul>
        <p class="text-terminal-warning-amber text-sm mt-3">
          <strong>Then:</strong> A DCO must also be on file for your employer and signed by a competent 
          authority within the organization (not yourself).
        </p>
      </div>
      
      <div class="mt-4 p-3 bg-terminal-matrix-green bg-opacity-20 border border-terminal-matrix-green border-opacity-30 rounded">
        <div class="flex flex-col space-y-3">
          <div>
            <a href="/Posi_DCO.txt" 
               class="inline-flex items-center text-terminal-yellow hover:text-terminal-white font-bold transition-colors duration-200"
               target="_blank"
               rel="noopener noreferrer">
              <span class="mr-2">📄</span>
              Download DCO Template
            </a>
            <div class="text-terminal-gray text-xs mt-1">
              (Fill out and include with your first contribution)
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateSecurityOutput() {
  return `
    <div class="cyber-card">
      <h2 class="text-terminal-yellow text-xl mb-4">Security Policies</h2>
      
      <div class="mb-4 p-4 bg-terminal-forensics-blue bg-opacity-20 border border-terminal-forensics-blue border-opacity-30 rounded">
        <p class="text-terminal-white mb-3">
          <strong>🔒 Security & Vulnerability Reporting:</strong> For all security issues, 
          vulnerability reporting, and related policies, please refer to the BUGS file 
          in the repository root.
        </p>
      </div>
      
      <div class="forensics-log">
        <h3 class="text-terminal-forensics-blue font-bold mb-2">Quick Reference:</h3>
        <ul class="list-disc list-inside space-y-1 text-terminal-gray text-sm">
          <li>All security issues should be reported through proper channels</li>
          <li>See BUGS file for detailed reporting procedures</li>
          <li>GPG encryption recommended for sensitive reports</li>
          <li>DCO and GPG signing required for all contributions</li>
        </ul>
      </div>
      
      <div class="mt-4 p-3 bg-terminal-matrix-green bg-opacity-20 border border-terminal-matrix-green border-opacity-30 rounded">
        <p class="text-terminal-matrix-green text-sm">
          📄 <strong>Documentation:</strong> Detailed security policies and procedures 
          are maintained in the BUGS file to ensure they remain current and accessible.
        </p>
      </div>
    </div>
  `;
}

function generateCreditsOutput() {
  return `
    <div class="space-y-4">
      <h2 class="text-terminal-yellow text-2xl mb-4 flex items-center">
        <span class="mr-2">🙏</span>
        Credits & Acknowledgments
      </h2>
      
      <div class="cyber-card">
        <h3 class="text-terminal-matrix-green font-bold mb-3 flex items-center">
          <span class="mr-2">💡</span>
          Original Inspiration
        </h3>
        <p class="text-terminal-white mb-3">
          The terminal interface concept and initial design inspiration for this cybersecurity 
          platform came from the excellent portfolio work of 
          <a href="https://github.com/m-mdy-m" class="text-terminal-cyan hover:text-terminal-white font-bold transition-colors duration-200">0x (m-mdy-m)</a>.
        </p>
        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <a href="https://github.com/m-mdy-m/m-mdy-m.github.io" 
             class="inline-flex items-center text-terminal-yellow hover:text-terminal-white transition-colors duration-200"
             target="_blank" rel="noopener noreferrer">
            <span class="mr-2">🔗</span>
            Original Repository
          </a>
          <a href="https://m-mdy-m.github.io/" 
             class="inline-flex items-center text-terminal-cyan hover:text-terminal-white transition-colors duration-200"
             target="_blank" rel="noopener noreferrer">
            <span class="mr-2">🌐</span>
            Live Portfolio
          </a>
        </div>
      </div>
      
      <div class="cyber-card">
        <h3 class="text-terminal-matrix-green font-bold mb-3 flex items-center">
          <span class="mr-2">🛠️</span>
          Technology Stack
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="text-terminal-warning-amber font-bold mb-2">Frontend:</h4>
            <ul class="list-disc list-inside space-y-1 text-terminal-gray text-sm">
              <li>Astro 5 - Static site generation</li>
              <li>TypeScript 5 - Type safety</li>
              <li>Tailwind CSS 4 - Utility-first styling</li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-terminal-warning-amber font-bold mb-2">Development:</h4>
            <ul class="list-disc list-inside space-y-1 text-terminal-gray text-sm">
              <li>pnpm - Package management</li>
              <li>GitHub Pages - Hosting</li>
              <li>Git - Version control</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="cyber-card">
        <h3 class="text-terminal-matrix-green font-bold mb-3 flex items-center">
          <span class="mr-2">🏆</span>
          Special Thanks
        </h3>
        <p class="text-terminal-white text-sm">
          To the open source community, cybersecurity researchers, and digital forensics 
          professionals who contribute to tools and knowledge that make our work possible.
        </p>
        <div class="mt-3 text-terminal-cyan text-xs">
          <p>This platform was adapted and enhanced for digital forensics and cybersecurity research.</p>
        </div>
      </div>
      
      <div class="mt-4 p-3 bg-terminal-forensics-blue bg-opacity-20 border border-terminal-forensics-blue border-opacity-30 rounded">
        <p class="text-terminal-info-cyan text-sm">
          📜 Want to contribute? Check out our 
          <span class="text-terminal-yellow font-bold">DCO requirements</span> and 
          <span class="text-terminal-yellow font-bold">GPG signing policies</span> 
          by running 'dco' and 'security' commands.
        </p>
      </div>
    </div>
  `;
}

function generateContactOutput() {
  return `
    <div class="cyber-card">
      <h2 class="text-terminal-yellow text-xl mb-4">Contact Information</h2>
      
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <span class="text-terminal-matrix-green text-2xl">📬</span>
          <div>
            <p class="text-terminal-white font-bold">Hoyt Harness</p>
            <a href="mailto:hoyt.harness@gmail.com" 
               class="text-terminal-cyan hover:text-terminal-white transition-colors duration-200">
              hoyt.harness@gmail.com
            </a>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-terminal-forensics-blue bg-opacity-20 border border-terminal-forensics-blue border-opacity-30 rounded">
          <p class="text-terminal-info-cyan text-sm">
            🔒 For security-related communications, please use GPG encryption. 
            Public key available on MIT keyserver (use 'gpg' command for details).
          </p>
        </div>
        
        <div class="mt-4">
          <h3 class="text-terminal-matrix-green font-bold mb-2">Other Platforms:</h3>
          <div class="space-y-2">
            <a href="https://github.com/Positronikal" 
               class="inline-flex items-center text-terminal-yellow hover:text-terminal-white transition-colors duration-200"
               target="_blank" rel="noopener noreferrer">
              <span class="mr-2">🐈</span>
              GitHub: @Positronikal
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

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
