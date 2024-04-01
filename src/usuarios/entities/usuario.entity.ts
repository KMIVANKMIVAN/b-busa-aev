import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Sucursale } from 'src/sucursales/entities/sucursale.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ type: 'boolean', default: false, nullable: false })
  se_cambiado_cntr: boolean;

  @ManyToMany(() => Role, (role) => role.usuarios, { cascade: true })
  @JoinTable()
  roles: Role[];

  @ManyToOne(() => Sucursale, (sucursale) => sucursale.usuarios)
  @JoinColumn({ name: 'sucursal_id' })
  sucursal_id: Sucursale;
}
