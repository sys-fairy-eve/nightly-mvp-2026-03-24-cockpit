export interface SystemInfo {
  hostname: string;
  os: string;
  kernel: string;
  uptime: string;
  cpu: number;
  ram: { used: number; total: number };
  disk: { used: number; total: number };
  networkIn: number;
  networkOut: number;
  loadAvg: [number, number, number];
}

export interface Service {
  name: string;
  description: string;
  status: 'running' | 'stopped' | 'failed';
  pid: number | null;
  memory: string;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  severity: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
}

export const systemInfo: SystemInfo = {
  hostname: 'srv-prod-01',
  os: 'Ubuntu 24.04.2 LTS',
  kernel: 'Linux 6.8.0-45-generic',
  uptime: '42 days, 7:23:15',
  cpu: 34,
  ram: { used: 6.2, total: 15.6 },
  disk: { used: 112, total: 256 },
  networkIn: 1247832,
  networkOut: 893241,
  loadAvg: [1.23, 0.98, 0.87],
};

export const services: Service[] = [
  { name: 'nginx', description: 'High performance HTTP server and reverse proxy', status: 'running', pid: 1234, memory: '24.3 MB' },
  { name: 'sshd', description: 'OpenSSH server daemon', status: 'running', pid: 892, memory: '4.1 MB' },
  { name: 'postgresql', description: 'PostgreSQL RDBMS', status: 'running', pid: 2341, memory: '187.2 MB' },
  { name: 'redis-server', description: 'Redis in-memory data store', status: 'running', pid: 3456, memory: '42.8 MB' },
  { name: 'docker', description: 'Docker container runtime', status: 'running', pid: 1567, memory: '98.4 MB' },
  { name: 'cron', description: 'Regular background program processing daemon', status: 'running', pid: 678, memory: '2.1 MB' },
  { name: 'systemd-resolved', description: 'Network Name Resolution', status: 'running', pid: 445, memory: '12.7 MB' },
  { name: 'fail2ban', description: 'Ban hosts that cause multiple authentication errors', status: 'running', pid: 1890, memory: '18.3 MB' },
  { name: 'ufw', description: 'Uncomplicated Firewall', status: 'running', pid: 334, memory: '3.2 MB' },
  { name: 'node_exporter', description: 'Prometheus exporter for hardware and OS metrics', status: 'running', pid: 4521, memory: '15.6 MB' },
  { name: 'mysql', description: 'MySQL Community Server', status: 'stopped', pid: null, memory: '0 MB' },
  { name: 'mongod', description: 'MongoDB Database Server', status: 'stopped', pid: null, memory: '0 MB' },
  { name: 'elasticsearch', description: 'Elasticsearch distributed search engine', status: 'failed', pid: null, memory: '0 MB' },
  { name: 'postfix', description: 'Postfix Mail Transport Agent', status: 'running', pid: 5678, memory: '8.9 MB' },
  { name: 'unattended-upgrades', description: 'Automatic installation of security upgrades', status: 'running', pid: 789, memory: '5.4 MB' },
];

const logMessages: Record<string, { severity: LogEntry['severity']; messages: string[] }[]> = {
  System: [
    { severity: 'INFO', messages: ['systemd[1]: Started Session 4523 of User eve.', 'systemd[1]: Reached target Multi-User System.', 'kernel: [UFW BLOCK] IN=eth0 OUT= MAC=00:16:3e:5e:6c:00 SRC=185.220.101.34', 'systemd[1]: Starting Daily apt download activities...', 'snapd[892]: autorefresh.go:540: auto-refresh: all snaps are up-to-date'] },
    { severity: 'WARN', messages: ['systemd[1]: /etc/systemd/system/docker.service.d/override.conf:2: Unknown key name \'LimitNPROC\' in section \'Service\'', 'kernel: [UFW AUDIT] IN=eth0 OUT= PROTO=TCP SPT=443', 'systemd-resolved[445]: Grace period over, resuming full feature set'] },
    { severity: 'ERROR', messages: ['elasticsearch[3201]: java.lang.OutOfMemoryError: Java heap space', 'systemd[1]: elasticsearch.service: Main process exited, code=exited, status=1/FAILURE'] },
    { severity: 'DEBUG', messages: ['kernel: audit: type=1400 audit(1711234567.890:1234): apparmor="ALLOWED"', 'systemd[1]: Condition check resulted in Journal Catalog Update being skipped.'] },
  ],
  Auth: [
    { severity: 'INFO', messages: ['sshd[12345]: Accepted publickey for eve from 10.0.0.5 port 54321 ssh2', 'sshd[12346]: pam_unix(sshd:session): session opened for user eve(uid=1000)', 'sudo: eve : TTY=pts/0 ; PWD=/home/eve ; USER=root ; COMMAND=/usr/bin/systemctl restart nginx'] },
    { severity: 'WARN', messages: ['sshd[99887]: Connection closed by authenticating user root 185.220.101.34 port 44556 [preauth]', 'sudo: pam_unix(sudo:auth): authentication failure; logname=eve uid=1000'] },
    { severity: 'ERROR', messages: ['sshd[55443]: Failed password for invalid user admin from 203.0.113.50 port 33221 ssh2', 'fail2ban.actions[1890]: NOTICE [sshd] Ban 203.0.113.50'] },
    { severity: 'DEBUG', messages: ['sshd[12345]: debug1: userauth-request for user eve service ssh-connection method publickey'] },
  ],
  Nginx: [
    { severity: 'INFO', messages: ['10.0.0.5 - - "GET /api/v1/health HTTP/1.1" 200 15 "-" "curl/8.5.0"', '10.0.0.8 - - "GET /dashboard HTTP/1.1" 200 4523 "-" "Mozilla/5.0"', '10.0.0.3 - - "POST /api/v1/auth/login HTTP/1.1" 200 342 "-" "Mozilla/5.0"'] },
    { severity: 'WARN', messages: ['*1234 upstream timed out (110: Connection timed out) while reading response header from upstream', '*5678 client intended to send too large body: 15728640 bytes'] },
    { severity: 'ERROR', messages: ['*9012 connect() failed (111: Connection refused) while connecting to upstream, client: 10.0.0.5', '*3456 open() "/usr/share/nginx/html/favicon.ico" failed (2: No such file or directory)'] },
    { severity: 'DEBUG', messages: ['*1234 http process request header line', '*5678 http finalize request: "/api/v1/data?" a:1, c:2'] },
  ],
  Syslog: [
    { severity: 'INFO', messages: ['CRON[7890]: (root) CMD (/usr/lib/apt/apt.systemd.daily)', 'dhclient[456]: DHCPACK of 10.0.0.2 from 10.0.0.1', 'ntpd[789]: adjusting system clock by 0.003421s'] },
    { severity: 'WARN', messages: ['rsyslogd: action \'action-3-builtin:omfile\' suspended, next retry is', 'ntpd[789]: kernel reports TIME_ERROR: 0x41: Clock Unsynchronized'] },
    { severity: 'ERROR', messages: ['rsyslogd: error during parsing file /var/log/custom.log', 'disk-health-nurse[2345]: sda: SMART error detected'] },
    { severity: 'DEBUG', messages: ['rsyslogd: [origin software="rsyslogd" swVersion="8.2312.0" x-pid="901"]'] },
  ],
};

