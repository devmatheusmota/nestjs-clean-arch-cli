import { execa } from "execa";
import fs from "fs-extra";
import inquirer from "inquirer";
import {
  appModuleTSImportingDatabaseModule,
  databaseModuleTSImportingDatabaseProvider,
  databaseModuleTSImportingPrismaModule,
  prismaDirectories,
  prismaModuleTS,
  prismaSchema,
  prismaServiceTS,
  typeORMDataSource,
  typeormDirectories,
} from "./constants.js";

export async function checkPackageManager(packageManager) {
  if (!(await isPackageManagerInstalled(packageManager))) {
    await offerToInstallPackageManager(packageManager);
  }
}

async function isPackageManagerInstalled(packageManager) {
  try {
    await execa(packageManager, ["-v"]);
    return true;
  } catch (error) {
    console.error(`${packageManager} is not installed.`);
    return false;
  }
}

async function offerToInstallPackageManager(packageManager) {
  const answers = await inquirer.prompt([
    {
      type: "confirm",
      name: "install",
      message: `Would you like to install ${packageManager}?`,
      default: true,
    },
  ]);

  if (answers.install) {
    await installPackageManager(packageManager);
  } else {
    console.error(`Installation of ${packageManager} is required to proceed.`);
    process.exit(1);
  }
}

async function installPackageManager(packageManager) {
  try {
    await execa("npm", ["install", "-g", packageManager]);
    console.log(`${packageManager} was successfully installed.`);
  } catch (error) {
    console.error(`Failed to install ${packageManager}`, error.message);
    process.exit(1);
  }
}

export async function createPrismaStructure(projectPath, packageManager) {
  await initPrisma(projectPath);
  await createDirectories(prismaDirectories, projectPath);
  await createFiles(projectPath, [
    { path: "/src/core/infra/lib/prisma.service.ts", content: prismaServiceTS },
    { path: "/prisma/schema.prisma", content: prismaSchema },
    { path: "/src/core/infra/lib/prisma.module.ts", content: prismaModuleTS },
    {
      path: "/src/core/infra/database/database.module.ts",
      content: databaseModuleTSImportingPrismaModule,
    },
    { path: "/src/app.module.ts", content: appModuleTSImportingDatabaseModule },
  ]);
  await execa("npx", ["prisma", "generate"]);
}

export async function createTypeORMStructure(projectPath, packageManager) {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "database",
      message: "Choose the database to use:",
      choices: ["postgres", "mysql", "mariadb", "sqlite"],
      default: "postgres",
    },
  ]);

  switch (answer.database) {
    case "postgres":
      await execa(packageManager, ["install", "pg", "reflect-metadata"]);
      break;
    case "mysql":
      await execa(packageManager, ["install", "mysql", "reflect-metadata"]);
      break;
    case "mariadb":
      await execa(packageManager, ["install", "mariadb", "reflect-metadata"]);
      break;
    case "sqlite":
      await execa(packageManager, ["install", "sqlite3", "reflect-metadata"]);
      break;
    default:
      break;
  }

  await createDirectories(typeormDirectories, projectPath);
  await createFiles(projectPath, [
    {
      path: "/src/core/infra/database/typeorm/database.providers.ts",
      content: typeORMDataSource,
    },
    {
      path: "/src/core/infra/database/database.module.ts",
      content: databaseModuleTSImportingDatabaseProvider,
    },
    { path: "/src/app.module.ts", content: appModuleTSImportingDatabaseModule },
  ]);
}

async function initPrisma(projectPath) {
  await execa("npx", ["prisma", "init"]);
}

async function createDirectories(directories, projectPath) {
  for (const dir of directories) {
    await fs.ensureDir(`${projectPath}/${dir}`);
  }
}

async function createFiles(projectPath, files) {
  const writeOperations = files.map((file) =>
    fs.writeFile(`${projectPath}${file.path}`, file.content)
  );
  await Promise.all(writeOperations);
}
