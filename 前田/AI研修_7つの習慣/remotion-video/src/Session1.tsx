import React from "react";
import { SessionRenderer } from "./components/SessionRenderer";
import { session1Slides } from "./data/session1Data";

export const Session1: React.FC = () => {
  return <SessionRenderer slides={session1Slides} sessionId="Session 1" />;
};
