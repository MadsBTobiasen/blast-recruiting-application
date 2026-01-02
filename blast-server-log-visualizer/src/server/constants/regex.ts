/**
 * Expose a collection of regex for parsing log-data.
 */
export const regex = {
    roundEnd: /World triggered "Round_End"/,
    scoreUpdate: /MatchStatus: Score: (\d+):(\d+) on map "\w+" RoundsPlayed: \d+/,
    playerEvent: /"?((?:([^<]+))<(\d+)><(STEAM_\d+:\d+:\d+))>/,
    /**
     * Matches both the killer and the victim, grouping each player to be sent to the
     * playerEvent regex to correctly extract player information.
     */
    playerKillEvent: /"([^"]+)"\s+(\[[^\]]+\])\s+killed\s+"([^"]+)"\s+(\[[^\]]+\])/,
    eventTimestamp: /^(\d{1,2}\/\d{1,2}\/\d{4} - \d{2}:\d{2}:\d{2}):/,
}