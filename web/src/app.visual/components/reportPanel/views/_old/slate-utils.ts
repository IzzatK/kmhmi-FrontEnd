import React from "react";

export const isMod = (event: React.KeyboardEvent<HTMLDivElement>) => (event.metaKey && !event.ctrlKey) || event.ctrlKey