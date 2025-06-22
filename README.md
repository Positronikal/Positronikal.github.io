# Positronikal Astro Project

## Project Overview

This is the new Astro 5-based website for Positronikal, featuring a cybersecurity-themed terminal interface that showcases digital forensics projects and research.

## Technology Stack

- **Framework**: Astro 5
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Package Manager**: pnpm
- **Design**: Terminal/CLI aesthetic with cybersecurity themes

## Development

### Prerequisites

- Node.js 18+ 
- pnpm 9+

### Installation

```bash
pnpm install
```

### Development Server

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

## Features

### Interactive Terminal
- Fully functional command-line interface
- Command history and tab completion
- Custom commands for project information
- Real-time system information

### Security Focus
- GPG signature requirements
- Developer Certificate of Origin (DCO) compliance
- Security-first development practices
- Professional forensics standards

### Cybersecurity Aesthetic
- Matrix-style animations
- Terminal green color scheme
- CRT overlay effects
- ASCII art and retro styling

## Project Structure

```
src/
├── components/          # Reusable Astro components
├── layouts/            # Page layouts
├── pages/              # Route pages
├── content/            # Markdown content
├── styles/             # Global CSS and Tailwind
├── commands.js         # Terminal command system
└── tree.js            # Virtual filesystem utilities
```

## Commands

The site features an interactive terminal with various commands:

### Information
- `help` - Show all available commands
- `about` - About Positronikal
- `whoami` - User information
- `neofetch` - System information display

### Projects
- `projects` - List all projects
- `ewftools` - EWF tools information
- `carnivore` - CarnivoreLE details
- `backup` - simpleBackup information
- `macports` - macportsAssistant details

### Security
- `gpg` - GPG key information
- `dco` - DCO requirements
- `security` - Security policies
- `contact` - Contact information

### System
- `ls` - List directory contents
- `cd` - Change directory
- `pwd` - Print working directory
- `cat` - Display file contents
- `clear` - Clear terminal
- `history` - Command history

## Contributing

### Requirements
- All commits must be GPG signed
- Developer Certificate of Origin (DCO) on file
- Follow GNU coding standards
- Adhere to UNIX philosophy

### Security
- GPG public key verification required
- Secure development practices
- Vulnerability disclosure via secure channels

## License

- **Content**: Creative Commons Attribution 4.0 International License
- **Code**: GPL-3.0 (for tools and utilities)
- **Individual Projects**: See respective project licenses

## Contact

- **Primary**: GitHub Issues and Discussions
- **GitHub Org**: [github.com/Positronikal](https://github.com/Positronikal)
- **Personal**: [github.com/hoyt-harness](https://github.com/hoyt-harness)
- **GPG**: Public key available on MIT keyserver

---

*Building the future of digital forensics, one terminal command at a time.*