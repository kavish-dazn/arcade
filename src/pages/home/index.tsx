import { Link } from 'react-router-dom';

import { HOME_LINKS } from './constanst';
import './styles.scss';

export default function Home() {
  return (
    <div className="home">
      <h1>Welcome to Arcade</h1>
      <div>
        {HOME_LINKS.map((link) => (
          <div key={link.path}>
            <Link to={link.path}>{link.label}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}