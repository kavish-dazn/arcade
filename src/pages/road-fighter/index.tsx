import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Focusable, FocusScope, VerticalList } from '@focus';

import { RoadFighterGame } from './game/RoadFighterGame';
import './styles.scss';

export default function RoadFighter() {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <FocusScope id="road-fighter">
            <div className="center road-fighter">
                {isPlaying ? (
                    <RoadFighterGame onExitToStart={() => setIsPlaying(false)} />
                ) : (
                    <>
                        <h1>Road Fighter</h1>
                        <VerticalList className="road-fighter--link">
                            <Focusable
                                className="link road-fighter__button"
                                id="start"
                                initialFocus
                                onSelect={() => setIsPlaying(true)}
                            >
                                Start Game
                            </Focusable>
                            <Focusable
                                className="link road-fighter__button"
                                id="back"
                                onSelect={() => navigate('/')}
                            >
                                Back to Home
                            </Focusable>
                        </VerticalList>
                    </>
                )}
            </div>
        </FocusScope>
    );
}
