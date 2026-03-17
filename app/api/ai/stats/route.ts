// Updated reduce callbacks in route.ts

const updatedStats = originalStats.reduce((sum: number, stat) => {
    return sum + stat.value;
}, 0);

const updatedStatsObject = { ...otherProperties, stats: updatedStats };