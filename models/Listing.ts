import Sequelize, { Model } from 'sequelize';
import { Database } from '../config/database';
import Contact from '../models/Contact';

const PRIVATE = 'private';
const DEALER = 'dealer';
const OTHER = 'other';

export type SellerType = 'private' | 'dealer' | 'other';

export interface ListingAttributes {
  id: string;
  make: string;
  sellingPrice: number;
  mileage: number;
  totalAmountOfContacts: number;
  sellerType: SellerType;
};

export interface ListingInstance extends Model<ListingAttributes>, ListingAttributes {};

const Listing = Database.define<ListingInstance>(
  'Listing', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    make: Sequelize.STRING,
    sellingPrice: Sequelize.NUMBER,
    mileage: Sequelize.NUMBER,
    totalAmountOfContacts: Sequelize.NUMBER,
    sellerType: {
      type: Sequelize.ENUM(
        PRIVATE,
        DEALER,
        OTHER
      )
    }
  }
);

Contact.belongsTo(Listing, { as: 'listing', foreignKey: 'listingId' });

export default Listing;