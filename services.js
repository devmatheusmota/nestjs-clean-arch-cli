import { execa } from "execa";
import fs from "fs-extra";
import inquirer from "inquirer";
import { appModuleTS, directories, mainTS } from "./constants.js";
import {
  checkPackageManager,
  createPrismaStructure,
  createTypeORMStructure,
} from "./helpers.js";

export const initService = async (projectName, options) => {
  let { packageManager, orm } = options;
  packageManager = packageManager || (await promptForPackageManager());
  await checkPackageManager(packageManager);
  console.log(
    `Starting a new NestJS project: ${projectName} with ${packageManager}...`
  );
  await createProject(projectName, packageManager);
  await installDependencies(packageManager, projectName);
  await setupProjectStructure(projectName, orm, packageManager);
  console.log("Project ready!");
};

async function promptForPackageManager() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "packageManager",
      message: "Choose the package manager to use:",
      choices: ["npm", "yarn", "pnpm"],
      default: "npm",
    },
  ]);
  return answers.packageManager;
}

async function createProject(projectName, packageManager) {
  await runCommandWithExitOnError(
    "npx",
    [
      "@nestjs/cli@latest",
      "new",
      projectName,
      "--package-manager",
      packageManager,
    ],
    "Failed to create project"
  );
}

async function installDependencies(packageManager, projectName) {
  const projectPath = `${process.cwd()}/${projectName}`;

  process.chdir(projectPath);
  await runCommandWithExitOnError(
    packageManager,
    ["install", "@nestjs/config", "--save"],
    "Failed to install dependencies"
  );
  process.chdir("..");
}

async function setupProjectStructure(projectName, ormOption, packageManager) {
  const projectPath = `${process.cwd()}/${projectName}`;
  process.chdir(projectName);
  console.log(`Structuring project...`);

  await fs.remove(`${projectPath}/test`);
  await fs.emptyDir(`${projectPath}/src`);

  for (const dir of directories) {
    await fs.ensureDir(`${projectPath}/${dir}`);
  }

  await createCoreFiles(projectPath);

  const orm = ormOption || (await promptForORM());
  await handleORMSetup(orm, projectPath, packageManager);
}

async function createCoreFiles(projectPath) {
  await Promise.all([
    fs.writeFile(`${projectPath}/src/main.ts`, mainTS),
    fs.writeFile(`${projectPath}/src/app.module.ts`, appModuleTS),
    fs.writeFile(
      `${projectPath}/.env`,
      "PORT=\nDATABASE_HOST=\nDATABASE_PORT=\nDATABASE_USERNAME=\nDATABASE_PASSWORD=\nDATABASE_NAME="
    ),
    fs.writeFile(
      `${projectPath}/.env.example`,
      "PORT=\nDATABASE_HOST=\nDATABASE_PORT=\nDATABASE_USERNAME=\nDATABASE_PASSWORD=\nDATABASE_NAME=DATABASE_NAME=\n"
    ),
    fs.appendFile(`${projectPath}/.gitignore`, "\n.env"),
  ]);
}

async function promptForORM() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Choose the ORM to use:",
      choices: ["prisma", "typeorm", "none"],
      default: "prisma",
    },
  ]);
  return answers.option;
}

async function handleORMSetup(orm, projectPath, packageManager) {
  if (orm === "prisma") {
    await installPackage(packageManager, ["prisma", "@prisma/client"]);
    await createPrismaStructure(projectPath, packageManager);
  } else if (orm === "typeorm") {
    await installPackage(packageManager, ["typeorm"]);
    await createTypeORMStructure(projectPath, packageManager);
  }
}

async function installPackage(packageManager, packages) {
  await runCommandWithExitOnError(
    packageManager,
    ["install", ...packages, "--save"],
    `Failed to install ${packages.join(", ")}`
  );
}

async function runCommandWithExitOnError(command, args, errorMessage) {
  try {
    await execa(command, args);
  } catch (error) {
    console.error(errorMessage, error.message);
    process.exit(1);
  }
}
