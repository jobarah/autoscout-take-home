import Sequelize, { Model } from 'sequelize';
import { Database } from '../config/database';

export interface ContactAttributes {
  listingId: string;
  contactDate: Date;
};

export interface ContactInstance extends Model<ContactAttributes>, ContactAttributes {};

const Contact = Database.define<ContactInstance>(
  'Contact',{
    listingId: Sequelize.STRING,
    contactDate: Sequelize.DATE
  }
);

export default Contact;