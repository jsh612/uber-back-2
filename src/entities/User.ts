import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  OneToMany
} from "typeorm";
import bcrypt from "bcrypt";
import { IsEmail } from "class-validator";
import Chat from "./Chat";
import Message from "./Message";
import Ride from "./Ride";
import Verification from "./Verification";

const BCRYPT_ROUNDS = 10;

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", unique: true })
  @IsEmail()
  email: string;

  @Column({ type: "boolean", default: false })
  verifiedEmail: boolean;

  @Column({ type: "text" })
  firstName: string;

  @Column({ type: "text" })
  lastName: string;

  @Column({ type: "int" })
  age: number;

  @Column({ type: "text" })
  password: string;

  @Column({ type: "text" })
  phoneNumber: string;

  @Column({ type: "boolean", default: false })
  verifiedPhonenNumber: boolean;

  @Column({ type: "text" })
  profilePhoto: string;

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

  @ManyToOne(
    type => Chat,
    chat => chat.participants
  )
  chat: Chat;

  @OneToMany(
    type => Message,
    message => message.user
  )
  messages: Message[];

  @OneToMany(
    type => Verification,
    verification => verification.user
  )
  verifications: Verification[];

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

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  // comparePassword는 나중에 resolver에서 필요할 때 마다 사용 할것
  public comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async savePassword() {
    if (this.password) {
      const hashedPassword = await this.hashPassword(this.password);
      this.password = hashedPassword;
    }
  }

  private hashPassword(password: string) {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }
}

export default User;
