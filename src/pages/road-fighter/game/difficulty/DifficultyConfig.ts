import type { DifficultyLevel } from '@pages/road-fighter/types';

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
    {
        minTime: 0,
        speedMultiplier: 1,
        spawnInterval: 1.5,
        minCars: 1,
        maxCars: 1,
    },
    {
        minTime: 15,
        speedMultiplier: 1,
        spawnInterval: 1.3,
        minCars: 1,
        maxCars: 2,
    },
    {
        minTime: 25,
        speedMultiplier: 1.5,
        spawnInterval: 1.2,
        minCars: 1,
        maxCars: 2,
    },
    {
        minTime: 35,
        speedMultiplier: 1.5,
        spawnInterval: 1,
        minCars: 1,
        maxCars: 2,
    },
    {
        minTime: 45,
        speedMultiplier: 2,
        spawnInterval: 1.5,
        minCars: 1,
        maxCars: 2,
    },
    {
        minTime: 55,
        speedMultiplier: 2,
        spawnInterval: 1,
        minCars: 1,
        maxCars: 2,
    },
];
