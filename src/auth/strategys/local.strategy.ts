import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      ciField: 'ci',
      passwordField: 'contrasenia',
    });
  }
  async validate(ci: string, contrasenia: string) {
    const user = await this.authService.validateUser(ci, contrasenia);
    if (!user) {
      throw new UnauthorizedException('usuario no autorizado');
    }
    return user;
  }
}
