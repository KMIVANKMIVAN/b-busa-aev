import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { DepartamentosModule } from './departamentos/departamentos.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { SemillasModule } from './semillas/semillas.module';

import { Usuario } from './usuarios/entities/usuario.entity';
import { Role } from './roles/entities/role.entity';
import { Departamento } from './departamentos/entities/departamento.entity';
import { Sucursale } from './sucursales/entities/sucursale.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsuariosModule,
    RolesModule,
    DepartamentosModule,
    SucursalesModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres', // Tipo de base de datos
        host: configService.get<string>('IPBASEDEDATOS'), // IP de la base de datos
        port: configService.get<number>('DATABASEPUERTO'), // Puerto estándar de PostgreSQL
        username: configService.get<string>('USERNAMEBD'), // Nombre de usuario para la conexión
        password: configService.get<string>('USERPASSWORD'), // Contraseña del usuario
        database: configService.get<string>('DATABASEBUSAAEV'), // Nombre de la base de datos
        entities: [Usuario, Role, Departamento, Sucursale],
        synchronize: true, // Utilizar 'false' en producción
      }),
      inject: [ConfigService], // Correctamente ubicado dentro de TypeOrmModule.forRootAsync
    }),
    /* TypeOrmModule.forRoot({
      type: 'postgres', // Tipo de base de datos
      host: '10.10.1.158', // IP de la base de datos
      port: 5432, // Puerto estándar de PostgreSQL
      username: 'postgres', // Nombre de usuario para la conexión
      password: 'postgres', // Contraseña del usuario
      database: 'busaaev', // Nombre de la base de datos
      entities: [Usuario, Role, Departamento, Sucursale],
      synchronize: true, // Utilizar 'false' en producción
    }), */
    SemillasModule,
    AuthModule,
  ],
})
export class AppModule { }