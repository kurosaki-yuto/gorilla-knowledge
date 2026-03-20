import { interpolate, spring } from "remotion";

export const fadeIn = (frame: number, delay: number = 0): number => {
  return interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const slideInFromLeft = (frame: number, delay: number = 0): number => {
  return interpolate(frame - delay, [0, 20], [-100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const slideInFromBottom = (frame: number, delay: number = 0): number => {
  return interpolate(frame - delay, [0, 20], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const scaleIn = (frame: number, delay: number = 0): number => {
  return interpolate(frame - delay, [0, 15], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const springIn = (
  frame: number,
  fps: number,
  delay: number = 0
): number => {
  return spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 12,
      stiffness: 200,
      mass: 0.5,
    },
  });
};
