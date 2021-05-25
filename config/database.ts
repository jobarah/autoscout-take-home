import path from 'path';
import { Sequelize } from 'sequelize';
// import { Listing as ListingModel } from '../models/Listing';
// import { Contact as ContactModel } from '../models/Contact';

const pathToModels = path.normalize(__dirname + '/../models');
console.log('pathToModels', pathToModels);

export const Database = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

Database.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

Database.sync({ force: true });
