import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { Departamento } from './entities/departamento.entity';

@Injectable()
export class DepartamentosService {
  constructor(
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,
  ) {}

  async create(createDepartamentoDto: CreateDepartamentoDto) {
    try {
      const newDepartamento = this.departamentoRepository.create(
        createDepartamentoDto,
      );
      return await this.departamentoRepository.save(newDepartamento);
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
      const departamentos = await this.departamentoRepository.find();
      if (!departamentos || departamentos.length === 0) {
        throw new BadRequestException({
          error: `No se encontraron departamentos`,
          message: `No hay departamentos en la base de datos`,
        });
      }
      return departamentos;
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

  async findOne(id: number) {
    try {
      const departamento = await this.departamentoRepository.findOne({
        where: { id },
      });
      if (!departamento) {
        throw new BadRequestException({
          statusCode: 400,
          error: `El departamento con ID ${id} NO Existe`,
          message: `Departamento con ID ${id} no fue encontrado`,
        });
      }
      return departamento;
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

  async update(id: number, updateDepartamentoDto: UpdateDepartamentoDto) {
    try {
      const existingDepartamento = await this.findOne(id);
      if (!existingDepartamento) {
        throw new BadRequestException({
          statusCode: 400,
          error: `Departamento con ID ${id} NO Existe`,
          message: `Departamento con ID ${id} no fue encontrada`,
        });
      }
      const updateResult = await this.departamentoRepository.update(
        id,
        updateDepartamentoDto,
      );
      if (updateResult.affected === 0) {
        throw new BadRequestException({
          statusCode: 400,
          error: `El Departamento con ID ${id} NO se actualizó correctamente`,
          message: `Departamento con ID ${id} no se actualizó correctamente`,
        });
      }
      return this.findOne(id);
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

  async remove(id: number) {
    try {
      const departamento = await this.findOne(id);
      if (!departamento) {
        throw new BadRequestException({
          statusCode: 400,
          error: `Departamento con ID ${id} NO Existe`,
          message: `Departamento con ID ${id} no fue encontrada`,
        });
      }
      await this.departamentoRepository.delete(id);
      return {
        success: true,
        message: `Se eliminó el Departamento con ID: ${id}`,
      };
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
