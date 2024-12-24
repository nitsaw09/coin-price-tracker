import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity()
@Index(["chain", "email"])
export class PriceAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string;

  @Column('decimal', { precision: 18, scale: 8 })
  @Index()
  targetPrice: number;

  @Column()
  email: string;

  @Column({ default: false })
  isTriggered: boolean;

  @CreateDateColumn()
  createdAt: Date;
}