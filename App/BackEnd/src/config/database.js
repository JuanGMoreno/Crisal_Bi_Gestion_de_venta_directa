import { Sequelize } from 'sequelize';

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_DIALECT = process.env.DB_DIALECT || 'postgres';

if (!DB_NAME || !DB_USER || !DB_PASSWORD) {
  throw new Error('Faltan variables de entorno de base de datos: DB_NAME, DB_USER y/o DB_PASSWORD');
}

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  logging: false,
});