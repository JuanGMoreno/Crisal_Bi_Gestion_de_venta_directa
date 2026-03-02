import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('Just-database', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres'
});