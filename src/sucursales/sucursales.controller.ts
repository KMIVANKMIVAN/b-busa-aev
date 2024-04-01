import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { CreateSucursaleDto } from './dto/create-sucursale.dto';
import { UpdateSucursaleDto } from './dto/update-sucursale.dto';

import { AuthGuard } from '../auth/auth.guard';

@Controller('sucursales')
export class SucursalesController {
  constructor(private readonly sucursalesService: SucursalesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createSucursaleDto: CreateSucursaleDto) {
    return this.sucursalesService.create(createSucursaleDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.sucursalesService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.sucursalesService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateSucursaleDto: UpdateSucursaleDto,
  ) {
    return this.sucursalesService.update(+id, updateSucursaleDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.sucursalesService.remove(+id);
  }
}
