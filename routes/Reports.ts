import express from 'express';
import multer from 'multer';
import {
  getListingsReportBySellerType,
  getDistributionByMake,
  top30AveragePrice,
  top5ContactedListingsInMonth
} from '../resolvers/Listing';

const router = express.Router();
const upload = multer({ dest: 'tmp/csv/' });

router.post('/listings/reports/average-by-seller', upload.single('file'), getListingsReportBySellerType);

router.post('/listings/reports/distribution-by-make', upload.single('file'), getDistributionByMake);

router.get('/listings/reports/top-30-average-price', top30AveragePrice);

router.get('/listings/reports/top-5-contacted-listings', top5ContactedListingsInMonth);

export default router;