// export class Departamento {}
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Sucursale } from 'src/sucursales/entities/sucursale.entity';

@Entity('departamentos')
export class Departamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  departamento: string;

  @OneToMany(() => Sucursale, (sucursale) => sucursale.departamento_id)
  sucursales: Sucursale[];
}
