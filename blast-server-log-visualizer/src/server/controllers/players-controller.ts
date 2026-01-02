import { playerDatabase } from "../handlers/database.ts";
import type { RouteDefinition } from "../types/route-definition";

export const getAllPlayers: RouteDefinition = async (req, res) => {
    const players = await playerDatabase.get(false)

    if (!players) {
        res.status(404).json({ 
            message: "No player data available. Make sure to provision the database first.",
            provisionUrl: "http://localhost:3000/api/provision"
        })
        return
    }
    
    res.status(200).json(Object.keys(players))
}