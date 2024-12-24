import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity()
@Index(["chain", "timestamp"])
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  chain: string;

  @Column('decimal', { precision: 18, scale: 8 })
  @Index()
  price: number;

  @CreateDateColumn()
  timestamp: Date;
}