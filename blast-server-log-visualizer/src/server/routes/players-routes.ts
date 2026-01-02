import express from "express"
import { getAllPlayers } from "../controllers/players-controller.ts"

const router = express.Router()

router.get("/players", getAllPlayers)

export default router