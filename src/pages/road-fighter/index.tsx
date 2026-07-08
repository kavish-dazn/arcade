import { Link } from "react-router-dom";

import './styles.scss';

export default function RoadFighter() {
  return (
    <div className="center road-fighter">
      <h1>Road Fighter</h1>
      <div className="road-fighter--link">
        <Link to="/">Start Game</Link>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}
