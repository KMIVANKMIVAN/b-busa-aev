import { Module } from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { SucursalesController } from './sucursales.controller';
import { Sucursale } from './entities/sucursale.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DepartamentosModule } from '../departamentos/departamentos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sucursale]), DepartamentosModule],
  controllers: [SucursalesController],
  providers: [SucursalesService],
  exports: [TypeOrmModule, SucursalesService],
})
export class SucursalesModule {}
