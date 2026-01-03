<script setup lang="ts">
import TeamScoreboard from './TeamScoreboard.vue';

import type { Round } from '@/types/round';
import type { Score } from '@/types/score';
import { createTeamScores } from '@/utils/teams-creators';
import { computed, onMounted, ref } from 'vue';

onMounted(async () => {
    loading.value = true

    // Fetch Max Rounds
    const roundsResult = await fetch("http://localhost:3000/api/rounds")
    roundsData.value = await roundsResult.json()

    // Fetch Players
    const playersResult = await fetch("http://localhost:3000/api/players")
    playersData.value = await playersResult.json()

    // Fetch RoundScoreData
    const roundScoreResult = await fetch(`http://localhost:3000/api/round/${currentRoundNum.value ?? 1}/scoreboard`)
    roundScoreData.value = await roundScoreResult.json()

    loading.value = false
})


const roundsData = ref<Array<Round>>([])
const playersData = ref<Array<string>>([])
const roundScoreData = ref<Partial<{ round: Array<Score>, match: Array<Score> }>>({ round: [], match: [] })

const loading = ref(false)
const currentRoundNum = ref(1)

const maxRounds = computed(() => {
    return roundsData.value[roundsData.value.length - 1]?.roundNumber ?? 0
})

const roundObj = computed(() => {
    return roundsData.value.find(r => r.roundNumber === currentRoundNum.value)
})

const availableNavigation = computed(() => {
    const navigations: Array<number> = []

    if (inbounds(currentRoundNum.value - 1))
        navigations.push(currentRoundNum.value - 1)
    if (inbounds(currentRoundNum.value - 2))
        navigations.push(currentRoundNum.value - 2)

    if (inbounds(currentRoundNum.value))
        navigations.push(currentRoundNum.value)
    
    if (inbounds(currentRoundNum.value + 1))
        navigations.push(currentRoundNum.value + 1)
    if (inbounds(currentRoundNum.value + 2))
        navigations.push(currentRoundNum.value + 2)

    if (!navigations.includes(1))
        navigations.push(1)
    if (!navigations.includes(maxRounds.value))
        navigations.push(maxRounds.value)   

    return navigations.sort((a, b) => a - b)
})

const teamScores = computed(() => {
    return createTeamScores(roundScoreData.value)
})

const inbounds = (number: number) => {
    return number >= 1 && number <= maxRounds.value
}

const changePage = async (event: Event, page: number) => {
    const element = event.target as HTMLButtonElement

    if (element.disabled)
        return

    if (inbounds(page))
        currentRoundNum.value = page    

    loading.value = true

    // Fetch RoundScoreData
    const roundScoreResult = await fetch(`http://localhost:3000/api/round/${currentRoundNum.value ?? 1}/scoreboard`)
    roundScoreData.value = await roundScoreResult.json()

    loading.value = false
}

</script>

<template>
    <div class="main btv-bg-img">
        <div class="controls container">
            <div class="slider">
                <button 
                    class="navigator" 
                    :disabled="currentRoundNum === 1 || loading"
                    @click="(e) => changePage(e, currentRoundNum - 1)"
                >
                    ◁
                </button>
                <template v-for="roundNumber in availableNavigation">
                    <button
                        class="navigator"
                        :class="currentRoundNum === roundNumber ? 'underline' : ''"
                        :disabled="currentRoundNum === roundNumber || loading"
                        @click="(e) => changePage(e, roundNumber)"
                    >
                        {{ roundNumber }}
                    </button>
                </template>
                <button
                    class="navigator" 
                    :disabled="currentRoundNum === 26 || loading"
                    @click="(e) => changePage(e, currentRoundNum + 1)"
                >
                    ▷
                </button>
            </div>
            <div class="match-score">
                <div class="team-score">
                    <span>Counter-Terrorists</span>
                    <span>{{ roundObj?.roundScore?.ct }}</span>
                </div>
                <div class="team-score">
                    <span>Terrorists</span>
                    <span>{{ roundObj?.roundScore?.t }}</span>
                </div>
            </div>
            <div class="notice">
                Parentheses indicate in-round performance.
            </div>
        </div>
        <TeamScoreboard 
            :team-name="teamScores.team1.name"
            :round="teamScores.team1.round ?? []" 
            :match="teamScores.team1.match ?? []"
        ></TeamScoreboard>
        <TeamScoreboard 
            :team-name="teamScores.team2.name"
            :round="teamScores.team2.round ?? []" 
            :match="teamScores.team2.match ?? []"
        ></TeamScoreboard>
    </div>
</template>

<style scoped>
@reference "tailwindcss";

.main {
    @apply flex flex-col px-12 py-6 gap-y-8 items-center;
}

.controls {
    @apply w-full text-white flex flex-row;
}

.controls > div {
    @apply flex-1/3;
}

.controls > div.slider {
    @apply text-yellow-300 flex flex-row gap-x-4;
    font-family: "TT Norms pro";
}

.controls > div.slider > .navigator {
    @apply cursor-pointer;
}

.controls > div.slider > .navigator:disabled {
    @apply cursor-default;
}

.controls > div.match-score {
    @apply flex flex-col;
}

.controls > div.match-score > div.team-score {
    @apply flex flex-row;
    > span {
        @apply first:flex-auto last:flex-none;
        font-family: "TT Norms pro";
    }
}

.controls > div.notice {
    @apply flex justify-end items-end uppercase italic text-right text-sm;
    font-family: "Radion";
}
</style>