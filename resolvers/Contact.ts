import { Request, Response } from 'express';
import { parseContacts } from '../lib/CSVParser';
import Contact from '../models/Contact';
import Listing from '../models/Listing';

export async function insertContacts(req: Request, res: Response) {
  try {
    const contacts = await parseContacts(req.file.path);

    const response = await Promise.all(contacts.map(async (contact) => {
      const contactInstance = await Contact.create({
        listingId: contact.listingId,
        contactDate: contact.contactDate
      });

      return contactInstance;
    }));

    const listingCount = contacts.reduce((acc: Record<string, number>, contact) => {
      const listingIdCount = acc[contact.listingId];

      return {
        ...acc,
        [contact.listingId]: listingIdCount ? listingIdCount + 1 : 1
      }
    }, {});

    Object.keys(listingCount).forEach(async (listingId) => {
      const listingInstace = await Listing.findByPk(listingId);

      if (listingInstace) {
        listingInstace.totalAmountOfContacts = listingCount[listingId];
      }

      listingInstace?.save();
    });
  
    res.json(response);
  } catch(error) {
    res.json(error);
  }
}
