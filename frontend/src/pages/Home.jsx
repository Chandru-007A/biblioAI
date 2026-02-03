import GalaxyBackground from "../components/background/GalaxyBackground";
import GooeyNav from "../components/navbar/GooeyNav";
import TextRotate from "../components/ui/TextRotate";
import CountUp from "../components/ui/CountUp";

export default function Home() {
  return (
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center">
      <GalaxyBackground />

      <GooeyNav />

      <h1 className="text-5xl font-bold mt-20 text-emerald-400">
        biblio.ai
      </h1>

      <TextRotate />

      <div className="flex gap-12 mt-10 text-center">
        <div>
          <CountUp to={5000} className="text-3xl font-bold" />
          <p className="text-gray-400">Books</p>
        </div>
        <div>
          <CountUp to={1200} className="text-3xl font-bold" />
          <p className="text-gray-400">Users</p>
        </div>
        <div>
          <CountUp to={98} className="text-3xl font-bold" />
          <p className="text-gray-400">% Accuracy</p>
        </div>
      </div>
    </div>
  );
}
