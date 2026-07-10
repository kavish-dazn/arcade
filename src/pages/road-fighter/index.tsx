import { useNavigate } from 'react-router-dom';

import { Focusable, FocusScope, VerticalList } from '@focus';
import './styles.scss';

export default function RoadFighter() {
  const navigate = useNavigate();

  return (
    <FocusScope id="road-fighter">
      <div className="center road-fighter">
        <h1>Road Fighter</h1>
        <VerticalList className="road-fighter--link">
          <Focusable
            className="link road-fighter__button"
            id="start"
            initialFocus
            onSelect={() => console.info('Road Fighter game start is not implemented yet.')}
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
      </div>
    </FocusScope>
  );
}
