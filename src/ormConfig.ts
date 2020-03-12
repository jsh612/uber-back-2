import { ConnectionOptions } from "typeorm";

// console.log(process.env.DB_ENDPOINT);

const connectionOptions: ConnectionOptions = {
  type: "postgres",
  database: process.env.DB_NAME, // nuber
  synchronize: true, // DB와 동기화 할건지 여부 --> true: 서버 다시 실행될 때마다 data 다시 입력되는 느낌
  // logging: true,
  entities: ["entities/**/*.*"],
  host: process.env.DB_ENDPOINT,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
};

export default connectionOptions;
