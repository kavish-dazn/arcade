import type { CarTheme } from '@pages/road-fighter/types';

export const PLAYER_CAR: CarTheme = {
    bodyColor: '#d92929',
    roofColor: '#9a1515',
    windowColor: '#7ed4ed',
    headLightColor: '#fff8b3',
};

const BLUE_CAR: CarTheme = {
    bodyColor: '#2b7fff',
    roofColor: '#1758c8',
    windowColor: '#a6ecff',
    headLightColor: '#fff7aa',
};

const GREEN_CAR: CarTheme = {
    bodyColor: '#2fb34a',
    roofColor: '#1d7f33',
    windowColor: '#a6ecff',
    headLightColor: '#fff7aa',
};

const YELLOW_CAR: CarTheme = {
    bodyColor: '#f4c430',
    roofColor: '#c99700',
    windowColor: '#a6ecff',
    headLightColor: '#fff7aa',
};

export const ENEMY_CAR_THEMES: CarTheme[] = [BLUE_CAR, GREEN_CAR, YELLOW_CAR];
