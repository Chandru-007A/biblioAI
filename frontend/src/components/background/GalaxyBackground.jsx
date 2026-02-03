export default function GalaxyBackground() {
  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black via-indigo-900 to-black">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, #6366f1, transparent 40%),
            radial-gradient(circle at 80% 70%, #22d3ee, transparent 40%)
          `,
        }}
      />
    </div>
  );
}
