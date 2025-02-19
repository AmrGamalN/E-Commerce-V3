import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
  username: "default",
  password: process.env.PASSWORD,
  socket: {
    host: "redis-11453.c61.us-east-1-3.ec2.redns.redis-cloud.com",
    port: 11453,
  },
});

export { client };
