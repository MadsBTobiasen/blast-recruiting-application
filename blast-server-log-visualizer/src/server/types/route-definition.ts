import type { Request, Response } from "express";

export type RouteDefinition = (req: Request, res: Response) => Promise<void> | void;