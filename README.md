# Cockpit Server Dashboard

A browser-based server administration dashboard inspired by [cockpit-project/cockpit](https://github.com/cockpit-project/cockpit). All data is simulated — no real system calls.

## Features

### 📊 System Overview
- Hostname, OS, kernel, uptime display
- Animated CPU/RAM/Disk gauge rings (update every 2s)
- Network I/O counters
- Load average (1m, 5m, 15m)

### ⚙️ Services Panel
- 15 common Linux services with status indicators
- Color-coded: green (running), red (stopped/failed)
- Expandable rows with service descriptions
- Start/Stop/Restart buttons (demo toast)

### 📋 Log Viewer
- 4 tabs: System, Auth, Nginx, Syslog
- Realistic auto-generated log entries streaming every 1.5s
- Color-coded severity: INFO, WARN, ERROR, DEBUG
- Search/filter box
- Pause/resume streaming

### 💻 Terminal Emulator
- Styled terminal with colored bash prompt
- Supports: `ls`, `pwd`, `whoami`, `uname -a`, `uptime`, `df -h`, `free -m`, `ps aux`, `echo`, `date`, `cat /etc/hostname`, `id`, `hostname`, `clear`, `help`
- Command history (arrow keys)
- Ctrl+L to clear

## Tech Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** v4
- No backend — pure frontend with simulated data

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Live Demo

https://mvp.trollefsen.com/2026-03-24-cockpit/

---

*Built as a nightly MVP — AI-generated in ~20 minutes.*
