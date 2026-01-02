import { regex } from "../constants/regex.ts"
import type { MatchEvent } from "../types/match-events.ts"
import type { Round } from "../types/round.ts"
import { convertServerLogTimeStampToDate } from "../utils/timestamp-utils.ts"
import { matchDataDatabase, roundDataDatabase } from "./database.ts"
import { handlePlayerEvents } from "./player-event-handler.ts"



/**
 * Parser for server log data.
 * @param matchData 
 */
export const parseServerLogData = async () => {
    let lines = await matchDataDatabase.get()

    if (!lines)
        throw new Error("No match data found in database to parse.")

    // Find the last line of Match_Start, as data preceding this is not relevant.
    let matchStartIndex = -1
    // As FindLastIndex is not available with the current TS target, we do a reverse loop.
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i]!.includes("Match_Start")) {
            matchStartIndex = i
            break
        }
    }
    // Trim lines to only include data after the Match_Start.
    lines = lines?.slice(matchStartIndex)

    const rounds: Array<Round> = []

    for (const line of lines) {
        const eventDate = convertServerLogTimeStampToDate(line?.match(regex.eventTimestamp)![1]!)

        // If the rounds is empty, we create a new round on the first iteration.
        // Where the start is based on the initial "Match_Start"-event. 
        if (!rounds.length) {
            rounds.push({
                roundNumber: 1,
                startTime: eventDate,
                events: []
            })
        }

        const currentRound = rounds[rounds.length - 1]!
        const isPlayerEvent = line.match(regex.playerEvent)

        let event: MatchEvent = {
            timestamp: eventDate,
            type: isPlayerEvent ? 'player' : 'server',
            // Removing the timestamp part from the message,
            // there are better approaches to do this, but for now this will do.
            message: line.split(regex.eventTimestamp)[2]?.trim()!
        }

        // Append the event to the current round.
        currentRound.events.push(event)

        if (line.match(regex.scoreUpdate)) {
            const [_, ctScore, tScore] = line.match(regex.scoreUpdate) as Array<string>

            currentRound.roundScore = {
                ct: Number(ctScore!),
                t: Number(tScore!)
            }
        }

        // When an end of a round is detected, we set the endTime of the current round,
        // and create a new round with incremented roundNumber.
        if (line.match(regex.roundEnd)) {
            currentRound.endTime = eventDate
            
            rounds.push({
                roundNumber: currentRound.roundNumber + 1,
                startTime: eventDate,
                events: []
            })
        }
    }

    await roundDataDatabase.save(rounds)

    // For each round, send events to their respective handlers.
    for (let i = 0; i < rounds.length; i++) {
        const round = rounds[i];
        
        await handlePlayerEvents(round!)
    }
}