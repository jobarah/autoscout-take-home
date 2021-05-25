import { Request, Response } from 'express';
import { Op, fn, col } from 'sequelize';
import { formatAmount } from '../lib/helpers';
import Listing, { SellerType } from '../models/Listing'
import { parseListings } from '../lib/CSVParser';

/* this resolver's logic is done in this way and not delegated to the orm because it was test endpoint that received the CSV and it parsed it,
so the logic of the calculation was originally done on the csv's data not over the database, it was not changed due to the fact that the challenge specified 
to not use more than 5hrs and my time had ran out */
export async function getListingsReportBySellerType(req: Request, res: Response) {
  const listingInstances = await Listing.findAll();

  const defaultReportValues: Record<string, Record<string, number>> = {
    private: {
      totalSalesCount: 0,
      totalSalesAmount: 0
    },
    dealer: {
      totalSalesCount: 0,
      totalSalesAmount: 0
    },
    other: {
      totalSalesCount: 0,
      totalSalesAmount: 0
    }
  };
  
  try {
    const data = listingInstances.reduce((acc, currentListing) => {
      const sellerType = acc[currentListing.sellerType];

      return {
        ...acc,
        [currentListing.sellerType]: {
          totalSalesCount: sellerType.totalSalesCount + 1,
          totalSalesAmount: sellerType.totalSalesAmount + currentListing.sellingPrice,
        }
      }

    }, defaultReportValues);
  
    const otherSellerTypeAverage = data.other.totalSalesAmount / data.other.totalSalesCount;
    const privateSellerTypeAverage = data.private.totalSalesAmount / data.private.totalSalesCount;
    const dealerSellerTypeAverage = data.dealer.totalSalesAmount / data.dealer.totalSalesCount;

    res.json({
      private: formatAmount(privateSellerTypeAverage),
      dealer: formatAmount(dealerSellerTypeAverage),
      other: formatAmount(otherSellerTypeAverage)
    });
  } catch (error) {
    res.json(error);
  }
}
/* this resolver's logic is done in this way and not delegated to the orm because it was test endpoint that received the CSV and it parsed it,
so the logic of the calculation was originally done on the csv's data not over the database, it was not changed due to the fact that the challenge specified 
to not use more than 5hrs and my time had ran out */
export async function getDistributionByMake(req: Request, res: Response) {
  try {
    const listings = await Listing.findAll();

    const countOfCarsByMake = listings.reduce((acc: Record<string, number>, currentListing): Record<string, number> => {
      const make = acc[currentListing.make];
  
      return {
        ...acc,
        [currentListing.make]: make ? make + 1 : 1
      }
    }, {});
  
    const distributionPercentagesArray: Array<Record<string, string | number>> = Object.keys(countOfCarsByMake).map((make: string) => {
  
      return {
        make,
        percentage: +((countOfCarsByMake[make] / listings.length) * 100).toFixed()
      }
    })
  
    distributionPercentagesArray.sort((a: Record<string, string | number>, b: Record<string, string | number>) => {
  
      return (+b['percentage']) - (+a['percentage']);
    });
  
    res.json(distributionPercentagesArray)
  } catch (error) {
    res.json(error);
  }
}

export async function top30AveragePrice(req: Request, res: Response) {
  try {
    const top30Results = await Listing.findAll({
      group: ['make'],
      attributes: [
        'make',
        [fn('AVG', col('sellingPrice')), 'averageSellingPrice']
      ],
      limit: 30,
      order: [[fn('COUNT', 'make'), 'DESC']],
    });

    res.json(top30Results);
  } catch (error) {
    res.json(error);
  }
}

export async function top5ContactedListingsInMonth(req: Request, res: Response) {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  try {
    const listingContactCount = await Listing.findAll({
      order: [['totalAmountOfContacts', 'DESC']],
      limit: 5
    })

    res.json(listingContactCount);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}

export async function insertListings(req: Request, res: Response) {
  try {
    const listings = await parseListings(req.file.path);
  
    const response = await Promise.all(listings.map(async (listing) => {
      const listingInstance = await Listing.create({
        id: listing.id,
        make: listing.make,
        sellingPrice: listing.price,
        mileage: listing.mileage,
        totalAmountOfContacts: 0,
        sellerType: listing.sellerType as SellerType
      });

      return listingInstance;
    }));
  
    res.json(response);
  } catch(error) {
    res.json(error);
  }
}
