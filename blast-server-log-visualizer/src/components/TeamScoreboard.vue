<script setup lang="ts">
import type { Score } from '@/types/score';
import { computed } from 'vue';

const props = defineProps<{
    teamName: string
    round: Array<Score>
    match: Array<Score>
}>()

const grouped = computed(() => {
    const store: Record<string, { round: Partial<Score>, match: Partial<Score> & Partial<{ kdratio: string }> }> = {}

    props.round.forEach(s => {
        if (!store[s.name])
            store[s.name] = { round: {}, match: {} }
        
        store[s.name]!.round = s
    })

    props.match.forEach(s => {
        if (!store[s.name])
            store[s.name] = { round: {}, match: {} }
        
        store[s.name]!.match = s
        let kdRatio = (s.kills / s.deaths)
        
        if (kdRatio === Infinity || Number.isNaN(kdRatio))
            kdRatio = -1

        // The padding obviously breaks, if a player has 10+ kd/ratio, but for the purpose of this, it's fine.
        // We fall back to the kills when the kd is infinity, to mimic the behaviour of the in-game scoreboard.
        store[s.name]!.match.kdratio = (kdRatio === -1 ? store[s.name]!.match.kills! : kdRatio)
            .toFixed(2).padEnd(4, "0")
    })

    return Object.values(store).sort((a, b) => b.match.kills! - a.match.kills!)
})

</script>

<template>
    <div class="container">
        <div class="team">
            {{ props.teamName }}
        </div>
        <div class="scoreboard">
            <div class="header">
                <div>Player</div>
                <div>Kills</div>
                <div>Deaths</div>
                <div>K/D</div>
            </div>
            <div class="row" v-for="value in grouped">
                <div class="normal-case">
                    {{ value.match.name }}
                </div>
                <div>
                    {{ value.match.kills }}
                    (<span :class="value.round.kills! > 0 ? 'positive' : ''">{{ value.round.kills! > 0 ? `+${value.round.kills}` : '=' }}</span>)
                </div>
                <div>
                    {{ value.match.deaths }}
                    (<span :class="value.round.deaths! > 0 ? 'negative' : ''">{{ value.round.deaths! > 0 ? `+${value.round.deaths}` : '=' }}</span>)
                </div>
                <div>
                    {{ value.match.kdratio }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "tailwindcss";

.container {
    @apply flex flex-col gap-y-2;
}

div.team {
    @apply text-white uppercase text-xl;
    font-family: "TT Norms pro";
}

.scoreboard {
    @apply w-full flex-none uppercase flex flex-col gap-y-2;
    font-family: "TT Norms pro";
}

.scoreboard > div {
    @apply bg-gray-500/[35%] text-white px-4 rounded grid;
    grid-template-columns: 3fr 1fr 1fr 1fr;
}

.scoreboard > div > div {
    @apply first:text-left text-center px-2;
}

.scoreboard > .header {
    @apply py-2;
}

.scoreboard > .row {
    @apply py-1;
}

.scoreboard > .row > div > span {
    @apply text-sm;
}

.scoreboard .positive {
    @apply text-green-300;
}

.scoreboard .negative {
    @apply text-red-300;
}
</style>