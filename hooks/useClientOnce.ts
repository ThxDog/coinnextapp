import React from "react";

export function useClientOnce(fn: () => void): void {
  const canCall = React.useRef(true);
  if (typeof window !== "undefined" && canCall.current) {
    canCall.current = false;
    fn();
  }
}
