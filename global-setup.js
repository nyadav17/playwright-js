import dotenv from "dotenv";
import path from "path";

async function globalSetup() {
  dotenv.config({
    path: process.env.TEST_ENV
      ? `./env/sauce-demo/.env.${process.env.TEST_ENV}`
      : "./env/sauce-demo/.env.qa",
  });
}

module.exports = globalSetup;