let logIdCounter = 0;

export function generateLogEntry(tab: string): LogEntry {
  const tabData = logMessages[tab] || logMessages['System'];
  const group = tabData[Math.floor(Math.random() * tabData.length)];
  const message = group.messages[Math.floor(Math.random() * group.messages.length)];
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
  return {
    id: logIdCounter++,
    timestamp,
    severity: group.severity,
    message,
  };
}

export function generateInitialLogs(tab: string, count: number = 30): LogEntry[] {
  const logs: LogEntry[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const entry = generateLogEntry(tab);
    const past = new Date(now - (count - i) * 3000);
    entry.timestamp = past.toISOString().replace('T', ' ').substring(0, 19);
    logs.push(entry);
  }
  return logs;
}

// Terminal command responses
export const terminalCommands: Record<string, string> = {
  'ls': 'bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var',
  'pwd': '/root',
  'whoami': 'root',
  'uname -a': 'Linux srv-prod-01 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
  'uptime': ' 23:06:42 up 42 days,  7:23,  2 users,  load average: 1.23, 0.98, 0.87',
  'df -h': `Filesystem      Size  Used Avail Use% Mounted on
tmpfs           1.6G  2.1M  1.6G   1% /run
/dev/sda2       256G  112G  131G  47% /
tmpfs           7.8G     0  7.8G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
/dev/sda1       512M  6.1M  506M   2% /boot/efi
tmpfs           1.6G  4.0K  1.6G   1% /run/user/1000`,
  'free -m': `               total        used        free      shared  buff/cache   available
Mem:           15974        6349        2841         234        6783        9086
Swap:           4096         312        3784`,
  'ps aux': `USER         PID %CPU %MEM    VSS   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.0 168256 13312 ?        Ss   Feb10   2:34 /sbin/init
root         445  0.0  0.0  25600  8192 ?        Ss   Feb10   0:12 /lib/systemd/systemd-resolved
root         678  0.0  0.0   8536  3072 ?        Ss   Feb10   0:45 /usr/sbin/cron -f
root         892  0.0  0.0  15420  6784 ?        Ss   Feb10   0:03 sshd: /usr/sbin/sshd -D
root        1234  0.1  0.2  47824 24832 ?        S    Feb10  12:34 nginx: master process
www-data    1235  0.3  0.1  48896 19456 ?        S    Feb10  34:56 nginx: worker process
postgres    2341  0.5  1.2 312456 191692 ?       Ss   Feb10  45:23 /usr/lib/postgresql/16/bin/postgres
redis       3456  0.2  0.3  68432 43828 ?        Ssl  Feb10   8:12 /usr/bin/redis-server *:6379
root        1567  0.3  0.6 1289456 100762 ?      Ssl  Feb10  23:45 /usr/bin/dockerd -H fd://
eve         5678  0.0  0.0  47824  8960 ?        Ss   Feb10   0:56 /usr/lib/postfix/sbin/master -w`,
  'date': new Date().toString(),
  'cat /etc/hostname': 'srv-prod-01',
  'id': 'uid=0(root) gid=0(root) groups=0(root)',
  'hostname': 'srv-prod-01',
  'clear': '__CLEAR__',
  'help': `Available commands: ls, pwd, whoami, uname -a, uptime, df -h, free -m,
ps aux, echo, date, cat /etc/hostname, id, hostname, clear, help`,
};
