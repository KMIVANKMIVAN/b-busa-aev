import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { DepartamentosModule } from './departamentos/departamentos.module';
import { SucursalesModule } from './sucursales/sucursales.module';

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
    TypeOrmModule.forRoot({
      type: 'postgres', // Tipo de base de datos
      host: 'localhost', // IP de la base de datos
      port: 5432, // Puerto estándar de PostgreSQL
      username: 'postgres', // Nombre de usuario para la conexión
      password: 'postgres', // Contraseña del usuario
      database: 'busa aev', // Nombre de la base de datos
      entities: [Usuario, Role, Departamento, Sucursale],
      synchronize: true, // Utilizar 'false' en producción
    }),
    AuthModule,
  ],
})
export class AppModule {}
