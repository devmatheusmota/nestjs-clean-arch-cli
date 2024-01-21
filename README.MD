## NestJS Clean Architecture CLI

A CLI tool for generating NestJS projects following the Clean Architecture principles.

## Features

- Generate a new NestJS project with a predefined folder structure adhering to Clean Architecture. 
- Easy selection of package manager (npm, yarn, pnpm) via command line flags or interactive prompts.
- Automated removal of unnecessary files and directories from the standard NestJS project structure.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v12 or later)
- npm, yarn, or pnpm

## Installation

Install the CLI globally by running:

```bash
$ npm install -g nestjs-clean-architecture-cli
```

Or if you prefer using yarn:
```bash
$ yarn add -g nestjs-clean-architecture-cli
```

Or if you don't want to install globally:
```bash
$ npx nca <command>
```

# Usage

To start a new NestJS project, run:
```bash
$ nestjs-clean-architecture-cli init <project-name>
```

or 

```bash
$ nca init <project_name>
```
---
You can specify the package manager directly:
```bash
nca init <project_name> -m npm
```

You can specify which ORM to use:
```bash
nca init <project_name> -o prisma
```

Or you can let the CLI prompt you to choose the package manager interactively.

## Commands and Options
- `init <project-name>`: Generates a new NestJS project.
  - `-m, --package-manager <manager>`: (Optional) Choose the package manager to use (npm, yarn, pnpm)
  - `-o, --orm <orm>`: (Optional) Choose the ORM to use (prisma, typeorm)

## Project Structure
The generated project will have two different structures:

### Prisma
```arduino
<project-name>
├── src
│   ├── app.module.ts
│   ├── core
│   │   ├── application
│   │   │   ├── interfaces
│   │   │   │   └── repositories
│   │   │   └── use-cases
│   │   └── domain
│   │       ├── entities
│   │       ├── exceptions
│   │       └── types
│   ├── infra
│   │   ├── database
│   │   │   ├── database.module.ts
│   │   │   └── prisma
│   │   │       └── repositories
│   │   ├── http
│   │   │   ├── controllers
│   │   │   ├── dtos
│   │   │   ├── interceptors
│   │   │   ├── mappers
│   │   │   └── middlewares
│   │   ├── lib
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   └── util
│   └── main.ts
└── ...
```

### TypeORM
```arduino
<project-name>
├── src
│   ├── app.module.ts
│   ├── core
│   │   ├── application
│   │   │   ├── interfaces
│   │   │   │   └── repositories
│   │   │   └── use-cases
│   │   └── domain
│   │       ├── entities
│   │       ├── exceptions
│   │       └── types
│   ├── infra
│   │   ├── database
│   │   │   ├── database.module.ts
│   │   │   └── typeorm
│   │   │       ├── database.providers.ts
│   │   │       ├── entities
│   │   │       └── repositories
│   │   ├── http
│   │   │   ├── controllers
│   │   │   ├── dtos
│   │   │   ├── interceptors
│   │   │   ├── mappers
│   │   │   └── middlewares
│   │   ├── lib
│   │   └── util
│   └── main.ts
└── ...
```

## Contributing

Contributions to the NestJS Clean Architecture CLI are welcome! Please follow the standard process:

1. Fork the repository.
2. Create a new branch for each feature or improvement.
3. Send a pull request from each feature branch to the main branch.

---

For more information, please contact Matheus Mota (devmatheusmota@gmail.com)

