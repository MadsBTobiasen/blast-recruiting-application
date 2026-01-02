import type { RouteDefinition } from "../types/route-definition";
import { matchDataDatabase } from "../handlers/database.ts";
import { parseServerLogData } from "../handlers/event-handler.ts";

export const provisionDatabase: RouteDefinition = async (req, res) => {
    var body = req.body as { url: string }

    if (!body || !body.url) {
        res.status(400).json({ message: "Missing 'url' in request body" });
        return
    }

    /*if (await matchDataDatabase.get()) 
    {
        res.status(200).json({ message: "Database already provisioned, no action taken." });
        return
    }*/

    const response = await fetch(body.url)
    const data = await response.text()

    await matchDataDatabase.save(data)
    await parseServerLogData()    

    // Implementation for provisioning the database
    res.status(200).json({ message: "Getting all users" });
}