import { playerDatabase, roundDataDatabase } from "../handlers/database.ts";
import type { RoundScore } from "../types/round-score.ts";
import type { RouteDefinition } from "../types/route-definition";
import type { Scoreboard } from "../types/scoreboard";

export const getAllRounds: RouteDefinition = async (req, res) => {
    const rounds = await roundDataDatabase.get()

    if (!rounds) {
        res.status(404).json({ 
            message: "No round data available. Make sure to provision the database first.",
            provisionUrl: "http://localhost:3000/api/provision"
        })
        return
    }

    const result = rounds.map(r => {
        // Use spread-syntax to not return events,
        // these are available when fetching individual rounds.
        const { events, ...rest } = r

        return {
            ...rest
        }
    })

    res.status(200).json(result)
}

export const getRoundScoreboard: RouteDefinition = async (req, res) => {
    const players = await playerDatabase.get(false)

    if (!players) {
        res.status(404).json({ 
            message: "No player data available. Make sure to provision the database first.",
            provisionUrl: "http://localhost:3000/api/provision"
        })
        return
    } 

    // Hold all players without their key (as the name is in the object as well).
    const playersArr = Object.values(players)
    // Select all rounds pertinent to the query.
    const scoreboards = Array.from(
        { length: Number(req.params.roundNumber) }, 
        (_, i) => {
            const roundIndex = i + 1
            
            return playersArr.reduce((acc, player) => {
                const roundEvents = player.roundEvents[roundIndex]!

                if (!roundEvents)
                    return acc

                if (!acc[roundIndex])
                    acc[roundIndex] = []

                const score: RoundScore = {
                    kills: roundEvents.filter(e => e.playerEvent === "player_kill").length,
                    deaths: roundEvents.filter(e => e.playerEvent === "player_death").length
                }
                
                acc[roundIndex].push({ name: player.name, ...score })

                return acc
            }, {} as Scoreboard)
        }
    )

    // Create two scoreboards - One is pertitenent to in-round, another is match-wide scoreboard.
    const roundScoreboard = scoreboards[scoreboards.length - 1]
    const matchScoreboard = scoreboards.reduce((acc, score) => {
        const roundScores = Object.values(score).flat()

        roundScores.forEach(rs => {
            if (!acc[rs.name])
                acc[rs.name] = { name: rs.name, kills: 0, deaths: 0 }

            const current = acc[rs.name]

            current!.kills += rs.kills
            current!.deaths += rs.deaths 
        })

        return acc
    }, { } as Record<string, { name: string } & RoundScore>)

    res.status(200).json({ 
        round: Object.values(roundScoreboard!).flat(), 
        match: Object.values(matchScoreboard) 
    })
}