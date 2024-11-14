import { contriesRoutes } from '@/core/contries/routes/countries.routes';
import { Router } from 'express';

export const routes = Router();

routes.use('/countries', contriesRoutes);
