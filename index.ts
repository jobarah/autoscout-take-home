import express, { Application } from "express";
import ContactRoutes from './routes/Contact';
import ListingRoutes from './routes/Listing';
import cors from 'cors';

const app: Application = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', ListingRoutes);
app.use('/api', ContactRoutes);

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error) {
  console.error(`Error occured: ${error.message}`);
}
