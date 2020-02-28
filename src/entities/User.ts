import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
  OneToMany
} from "typeorm";
import bcrypt from "bcrypt";
import { IsEmail } from "class-validator";
import Chat from "./Chat";
import Message from "./Message";
import Ride from "./Ride";
import Place from "./Place";

const BCRYPT_ROUNDS = 10;

@Entity()
class User extends BaseEntity {
  // @PrimaryGeneratedColumn("uuid")
  // id: string;
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: true })
  @IsEmail()
  email: string | null;

  @Column({ type: "boolean", default: false })
  verifiedEmail: boolean;

  @Column({ type: "text" })
  firstName: string;

  @Column({ type: "text" })
  lastName: string;

  @Column({ type: "int", nullable: true })
  age: number | null;

  @Column({ type: "text", nullable: true })
  password: string;

  @Column({ type: "text", nullable: true })
  phoneNumber: string;

  @Column({ type: "boolean", default: false })
  verifiedPhoneNumber: boolean;

  @Column({ type: "text", nullable: true })
  profilePhoto: string | null;

  @Column({ type: "boolean", default: false })
  isDriving: boolean;

  @Column({ type: "boolean", default: false })
  isRiding: boolean;

  @Column({ type: "boolean", default: false })
  isTaken: boolean;

  // double precision 는 float와 같음.
  @Column({ type: "double precision", default: 0 })
  lastLng: number;

  @Column({ type: "double precision", default: 0 })
  lastLat: number;

  @Column({ type: "double precision", default: 0 })
  lastOrientation: number;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column({ type: "text", nullable: true })
  fbId: string;

  @OneToMany(
    type => Chat,
    chat => chat.passenger
  )
  chatsAsPassenger: Chat[];

  @OneToMany(
    type => Chat,
    chat => chat.driver
  )
  chatsAsDriver: Chat[];

  @OneToMany(
    type => Message,
    message => message.user
  )
  messages: Message[];

  @OneToMany(
    type => Ride,
    ride => ride.passenger
  )
  ridesAsPassenger: Ride[];

  @OneToMany(
    type => Ride,
    ride => ride.driver
  )
  ridesAsDriver: Ride[];

  @OneToMany(
    type => Place,
    place => place.user
  )
  places: Place[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  // comparePassword는 나중에 resolver에서 필요할 때 마다 사용 할것
  public comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }

  @BeforeInsert()
  // @BeforeUpdate()
  // 만약에 해당 User entity가 업데이트 될떄마다 savaPassword를 실행할 경우
  // 비밀번호 외의 값이 변경시에도 비밀번호가 재차 해쉬되어 당초 비밀번호를 해쉬한 값이아닌
  // 해쉬된 비밀번호가 다시 해쉬되어 당초 비밀번호로 로그인이 되지 않는 오류가 발생한다.
  async savePassword() {
    if (this.password) {
      const hashedPassword = await this.hashPassword(this.password);
      this.password = hashedPassword;
    }
  }

  public hashPassword(password: string) {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }
}

export default User;
