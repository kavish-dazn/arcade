import { useNavigate } from 'react-router-dom';

import { Focusable, FocusScope, VerticalList } from '@focus';
import { HOME_LINKS } from './constants';
import './styles.scss';

export default function Home() {
  const navigate = useNavigate();

  return (
    <FocusScope id="home">
      <div className="home">
        <h1>Welcome to Arcade</h1>
        <VerticalList>
          {HOME_LINKS.map((link, index) => (
            <Focusable
              className="home-link"
              id={link.path}
              initialFocus={index === 0}
              key={link.path}
              onSelect={() => navigate(link.path)}
            >
              {link.label}
            </Focusable>
          ))}
        </VerticalList>
      </div>
    </FocusScope>
  );
}
