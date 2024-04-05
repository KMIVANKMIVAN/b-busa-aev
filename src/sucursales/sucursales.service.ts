import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSucursaleDto } from './dto/create-sucursale.dto';
import { UpdateSucursaleDto } from './dto/update-sucursale.dto';
import { Sucursale } from './entities/sucursale.entity';

import { Departamento } from '../departamentos/entities/departamento.entity';

// import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class SucursalesService {
  constructor(
    @InjectRepository(Sucursale)
    private readonly sucursaleRepository: Repository<Sucursale>,
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    // private usuariosService: UsuariosService,
  ) { }

  async create(createSucursaleDto: CreateSucursaleDto) {
    try {
      // Buscar el departamento por su ID
      const departamento = await this.departamentoRepository.findOne({
        where: { id: createSucursaleDto.departamento_id },
      });
      if (!departamento) {
        throw new BadRequestException({
          statusCode: 400,
          error: `El departamento con ID ${createSucursaleDto.departamento_id} NO Existe`,
          message: `Departamento con ID ${createSucursaleDto.departamento_id} no fue encontrado`,
        });
      }

      // Crear nueva sucursal y asignar el departamento
      const newSucursale = new Sucursale();
      newSucursale.sucursal = createSucursaleDto.sucursal;
      newSucursale.departamento_id = departamento;

      return await this.sucursaleRepository.save(newSucursale);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (create): ${error}`,
          message: `Error del Servidor en (create): ${error}`,
        });
      }
    }
  }

  async findAll() {
    try {
      const sucursales = await this.sucursaleRepository.find();
      if (!sucursales || sucursales.length === 0) {
        throw new BadRequestException({
          error: `No se encontraron sucursales`,
          message: `No hay sucursales en la base de datos`,
        });
      }
      return sucursales;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (findAll): ${error}`,
          message: `Error del Servidor en (findAll): ${error}`,
        });
      }
    }
  }

  async findAllPorDep(userId: number) {
    try {
      console.log("lo q llega", userId);

      // Encuentra el usuario con su sucursal y el departamento de esa sucursal
      const usuario = await this.usuarioRepository.findOne({
        where: { id: userId },
        relations: ['sucursal_id', 'sucursal_id.departamento_id'], // Asegúrate de que estas relaciones estén correctamente definidas
      });

      if (!usuario || !usuario.sucursal_id || !usuario.sucursal_id.departamento_id) {
        throw new BadRequestException({
          error: `No se encontró el usuario o su departamento asignado`,
          message: `El usuario con ID ${userId} no tiene una sucursal o departamento asignado`,
        });
      }

      // Encuentra todas las sucursales que pertenecen a ese departamento
      const sucursales = await this.sucursaleRepository.find({
        where: { departamento_id: { id: usuario.sucursal_id.departamento_id.id } },
      });

      if (!sucursales || sucursales.length === 0) {
        throw new BadRequestException({
          error: `No se encontraron sucursales para el departamento del usuario`,
          message: `No hay sucursales asociadas al departamento del usuario con ID ${userId}`,
        });
      }

      return sucursales;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del servidor en (findAllPorDep): ${error.message}`,
          message: `Error del servidor en (findAllPorDep): ${error.message}`,
        });
      }
    }
  }

  /* async findAllPorDep(id: number) {
    try {
      const sucursales = await this.sucursaleRepository.find();
      if (!sucursales || sucursales.length === 0) {
        throw new BadRequestException({
          error: `No se encontraron sucursales`,
          message: `No hay sucursales en la base de datos`,
        });
      }
      return sucursales;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (findAllPorDep): ${error}`,
          message: `Error del Servidor en (findAllPorDep): ${error}`,
        });
      }
    }
  } */

  async findOne(id: number) {
    try {
      const sucursale = await this.sucursaleRepository.findOne({
        where: { id },
      });
      if (!sucursale) {
        throw new BadRequestException({
          statusCode: 400,
          error: `La sucursal con ID ${id} NO Existe`,
          message: `Sucursal con ID ${id} no fue encontrada`,
        });
      }
      return sucursale;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (findOne): ${error}`,
          message: `Error del Servidor en (findOne): ${error}`,
        });
      }
    }
  }

  async update(id: number, updateSucursaleDto: UpdateSucursaleDto) {
    try {
      const existingSucursale = await this.findOne(id);

      // Transforma el DTO en una instancia de Sucursale
      if (!existingSucursale) {
        throw new BadRequestException({
          statusCode: 400,
          error: `Sucursal con ID ${id} NO Existe`,
          message: `Sucursal con ID ${id} no fue encontrada`,
        });
      }
      const updatedSucursale = Object.assign(
        existingSucursale,
        updateSucursaleDto,
      );

      return await this.sucursaleRepository.save(updatedSucursale);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (update): ${error}`,
          message: `Error del Servidor en (update): ${error}`,
        });
      }
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const sucursale = await this.findOne(id);
      if (!sucursale) {
        throw new BadRequestException({
          statusCode: 400,
          error: `Sucursal con ID ${id} NO Existe`,
          message: `Sucursal con ID ${id} no fue encontrada`,
        });
      }
      await this.sucursaleRepository.delete(id);
      return { success: true, message: `Se eliminó la Sucursal con ID: ${id}` };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (remove): ${error}`,
          message: `Error del Servidor en (remove): ${error}`,
        });
      }
    }
  }
}
