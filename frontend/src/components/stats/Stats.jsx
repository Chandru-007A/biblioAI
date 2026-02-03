import CountUp from "../animations/CountUp";

export default function Stats() {
  return (
    <div className="flex gap-10 mt-10 text-white">
      <div>
        <CountUp to={1200} duration={1.5} />
        <p>Books</p>
      </div>
      <div>
        <CountUp to={450} duration={1.5} />
        <p>Active Readers</p>
      </div>
      <div>
        <CountUp to={95} duration={1.5} />
        <p>% Engagement</p>
      </div>
    </div>
  );
}
