import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONTS, LAYOUT } from "../design";

interface SlideBaseProps {
  backgroundColor?: string;
  showAccentBar?: boolean;
  slideNumber?: number;
  sessionId?: string;
  children: React.ReactNode;
}

export const SlideBase: React.FC<SlideBaseProps> = ({
  backgroundColor = COLORS.white,
  showAccentBar = true,
  slideNumber,
  sessionId,
  children,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: FONTS.main,
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      {showAccentBar && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: LAYOUT.accentBarHeight,
            backgroundColor: COLORS.accent,
          }}
        />
      )}

      {/* Content area */}
      <div
        style={{
          position: "absolute",
          top: showAccentBar ? LAYOUT.accentBarHeight + 20 : 20,
          left: LAYOUT.padding,
          right: LAYOUT.padding,
          bottom: LAYOUT.footerHeight + 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>

      {/* Footer */}
      {(slideNumber !== undefined || sessionId) && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: LAYOUT.footerHeight,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: LAYOUT.padding,
            paddingRight: LAYOUT.padding,
            backgroundColor:
              backgroundColor === COLORS.navy
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
          }}
        >
          <span
            style={{
              fontSize: LAYOUT.smallFontSize,
              color:
                backgroundColor === COLORS.navy
                  ? "rgba(255,255,255,0.7)"
                  : COLORS.textSub,
            }}
          >
            {sessionId ?? ""}
          </span>
          <span
            style={{
              fontSize: LAYOUT.smallFontSize,
              color:
                backgroundColor === COLORS.navy
                  ? "rgba(255,255,255,0.7)"
                  : COLORS.textSub,
            }}
          >
            {slideNumber !== undefined ? `${slideNumber}` : ""}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
