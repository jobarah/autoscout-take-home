import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';

interface MakeRow {
  id: string;
  make: string;
  price: string;
  mileage: string;
  seller_type: string;
}
export interface ListingDetails {
  id: string;
  make: string;
  price: number;
  mileage: number;
  sellerType: string;
}

interface ContactRow {
  listing_id: string;
  contact_date: string;
}
export interface ContactDetails {
  listingId: string;
  contactDate: Date;
}

export async function parseListings(filePath: string): Promise<Array<ListingDetails>> {

  const data = new Promise<Array<ListingDetails>>((resolve) => {
    const fileRows: Array<ListingDetails> = [];
  
    fs.createReadStream(path.resolve(filePath))
      .pipe(csv.parse({ headers: true }))
      .on('error', error => console.error(error))
      .on('data', (row: MakeRow) => { 
        fileRows.push({
          id: row.id,
          price: +row.price,
          make: row.make,
          mileage: +row.mileage,
          sellerType: row.seller_type
        });
      })
      .on('end', () => {
        resolve(fileRows);
      });
  });

  return data;
}


export async function parseContacts(filePath: string): Promise<Array<ContactDetails>> {

  const data = new Promise<Array<ContactDetails>>((resolve) => {
    const fileRows: Array<ContactDetails> = [];
  
    fs.createReadStream(path.resolve(filePath))
      .pipe(csv.parse({ headers: true }))
      .on('error', error => console.error(error))
      .on('data', (row: ContactRow) => {
        fileRows.push({
          listingId: row.listing_id,
          contactDate: new Date(+row.contact_date)
        });
      })
      .on('end', () => {
        resolve(fileRows);
      });
  });

  return data;
}
