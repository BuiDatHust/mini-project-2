import { Expose } from 'class-transformer'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: string

  @Column('varchar', { length: 200, name: 'name', nullable: false })
  @Expose({ name: 'name' })
  name: string

  @Column('varchar', { length: 200, name: 'birthday', nullable: true })
  @Expose({ name: 'birthday' })
  birthday?: string

  @Column('varchar', {
    length: 200,
    name: 'email',
    nullable: false,
    unique: true,
  })
  @Expose({ name: 'email' })
  email: string
}
