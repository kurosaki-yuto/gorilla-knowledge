import React from "react";
import { SessionRenderer } from "./components/SessionRenderer";
import { session3Slides } from "./data/session3Data";

export const Session3: React.FC = () => {
  return <SessionRenderer slides={session3Slides} sessionId="Session 3" />;
};
