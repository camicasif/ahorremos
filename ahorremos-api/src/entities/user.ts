import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import Rank from './rank';

@Entity({ name: 'user' })
export class User {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 1,
    readOnly: true, // Indica que es un campo de solo lectura (generado automáticamente)
  })
  @PrimaryGeneratedColumn()
  user_id?: number;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@example.com',
    nullable: true, // Indica que el campo puede ser nulo
  })
  @Column({ type: 'text', nullable: true })
  email?: string | null;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123!',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  password?: string | null;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  name?: string | null;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  lastName?: string | null;

  @ApiProperty({
    description: 'Rango asociado al usuario. Si no se proporciona, se asigna el rango por defecto.',
    type: () => Rank,
    required: false,
  })
  @ManyToOne(() => Rank, (rank) => rank.rank_id) // Asegúrate de que 'users' sea la propiedad en Rank
  @JoinColumn({ name: 'rank_id' }) // Nombre de la columna en la tabla User
  rank?: Rank;
}
export default User;