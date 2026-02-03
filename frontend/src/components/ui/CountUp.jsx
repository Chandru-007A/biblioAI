import { useInView, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

export default function CountUp({ to, from = 0, duration = 1, className = "" }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, { damping: 20, stiffness: 100 });
  const isInView = useInView(ref, { once: true });

  const formatValue = useCallback(v => Math.round(v), []);

  useEffect(() => {
    if (isInView) motionValue.set(to);
  }, [isInView, to, motionValue]);

  useEffect(() => {
    return springValue.on("change", v => {
      if (ref.current) ref.current.textContent = formatValue(v);
    });
  }, [springValue, formatValue]);

  return <span ref={ref} className={className} />;
}
