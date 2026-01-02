import express from "express";
import { provisionDatabase } from "../controllers/provision-controller.ts";

const router = express.Router()

router.post("/provision", provisionDatabase)

export default router;