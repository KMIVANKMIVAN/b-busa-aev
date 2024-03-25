import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.contrasenia, 10);
    const userCreated = this.usuarioRepository.create({
      ...createUsuarioDto,
      contrasenia: hashedPassword,
    });

    return this.usuarioRepository.save(userCreated);
  }

  async findAll(): Promise<Usuario[]> {
    const users = await this.usuarioRepository.find();
    return users || [];
  }

  async findOne(id: number): Promise<Usuario | undefined> {
    const user = await this.usuarioRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException({
        error: `El Usuario con ID ${id} NO Existe`,
        message: `Usuario con ID ${id} no fue encontrado`,
      });
    }
    return user;
  }

  async findOneCi(ci: string): Promise<Usuario[] | undefined> {
    const users = await this.usuarioRepository
      .createQueryBuilder('usuarios')
      .where('usuarios.ci ILIKE :ci', { nomci: `%${ci}%` })
      .take(5)
      .getMany();
    if (!users) {
      throw new NotFoundException({
        error: `El Usuario con dato ${ci} NO Existe`,
        message: `Usuario con dato ${ci} no fue encontrado`,
      });
    }
    return users;
  }

  async findOneByUserCi(ci: string): Promise<Usuario> {
    return this.usuarioRepository.findOne({ where: { ci } });
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    const userUpdated = Object.assign(user, updateUsuarioDto);
    return await this.usuarioRepository.save(userUpdated);
  }

  async remove(id: number): Promise<string> {
    try {
      await this.usuarioRepository.delete(id);
      return `Se elimino el usuario con ID: ${id}`;
    } catch (error) {
      throw new Error(
        `No se pudo eliminar el usuario. Usuario con ID ${id} no encontrado`,
      );
    }
  }
}
