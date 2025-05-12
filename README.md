# File Manager

A CLI-based File Manager application built with Node.js.

## Prerequisites

Use 22.x.x version (22.14.0 or upper) of Node.js

## Installation

1. Clone this repository
2. The program is started by npm-script `start` in following way:

```bash
npm run start -- --username=your_username
```

## Available Commands

### Navigation

- `up` - Navigate to parent directory
- `cd [path]` - Change directory
- `ls` - List contents of the current directory

### File Operations

- `cat [file]` - Display file contents
- `add [file]` - Create a new empty file
- `rn [old_file] [new_file]` - Rename file
- `cp [source] [destination]` - Copy file
- `mv [source] [destination]` - Move file
- `rm [file]` - Delete file

### Compression

- `compress [source] [destination]` - Compress file using Brotli algorithm
- `decompress [source] [destination]` - Decompress file

### System Information

- `os --EOL` - Show system End-Of-Line marker
- `os --cpus` - Show information about CPUs
- `os --homedir` - Show home directory
- `os --username` - Show current username
- `os --architecture` - Show CPU architecture

### Other

- `hash [file]` - Calculate SHA256 hash for a file
