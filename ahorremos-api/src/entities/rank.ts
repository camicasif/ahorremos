import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'rank' })
export class Rank {
  @ApiProperty({
    description: 'ID único del rango',
    example: 1,
    readOnly: true, // Indica que es un campo de solo lectura (generado automáticamente)
  })
  @PrimaryGeneratedColumn()
  rank_id?: number;

  @ApiProperty({
    description: 'Rango',
    example: 'admin',
    nullable: false, // Indica que el campo puede ser nulo
  })
  @Column({ type: 'text', nullable: true })
  name?: string | null;


}
export default Rank;