import { regex } from "../constants/regex.ts";
import type { MatchEvent, PlayerMatchEvent } from "../types/match-events.ts";
import type { Player } from "../types/player.ts";
import type { Round } from "../types/round";
import { playerDatabase } from "./database.ts";
import type { PlayerEventType } from "../types/event-types.ts";

/**
 * Handler for player-related events within a round.
 * @param round 
 */
export const handlePlayerEvents = async (round: Round) => {
    // A prequisite is that the playerDatabase is already populated,
    // if it isn't populated, we search through the round events to find player info.
    // As all players should be present in at least one event.
    let playerData = await playerDatabase.get()

    if (!playerData) {
        playerData = identifyPlayers(round)
        await playerDatabase.save(playerData)
    }

    // This function could do with some optimizations, to reduce array accesses
    // Alas - this is the solution for now.

    const parsedEvents: Array<PlayerMatchEvent> = []

    round.events.forEach((event) => {
        var typedEvent = event as MatchEvent<'player'>
        var killEvents = playerKillEvent(typedEvent)

        if (killEvents && killEvents.length)
            parsedEvents.push(...killEvents)
    })

    parsedEvents.forEach(e => {
        if (!playerData)
            throw new Error("PlayerData was undefined.")
        if (!playerData![e.name])
            throw new Error(`Tried to update playerdata, but no player was found with: '${e.name}'.`)

        var roundEvents = playerData[e.name]?.roundEvents[round.roundNumber]

        if (!roundEvents)
            roundEvents = [e]
        else
            roundEvents.push(e)

        playerData[e.name]!.roundEvents[round.roundNumber] = roundEvents
    })

    await playerDatabase.save(playerData!)
}

/**
 * Function to identify players through searching the events,
 * the event to search for is the Pickup "knife", as this hopefully
 * should not pickup on spectators, admins, coaches and whatnot.
 * @param round
 */
const identifyPlayers = (round: Round): Record<string, Player> => {
    let players = round.events.filter(e => e.message.match(regex.playerEvent))

    return players.reduce((acc, curr) => {
        // Additional matches exists for ingame id, and steamid.
        const [_, fullIdentifier, playerName] = curr.message.match(regex.playerEvent)!

        if (!acc[playerName!]) {
            const player: Player = {
                fullIdentifier: fullIdentifier!,
                name: playerName!,
                roundEvents: {}
            }

            acc[player.name] = player
        }

        return acc
    }, {} as Record<string, Player>)
}

/**
 * Function to identify when a player has achieved a kill.
 * The function also returns an appropriate event for the player who got killed,
 * resulting in two produced events.
 * @param event 
 */
const playerKillEvent = (event: MatchEvent<'player'>): Array<PlayerMatchEvent> => {
    const matches = event.message.match(regex.playerKillEvent)
    const events: Array<PlayerMatchEvent> = []

    /**
     * Helper function to create the resulting PlayerMatchEvent
     * @param player 
     * @param location 
     * @param eventType 
     * @returns 
     */
    const createKillEvent = (
        player: string, 
        location: string, 
        sourceEvent: MatchEvent<'player'>,
        playerEvent: PlayerEventType
    ): PlayerMatchEvent => {
        // Extract name
        const [_, __, name] = player.match(regex.playerEvent)!
        // Remove brackets, and convert to a vector
        const [x, y, z] = location.replace("[", "").replace("]", "").split(" ")
        
        return {
            name: name!,
            location: { x: Number(x), y: Number(y), z: Number(z) },
            playerEvent,
            ...sourceEvent
        }
    }

    if (matches) {
        const [_, killer, killerLocation, victim, victimLocation] = matches

        events.push(createKillEvent(killer!, killerLocation!, event, 'player_kill'))
        events.push(createKillEvent(victim!, victimLocation!, event, 'player_death'))
    }

    return events
}