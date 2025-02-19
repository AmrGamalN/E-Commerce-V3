import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Halla Deals",
      version: "1.0.0",
      description: "API documentation for the Halla Deals",
    },
    servers: [
      {
        url: "http://localhost:8080/api",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export default swaggerOptions;
