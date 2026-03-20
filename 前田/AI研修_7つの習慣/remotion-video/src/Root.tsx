import React from "react";
import { Composition } from "remotion";
import { Session1 } from "./Session1";
import { Session2 } from "./Session2";
import { Session3 } from "./Session3";
import { Session4 } from "./Session4";
import { LAYOUT, TIMING } from "./design";
import { calculateTotalFrames } from "./components/SessionRenderer";
import { session1Slides } from "./data/session1Data";
import { session2Slides } from "./data/session2Data";
import { session3Slides } from "./data/session3Data";
import { session4Slides } from "./data/session4Data";

export const Root: React.FC = () => {
  const fps = TIMING.fps;

  return (
    <>
      <Composition
        id="Session1"
        component={Session1}
        durationInFrames={calculateTotalFrames(session1Slides)}
        fps={fps}
        width={LAYOUT.width}
        height={LAYOUT.height}
      />
      <Composition
        id="Session2"
        component={Session2}
        durationInFrames={calculateTotalFrames(session2Slides)}
        fps={fps}
        width={LAYOUT.width}
        height={LAYOUT.height}
      />
      <Composition
        id="Session3"
        component={Session3}
        durationInFrames={calculateTotalFrames(session3Slides)}
        fps={fps}
        width={LAYOUT.width}
        height={LAYOUT.height}
      />
      <Composition
        id="Session4"
        component={Session4}
        durationInFrames={calculateTotalFrames(session4Slides)}
        fps={fps}
        width={LAYOUT.width}
        height={LAYOUT.height}
      />
    </>
  );
};
