import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  /* @Column({ type: 'varchar', length: 100, nullable: false })
  sucursal: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  departamento: string; */

  @Column({ type: 'varchar', length: 50, nullable: false })
  nombres: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  apellidos: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  ci: string;

  @Column({ type: 'varchar', nullable: true, length: 10 })
  complemento: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  correo: string;

  @Column({ type: 'varchar', length: 70, nullable: false })
  contrasenia: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  es_activo: boolean;

  @ManyToMany(() => Role, (role) => role.usuarios, { cascade: true })
  @JoinTable()
  roles: Role[];
}
