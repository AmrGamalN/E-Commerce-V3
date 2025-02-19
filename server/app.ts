import connectToMongoDB from "./src/config/mongooseConnection";
import router from "./src/router";
import swaggerOptions from "./src/swaggerConfig";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

// Define express app & swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);
const app: Application = express();

// cors options
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type ,Authorization"],
  Credential: true,
};

//  middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/v1", router);

// Connection MongoDB
Promise.all([connectToMongoDB()])
  .then(() => {
    app.listen(process.env.PROT || 8080, () => {
      console.log(`Server is running on port ${process.env.PROT}`);
      console.log(
        `API Documentation: http://localhost:${process.env.PROT}/api-docs`
      );
    });
  })
  .catch((err: any) => {
    console.error(err.message);
    process.exit(1);
  });
