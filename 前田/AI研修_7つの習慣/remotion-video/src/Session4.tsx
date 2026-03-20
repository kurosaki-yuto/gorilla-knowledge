import React from "react";
import { SessionRenderer } from "./components/SessionRenderer";
import { session4Slides } from "./data/session4Data";

export const Session4: React.FC = () => {
  return <SessionRenderer slides={session4Slides} sessionId="Session 4" />;
};
