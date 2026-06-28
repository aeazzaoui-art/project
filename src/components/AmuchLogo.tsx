import React from "react";

interface AmuchLogoProps {
  className?: string;
  variant?: "orange" | "white" | "custom";
  color?: string;
}

export function AmuchLogo({ className = "w-8 h-8", variant = "orange", color }: AmuchLogoProps) {
  // Determine color based on variant
  const fillColor = color || (variant === "orange" ? "#FF6B00" : variant === "white" ? "#FFFFFF" : "currentColor");

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      id="amuch-official-logo"
    >
      {/* 
        Official AMUCH Logo Vector Reconstruction
        - Left diagonal leg & pointed apex of the 'A'
      */}
      <path
        d="M 51,16 L 15,75 L 26,75 L 35,60 C 37,56 40,54 44,54 L 51,28 L 60,32 L 51,16 Z"
        fill={fillColor}
      />

      {/* Swoop starting from inner left leg and forming the main paw pad */}
      <path
        d="M 23,65 C 32,64 45,61 54,54 C 57,51.5 59,48 59,45 C 59,41 63,41 65,43 C 69,47 67,54 62,59 C 55,65 42,67 32,68 C 28,68.5 24,67 23,65 Z"
        fill={fillColor}
      />

      {/* Main Paw Center Pad */}
      <path
        d="M 55,53 C 51,57 53,63 59,64 C 65,65 71,61 71,55 C 71,49 61,45 55,53 Z"
        fill={fillColor}
      />

      {/* 4 Floating Toe Pads (Ovals) */}
      {/* Toe 1: Leftmost */}
      <ellipse
        cx="53"
        cy="42"
        rx="4.5"
        ry="7"
        transform="rotate(-30 53 42)"
        fill={fillColor}
      />
      {/* Toe 2: Middle-Left */}
      <ellipse
        cx="62"
        cy="36"
        rx="4.5"
        ry="7.5"
        transform="rotate(-10 62 36)"
        fill={fillColor}
      />
      {/* Toe 3: Middle-Right */}
      <ellipse
        cx="72"
        cy="40"
        rx="4.5"
        ry="7.5"
        transform="rotate(15 72 40)"
        fill={fillColor}
      />
      {/* Toe 4: Rightmost */}
      <ellipse
        cx="77"
        cy="49"
        rx="4"
        ry="6.5"
        transform="rotate(35 77 49)"
        fill={fillColor}
      />

      {/* Bottom right curved leg segment of the 'A' */}
      <path
        d="M 59,66 C 65,72 73,75 80,75 L 70,75 C 64,75 60,72 59,66 Z"
        fill={fillColor}
      />
    </svg>
  );
}
export default AmuchLogo;
