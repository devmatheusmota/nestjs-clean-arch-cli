#!/usr/bin/env node

import { Command } from "commander";
import { initService } from "./services.js";

const program = new Command();

program.name("nest-clean-architecture").version("1.2.14");

program
  .command("init <project-name>")
  .description(
    "Start a new NestJS project with the default structure and dependencies following Clean Architecture structure."
  )
  .option(
    "-m, --package-manager <manager>",
    "Choose the package manager to use: npm, yarn or pnpm"
  )
  .option("-o, --orm <orm>", "Choose the ORM to use: typeorm, prisma")
  .action(initService);

program.parse(process.argv);
