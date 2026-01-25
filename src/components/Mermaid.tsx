import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
  theme: "dark",
  securityLevel: "loose",
  fontFamily: "inherit",
});

interface MermaidProps {
  chart: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      ref.current.removeAttribute("data-processed");
      try {
        mermaid.contentLoaded();
      } catch (error) {
        console.error("Mermaid rendering error:", error);
      }
    }
  }, [chart]);

  return (
    <div className="mermaid-container my-4 flex justify-center bg-transparent">
      <div ref={ref} className="mermaid">
        {chart}
      </div>
    </div>
  );
};
