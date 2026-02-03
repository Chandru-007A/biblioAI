const words = [
  "AI-Powered Recommendations",
  "Smart Book Discovery",
  "Personalized Reading",
  "Knowledge Meets Intelligence"
];

export default function TextRotate() {
  return (
    <div className="text-rotate mt-4 text-lg text-gray-300">
      <div className="text-rotate-lines">
        {words.map((word, index) => (
          <span key={index} className="text-rotate-element">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
