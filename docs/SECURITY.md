# Security Guide

This document outlines security considerations, threat models, and best practices for Browser MCP Firefox.

## Table of Contents

- [Security Overview](#security-overview)
- [Threat Model](#threat-model)
- [Security Controls](#security-controls)
- [Best Practices](#best-practices)
- [Vulnerability Disclosure](#vulnerability-disclosure)
- [Security Checklist](#security-checklist)

## Security Overview

Browser MCP Firefox operates as a bridge between AI agents and browser automation, creating several security considerations:

- **Local WebSocket Server**: Exposes automation capabilities on localhost
- **Browser Extension**: Requires elevated permissions for DOM manipulation
- **Cross-Process Communication**: stdio (AI agents) and WebSocket (browser)
- **User Session Access**: Operates within user's logged-in browser context

## Threat Model

### Assets
- **User's Browser Session**: Cookies, authentication tokens, personal data
- **Local System Access**: File system access via WebSocket port
- **Browser Automation**: Ability to navigate, click, type, screenshot
- **Process Execution**: Ability to kill processes via `--force` flag

### Threat Actors
- **Malicious Local Processes**: Unauthorized access to WebSocket port
- **Compromised AI Agents**: Malicious commands via MCP protocol
- **Network Attackers**: Unauthorized WebSocket connections
- **Malicious Extensions**: Competing browser extensions

### Attack Vectors
- **WebSocket Hijacking**: Unauthorized connections to localhost port
- **Command Injection**: Malicious parameters in tool calls
- **Session Hijacking**: Abuse of browser session access
- **Process Manipulation**: Misuse of `--force` flag to kill system processes
- **Information Disclosure**: Screenshots and console logs containing sensitive data

## Security Controls

### Network Security

#### Local Binding Only
```typescript
// WebSocket server binds to localhost only
const wss = new WebSocketServer({ 
  host: '127.0.0.1',  // Localhost only
  port: wsPort 
});
```

**Protection Against**: External network access, remote attackers

#### No Authentication (By Design)
- **Rationale**: Relies on OS-level access control
- **Risk**: Any local process can connect
- **Mitigation**: Firewall rules, user awareness

### Input Validation

#### Zod Schema Validation
```typescript
// All tool parameters validated with Zod
const validatedParams = NavigateTool.shape.arguments.parse(params);
```

**Protection Against**: Command injection, malformed parameters

#### WebSocket Message Validation
```typescript
// Structured message format
interface Message {
  type: string;
  payload: Record<string, any>;
}
```

**Protection Against**: Malformed WebSocket messages

### Process Security

#### Safe Process Management
```typescript
// Requires explicit --force flag for process termination
if (!forceKill) {
  throw new Error(`Port ${port} is already in use. Use --force flag to kill existing process.`);
}
```

**Protection Against**: Accidental process termination

#### User-Level Privileges
- Server runs with user privileges only
- No privilege escalation capabilities
- Limited to user's accessible resources

### Browser Security

#### Extension Permissions
```json
{
  "permissions": [
    "activeTab",
    "storage"
  ],
  "host_permissions": [
    "http://*/*",
    "https://*/*"
  ]
}
```

**Required Permissions:**
- `activeTab`: Access current tab content
- `storage`: Save connection settings
- `host_permissions`: Automation on all sites

#### Content Script Isolation
- Extension uses content scripts for DOM access
- Isolated execution environment
- Subject to browser security model

## Best Practices

### Deployment Security

#### Network Isolation
```bash
# Bind to localhost only (default)
node dist/index.js --ws-port 9001

# Configure firewall to block external access
sudo ufw deny from any to any port 9001
sudo ufw allow from 127.0.0.1 to any port 9001
```

#### Port Management
```bash
# Use non-standard ports to avoid conflicts
node dist/index.js --ws-port 19001

# Check for port conflicts before starting
lsof -ti:19001 && echo "Port in use" || echo "Port available"
```

#### Process Monitoring
```bash
# Monitor WebSocket connections
netstat -an | grep 9001

# Monitor server process
ps aux | grep "node.*index.js"
```

### Development Security

#### Secure Coding Practices
```typescript
// Always validate inputs
handle: async (context, params) => {
  const validated = ToolSchema.shape.arguments.parse(params);
  // Use validated parameters only
}

// Handle errors securely
catch (error) {
  // Don't expose internal details
  return { content: [{ type: "text", text: "Operation failed" }], isError: true };
}
```

#### Sensitive Data Handling
```typescript
// Avoid logging sensitive data
console.log(`Navigation to: ${url}`);  // OK
console.log(`Form data: ${formData}`);  // Potentially dangerous

// Sanitize console logs before returning
const sanitizedLogs = logs.map(log => ({
  ...log,
  message: sanitizeMessage(log.message)
}));
```

### Operational Security

#### Access Control
- Run server as dedicated user account
- Limit file system permissions
- Use process isolation (containers, VMs)

#### Monitoring and Logging
```typescript
// Log security-relevant events
console.log(`WebSocket connection from: ${clientIP}`);
console.log(`Tool execution: ${toolName} by ${userAgent}`);
console.log(`Failed authentication attempt from: ${clientIP}`);
```

#### Session Management
```bash
# Set connection timeouts
export MCP_CONNECTION_TIMEOUT=30000

# Implement session limits
export MCP_MAX_SESSIONS=1
```

### Browser Security

#### Extension Verification
- Only install from official sources
- Verify extension signatures
- Monitor extension permissions

#### Session Isolation
- Use dedicated browser profiles for automation
- Clear sessions after automation tasks
- Monitor for unauthorized browser activity

## Vulnerability Disclosure

### Reporting Security Issues
**Contact**: security@browsermcp.io

**Please Include:**
- Detailed description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Suggested fixes (if any)

### Response Timeline
- **Initial Response**: Within 48 hours
- **Vulnerability Assessment**: Within 1 week
- **Fix Development**: Within 2-4 weeks (depending on severity)
- **Public Disclosure**: After fix is available

### Security Updates
- Critical vulnerabilities: Immediate patches
- High severity: Patches within 1 week
- Medium/Low severity: Regular release cycle

## Security Checklist

### Pre-Deployment
- [ ] Server configured to bind localhost only
- [ ] Firewall rules configured to block external access
- [ ] Non-default port selected and documented
- [ ] Process monitoring configured
- [ ] Log aggregation configured

### Runtime Security
- [ ] Regular security updates applied
- [ ] WebSocket connections monitored
- [ ] Unusual process activity monitored
- [ ] Extension permissions audited
- [ ] Browser session isolation configured

### Development Security
- [ ] All inputs validated with Zod schemas
- [ ] Error messages don't expose internal details
- [ ] Sensitive data sanitized in logs
- [ ] Security code review completed
- [ ] Penetration testing performed

### Incident Response
- [ ] Security incident response plan documented
- [ ] Emergency contact list maintained
- [ ] Log retention policy defined
- [ ] Backup and recovery procedures tested

## Known Security Limitations

### By Design Limitations
1. **No Authentication**: Relies on OS-level access control
2. **Local Network Only**: Cannot secure against local attackers
3. **Browser Session Access**: Full access to user's logged-in sessions
4. **Process Termination**: `--force` can kill arbitrary processes

### Planned Security Enhancements
1. **Token-Based Authentication**: Random tokens for connection auth
2. **TLS Support**: Optional HTTPS/WSS for sensitive environments  
3. **Rate Limiting**: Prevent automation abuse
4. **Audit Logging**: Comprehensive security event logging
5. **Permission System**: Granular tool access controls

### Risk Acceptance
Some risks are accepted by design for usability:
- Local network exposure (mitigated by localhost binding)
- No authentication (mitigated by OS access control)
- Browser session access (required for automation functionality)

## Security Resources

### External Security Tools
```bash
# Network security scanning
nmap localhost -p 9001

# Process monitoring
htop  # Linux/macOS
Get-Process | Where-Object {$_.ProcessName -eq "node"}  # PowerShell
```

### Security Hardening Guides
- [OWASP WebSocket Security](https://owasp.org/www-community/attacks/WebSocket_security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Browser Extension Security](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Security_best_practices)

---

For general security questions, see the main [README.md](./README.md) troubleshooting section.
For development security practices, see [DEVELOPMENT.md](./DEVELOPMENT.md).