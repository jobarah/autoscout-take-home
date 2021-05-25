import express from 'express';
import multer from 'multer';
import {
  getListingsReportBySellerType,
  getDistributionByMake,
  insertListings,
  top30AveragePrice,
  top5ContactedListingsInMonth
} from '../resolvers/Listing';

const router = express.Router();
const upload = multer({ dest: 'tmp/csv/' });

router.post('/listings', upload.single('file'), insertListings);

router.get('/listings/reports/average-by-seller', getListingsReportBySellerType);

router.get('/listings/reports/distribution-by-make', getDistributionByMake);

router.get('/listings/reports/top-30-average-price', top30AveragePrice);

router.get('/listings/reports/top-5-contacted-listings', top5ContactedListingsInMonth);

export default router;