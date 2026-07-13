export enum GameState {
    Start,
    Playing,
    GameOver,
}

export interface GameStats {
    score: number;
    elapsedTime: number;
}

export interface CarTheme {
    bodyColor: string;
    roofColor: string;
    windowColor: string;
    headLightColor: string;
}

export interface DifficultyLevel {
    minTime: number;
    speedMultiplier: number;
    spawnInterval: number;
    minCars: number;
    maxCars: number;
    obstacleSpawnInterval: number;
}
