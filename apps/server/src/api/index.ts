import type { Request, Response } from 'express';
// @ts-ignore: no type declarations for 'serverless-http' are installed
import serverless from 'serverless-http';
import app from '../index'; 

const handler = serverless(app);
export default async (req: Request, res: Response) => handler(req as any, res as any);
