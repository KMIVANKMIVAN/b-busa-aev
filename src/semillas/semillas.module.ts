import { Module } from '@nestjs/common';
import { SemillasService } from './semillas.service';
import { SemillasController } from './semillas.controller';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Semilla } from './entities/semilla.entity';

import { DepartamentosModule } from '../departamentos/departamentos.module';
import { RolesModule } from '../roles/roles.module';
import { SucursalesModule } from '../sucursales/sucursales.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
// import {} from '../';

@Module({
  imports: [
    TypeOrmModule.forFeature([Semilla]),
    DepartamentosModule,
    RolesModule,
    SucursalesModule,
    UsuariosModule,
  ],
  controllers: [SemillasController],
  providers: [SemillasService],
})
export class SemillasModule {}
