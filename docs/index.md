# Browser MCP Firefox Documentation

Welcome to the comprehensive documentation for Browser MCP Firefox. This documentation covers everything from installation to advanced development and security considerations.

## 📚 Documentation Overview

### Getting Started
- **[📋 Installation Guide](./INSTALLATION.md)** - Complete installation instructions for all platforms
- **[📖 Main README](../README.md)** - Project overview and quick start guide

### Using Browser MCP Firefox  
- **[🔧 API Documentation](./API.md)** - Complete reference for all browser automation tools
- **[⚡ CLI Usage](../README.md#-cli-usage)** - Command line options and examples

### Understanding the System
- **[🏗️ Architecture Guide](./ARCHITECTURE.md)** - System design, components, and data flow
- **[🛡️ Security Guide](./SECURITY.md)** - Security model, threat analysis, and best practices

### Development and Contributing
- **[👨‍💻 Development Guide](./DEVELOPMENT.md)** - Contributing, extending, and customizing

## 🚀 Quick Navigation

### For End Users
1. Start with the [Installation Guide](./INSTALLATION.md) to set up the system
2. Review the [API Documentation](./API.md) to understand available tools
3. Check the [Security Guide](./SECURITY.md) for deployment considerations

### For Developers
1. Follow the [Development Guide](./DEVELOPMENT.md) for setup and workflow
2. Study the [Architecture Guide](./ARCHITECTURE.md) to understand the system design
3. Reference the [API Documentation](./API.md) when adding new tools

### For System Administrators
1. Review the [Security Guide](./SECURITY.md) for threat model and controls
2. Check the [Installation Guide](./INSTALLATION.md) for production deployment
3. Monitor the system using guidance from [Architecture Guide](./ARCHITECTURE.md)

## 📖 Documentation Structure

### By Topic

**Installation & Setup**
- Platform-specific installation instructions
- Browser extension setup
- Configuration options
- Firewall and network setup
- Troubleshooting installation issues

**API Reference**
- Complete tool catalog with parameters
- Request/response formats  
- Usage examples and workflows
- Error handling patterns
- WebSocket protocol details

**Architecture & Design**
- System overview and components
- Communication protocols
- Data flow and message routing
- Extension points and customization
- Performance characteristics

**Development**
- Development environment setup
- Code organization and standards
- Adding new browser automation tools
- Testing and debugging techniques
- Contributing guidelines

**Security**
- Threat model and risk assessment
- Security controls and mitigations
- Deployment best practices
- Vulnerability disclosure process
- Security checklist

### By User Role

**🧑‍💻 End Users (AI Agent Integration)**
- [Installation Guide](./INSTALLATION.md) - Setup and configuration
- [API Documentation](./API.md) - Available tools and usage
- [Main README](../README.md) - Quick start and troubleshooting

**👩‍💼 System Administrators**
- [Security Guide](./SECURITY.md) - Security considerations
- [Installation Guide](./INSTALLATION.md) - Production deployment
- [Architecture Guide](./ARCHITECTURE.md) - System monitoring

**👨‍🔬 Developers**
- [Development Guide](./DEVELOPMENT.md) - Contributing and extending
- [Architecture Guide](./ARCHITECTURE.md) - System design
- [API Documentation](./API.md) - Tool development reference

## 🔍 Finding Information

### Quick Reference Cards

**Common CLI Commands**
```bash
# Start server (default port 9001)
node dist/index.js

# Use custom port
node dist/index.js --ws-port 9002

# Force kill process on port
node dist/index.js --force

# Get help
node dist/index.js --help
```

**Available Tools Summary**
- Navigation: `navigate`, `go_back`, `go_forward`
- Interaction: `click`, `hover`, `type`, `drag`, `select_option`
- Information: `screenshot`, `get_console_logs`, `snapshot`
- Utilities: `wait`, `press_key`

**Key Configuration Files**
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts
- `lib/config/mcp.config.js` - MCP server configuration
- `src/index.ts` - CLI entry point

### Troubleshooting Quick Links

**Installation Issues**
- [Node.js Version Errors](./INSTALLATION.md#nodejs-version-error)
- [npm Install Failures](./INSTALLATION.md#npm-install-failures) 
- [Build Errors](./INSTALLATION.md#build-errors)

**Runtime Issues**
- [Port Already in Use](./INSTALLATION.md#port-already-in-use)
- [Extension Connection Failed](./INSTALLATION.md#extension-connection-failed)
- [Firewall Blocking Connection](./INSTALLATION.md#firewall-blocking-connection)

**Development Issues**
- [Tool Not Found](./DEVELOPMENT.md#tool-not-found)
- [WebSocket Connection Issues](./DEVELOPMENT.md#websocket-connection-issues)
- [Parameter Validation Errors](./DEVELOPMENT.md#parameter-validation-errors)

## 🆘 Getting Help

### Documentation Feedback
If you find errors, omissions, or opportunities for improvement in this documentation:

1. **GitHub Issues**: Report documentation issues with the "documentation" label
2. **Pull Requests**: Submit improvements directly to the docs/ directory
3. **Discussions**: Use GitHub Discussions for questions about the documentation

### Technical Support  

**Community Support**
- GitHub Issues for bug reports and feature requests
- GitHub Discussions for questions and community help
- Check existing issues before creating new ones

**Professional Support**
- Commercial support available for enterprise deployments
- Custom development and integration services
- Security audits and hardening consultation

### Contributing to Documentation

We welcome improvements to the documentation! See the [Development Guide](./DEVELOPMENT.md) for:

- Documentation standards and style guide
- How to build and preview documentation locally  
- Review process for documentation changes
- Translation and internationalization guidelines

## 📋 Documentation Checklist

Use this checklist to ensure you have the information needed for your use case:

### For New Users
- [ ] Read [Installation Guide](./INSTALLATION.md) for your platform
- [ ] Review [API Documentation](./API.md) tool overview
- [ ] Check [Security Guide](./SECURITY.md) security considerations
- [ ] Test basic functionality with browser extension
- [ ] Configure AI agent integration

### For Developers
- [ ] Set up development environment per [Development Guide](./DEVELOPMENT.md)
- [ ] Understand architecture from [Architecture Guide](./ARCHITECTURE.md)  
- [ ] Review code standards and contribution guidelines
- [ ] Test tool development workflow
- [ ] Read security development practices

### For Production Deployment
- [ ] Review [Security Guide](./SECURITY.md) thoroughly
- [ ] Configure firewall and network security
- [ ] Set up monitoring and logging
- [ ] Test disaster recovery procedures
- [ ] Document custom configurations

---

**Need more help?** Check the [GitHub Issues](https://github.com/browsermcp/mcp/issues) or start a [Discussion](https://github.com/browsermcp/mcp/discussions).