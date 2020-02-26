import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne
} from "typeorm";
import User from "./User";

@Entity()
class Place extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "double precision", default: 0 })
  lat: number;

  @Column({ type: "double precision", default: 0 })
  lng: number;

  @Column({ type: "text" })
  address: string;

  @Column({ type: "boolean", default: false })
  isFav: boolean;

  // realation 로드없이 relation의 id만 가져오는 방법
  @Column({ nullable: true })
  userId: number;

  @ManyToOne(
    type => User,
    user => user.places
  )
  user: User;

  @CreateDateColumn() createdAt: string;

  @UpdateDateColumn() updatedAt: string;
}
export default Place;
