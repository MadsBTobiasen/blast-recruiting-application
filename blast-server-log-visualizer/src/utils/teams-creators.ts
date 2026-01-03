import teamVitality from '@/mock/team-1-players.json'
import navi from '@/mock/team-2-players.json'
import type { Score } from '@/types/score'

type TeamScores = { 
    team1: { name: string, round: Array<Score>, match: Array<Score> },
    team2: { name: string, round: Array<Score>, match: Array<Score> }
}

const createInitialScore = (name: string): Score => {
    return {
        name,
        kills: 0,
        deaths: 0
    }
}

const createInitialTeamScore = (teamName: string, players: Array<string>) => {
    return players.reduce((acc, player) => {
        acc.round.push(createInitialScore(player))
        acc.match.push(createInitialScore(player))

        return acc
    }, { name: teamName, round: [], match: [] } as TeamScores['team1'])
}

const updateRoundScore = (
    initialScores: { round: Array<Score>, match: Array<Score> }, 
    updatedScores: { round: Array<Score>, match: Array<Score> }
) => {
    initialScores.round = initialScores.round.map(initial => {
        const change = updatedScores.round.find(s => initial.name === s.name);
        return change ? { ...initial, ...change } : initial;
    });

    initialScores.match = initialScores.match.map(initial => {
        const change = updatedScores.match.find(s => initial.name === s.name);
        return change ? { ...initial, ...change } : initial;
    });
}

/**
 * Helper function to create team scores.
 * @remarks as the backend does not support teams, we use some mock data to provide a link between teams and their players.
 * @returns
 */
export const createTeamScores = (data: Partial<{ round: Array<Score>, match: Array<Score> }>) => {
    const teamScores: TeamScores = {
        team1: createInitialTeamScore("Team Vitality", teamVitality),
        team2: createInitialTeamScore("Na'Vi", navi)
    }

    updateRoundScore(teamScores.team1, data as typeof teamScores.team1)
    updateRoundScore(teamScores.team2, data as typeof teamScores.team2)

    return teamScores as TeamScores
}