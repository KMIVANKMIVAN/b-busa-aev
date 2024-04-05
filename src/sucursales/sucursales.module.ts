import { Module } from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { SucursalesController } from './sucursales.controller';
import { Sucursale } from './entities/sucursale.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DepartamentosModule } from '../departamentos/departamentos.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

import { forwardRef } from '@nestjs/common';

@Module({
  // imports: [TypeOrmModule.forFeature([Sucursale]), DepartamentosModule, UsuariosModule],
  imports: [TypeOrmModule.forFeature([Sucursale]), DepartamentosModule, forwardRef(() => UsuariosModule)],
  controllers: [SucursalesController],
  providers: [SucursalesService],
  exports: [TypeOrmModule, SucursalesService],
})
export class SucursalesModule { }
