import React from "react";
import { SessionRenderer } from "./components/SessionRenderer";
import { session2Slides } from "./data/session2Data";

export const Session2: React.FC = () => {
  return <SessionRenderer slides={session2Slides} sessionId="Session 2" />;
};
