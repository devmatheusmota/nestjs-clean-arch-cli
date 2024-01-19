// ------------------ Diretórios ------------------
// Estrutura de diretórios base para a aplicação.
export const directories = [
  `src/core`,
  `src/core/domain`,
  `src/core/domain/entities`,
  `src/core/domain/types`,
  `src/core/domain/exceptions`,
  `src/core/application`,
  `src/core/application/interfaces`,
  `src/core/application/interfaces/repositories`,
  `src/core/application/use-cases`,
  `src/core/infra`,
  `src/core/infra/database`,
  `src/core/infra/http`,
  `src/core/infra/http/controllers`,
  `src/core/infra/http/middlewares`,
  `src/core/infra/http/dtos`,
  `src/core/infra/http/interceptors`,
  `src/core/infra/http/mappers`,
  `src/core/infra/lib`,
  `src/core/infra/util`,
];

// Diretórios específicos para Prisma ORM.
export const prismaDirectories = [
  `src/core/infra/database/prisma`,
  `src/core/infra/database/prisma/repositories`,
];

// Diretórios específicos para TypeORM.
export const typeormDirectories = [
  `src/core/infra/database/typeorm`,
  `src/core/infra/database/typeorm/entities`,
  `src/core/infra/database/typeorm/repositories`,
];

// ------------------ Configurações NestJS ------------------
// Arquivo principal para inicializar a aplicação NestJS.
export const mainTS = `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
`;

// Módulo raiz da aplicação NestJS.
export const appModuleTS = `import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
`;

// Módulo raiz da aplicação NestJS, importando módulo de banco de dados.
export const appModuleTSImportingDatabaseModule = `import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/infra/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
`;

// ------------------ Configurações de Banco de Dados ------------------
// Módulo base para banco de dados, a ser estendido por ORM específico.
export const databaseModuleTS = `import { Module } from '@nestjs/common';

@Module({
  exports: [],
  imports: [],
  providers: [],
})
export class DatabaseModule {}
`;

// ------------------ Prisma ORM ------------------
// Módulo do Prisma para integração com NestJS.
export const prismaModuleTS = `import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

const providers = [PrismaService];

@Global()
@Module({
  exports: providers,
  providers,
})
export class PrismaModule {}`;

// Serviço do Prisma para gerenciamento de conexão.
export const prismaServiceTS = `import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      this.logger.debug('Connecting to database...');
      await this.$connect();
      this.logger.debug('Connection established');
    } catch (e) {
      this.logger.error(
        'Error connecting to database: ' + (e as Error).message,
      );
    }
  }

  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
`;

// Schema do Prisma para definição de modelos e conexão com o banco de dados.
export const prismaSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;

// Módulo de banco de dados para Prisma.
export const databaseModuleTSImportingPrismaModule = `import { Module } from '@nestjs/common';
import { PrismaModule } from './../lib/prisma.module';

@Module({
  exports: [],
  imports: [PrismaModule],
  providers: [],
})
export class DatabaseModule {}
`;

// ------------------ TypeORM ------------------
// Configuração do DataSource do TypeORM para conexão com o banco de dados.
export const typeORMDataSource = `import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
`;

// Módulo de banco de dados para TypeORM.
export const databaseModuleTSImportingDatabaseProvider = `import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './typeorm/database.providers';

@Global()
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
`;
