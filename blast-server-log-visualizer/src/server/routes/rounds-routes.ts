import express from "express"
import { getAllRounds, getRoundScoreboard } from "../controllers/rounds-controller.ts"

const router = express.Router()

router.get("/rounds", getAllRounds)
router.get("/round/:roundNumber/scoreboard", getRoundScoreboard)

export default router