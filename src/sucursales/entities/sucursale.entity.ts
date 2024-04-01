// export class Sucursale {}
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Departamento } from 'src/departamentos/entities/departamento.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Entity('sucursales')
export class Sucursale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  sucursal: string;

  @ManyToOne(() => Departamento, (departamento) => departamento.sucursales)
  @JoinColumn({ name: 'departamento_id' })
  departamento_id: Departamento;

  @OneToMany(() => Usuario, (usuario) => usuario.sucursal_id)
  usuarios: Usuario[];
}
