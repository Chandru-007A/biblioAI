import { useRef, useEffect, useState } from "react";
import "./GooeyNav.css";

const items = [
  { label: "Home", href: "#" },
  { label: "Login", href: "#" },
  { label: "Signup", href: "#" }
];

export default function GooeyNav() {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const li = navRef.current.children[activeIndex];
    const rect = li.getBoundingClientRect();
    const parent = containerRef.current.getBoundingClientRect();

    Object.assign(filterRef.current.style, {
      left: `${rect.left - parent.left}px`,
      top: `${rect.top - parent.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    });

    textRef.current.innerText = li.innerText;
  }, [activeIndex]);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav>
        <ul ref={navRef}>
          {items.map((item, i) => (
            <li key={i} onClick={() => setActiveIndex(i)}>
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} />
      <span className="effect text" ref={textRef} />
    </div>
  );
}
