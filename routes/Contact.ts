import express from 'express';
import { insertContacts } from '../resolvers/Contact';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'tmp/csv/' });

router.post('/contacts', upload.single('file'), insertContacts);

export default router;