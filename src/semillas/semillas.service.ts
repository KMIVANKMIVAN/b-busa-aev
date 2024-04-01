import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Usuario } from '../usuarios/entities/usuario.entity';
import { Sucursale } from '../sucursales/entities/sucursale.entity';
import { Departamento } from '../departamentos/entities/departamento.entity';
import { Role } from '../roles/entities/role.entity';

import {
  SEMILLA_DEPARTAMENTOS,
  SEMILLA_ROLES,
  SEMILLA_SUCURSAL,
  SEMILLA_USUARIOS,
} from './datos/semilla-datos';

import { UsuariosService } from '../usuarios/usuarios.service';
import { SucursalesService } from '../sucursales/sucursales.service';
import { DepartamentosService } from '../departamentos/departamentos.service';
import { RolesService } from '../roles/roles.service';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SemillasService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Sucursale)
    private readonly sucursaleRepository: Repository<Sucursale>,

    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly sucursalesService: SucursalesService,
    private readonly departamentosService: DepartamentosService,
    private readonly rolesService: RolesService,
    private readonly usuarioService: UsuariosService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async ejecutarSemilla() {
    try {
      if (this.isProd) {
        throw new BadRequestException({
          statusCode: 400,
          error: `Error al ejecutar la semilla`,
          message: `Problemas en la ejecucion de la semilla`,
        });
      }

      // Limpiar la base de datos BORRAR TODO
      await this.eliminarDatabase();

      await this.crearDepartamentos();
      const sucursales = await this.crearSucursal();
      const roles = await this.crearRol();

      await this.crearUsuario(sucursales[0], roles[0]);

      return true;
    } catch (error) {
      // Manejo de excepciones
      throw new InternalServerErrorException({
        statusCode: 500,
        error: `Error del Servidor en (ejecutarSemilla): ${error}`,
        message: `Error del Servidor en (ejecutarSemilla): ${error}`,
      });
    }
  }

  async eliminarDatabase() {
    // borrar usuarios
    await this.usuarioRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // borrar empresas
    await this.sucursaleRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // borrar tipo empresas
    await this.departamentoRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // borrar rol
    await this.roleRepository.createQueryBuilder().delete().where({}).execute();
  }

  async crearDepartamentos(): Promise<Departamento> {
    const departamentos = [];

    for (const departamento of SEMILLA_DEPARTAMENTOS) {
      departamentos.push(await this.departamentosService.create(departamento));
    }

    return departamentos[0];
  }

  async crearRol(): Promise<Role> {
    const roles = [];

    for (const rol of SEMILLA_ROLES) {
      roles.push(await this.rolesService.create(rol));
    }

    return roles[0];
  }

  async crearSucursal(): Promise<Sucursale[]> {
    const sucursales = [];

    for (const sucursalData of SEMILLA_SUCURSAL) {
      const departamento = await this.departamentoRepository.findOneOrFail({
        where: { id: sucursalData.departamento_id }, // Corrección aquí
      });
      const nuevaSucursal = await this.sucursalesService.create({
        sucursal: sucursalData.sucursal,
        departamento_id: departamento.id, // Corrección aquí
      });
      sucursales.push(nuevaSucursal);
    }

    return sucursales;
  }

  async crearUsuario(sucursal: Sucursale, role: Role): Promise<Usuario[]> {
    const usuarios = [];

    for (const userData of SEMILLA_USUARIOS) {
      const roles = await this.roleRepository.findByIds(userData.roles);
      const nuevoUsuario = await this.usuarioService.create({
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        ci: userData.ci,
        complemento: userData.complemento,
        correo: userData.correo,
        contrasenia: userData.contrasenia,
        es_activo: userData.es_activo,
        se_cambiado_cntr: userData.se_cambiado_cntr,
        roles: roles.map((role) => role.id),
        sucursal_id: sucursal.id,
      });
      usuarios.push(nuevoUsuario);
    }

    return usuarios;
  }
}
