import { Controller, Get, Post } from '@nestjs/common';
import { SemillasService } from './semillas.service';

@Controller('semillas')
export class SemillasController {
  constructor(private readonly semillasService: SemillasService) { }
  @Post('ejecutarsemilla')
  ejecutarSemilla() {
    return this.semillasService.ejecutarSemilla();
  }
  // @HttpCode(HttpStatus.OK)
  @Get('hola')
  hola() {
    return 'hola';
  }
}