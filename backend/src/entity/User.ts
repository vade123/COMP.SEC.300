import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude, instanceToPlain } from 'class-transformer';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
export interface IUser {
  id: string;
  username: string;
  email: string;
  info: string;
  role: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role!: Role;

  @Column({
    default: '',
  })
  info!: string;

  toJSON() {
    return instanceToPlain(this);
  }
}

