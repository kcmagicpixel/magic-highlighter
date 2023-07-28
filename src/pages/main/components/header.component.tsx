import "./header.component.scss";

import type React from "react";

export const Header: React.FC = () => {
  return (
    <header>
      <h1>Magic Highlighter</h1>
      <button
        aria-label="Help"
        onClick={() =>
          window.open(
            "https://kcmagicpixel.com/stuff/magic-highlighter/",
            "_blank",
          )
        }
      >
        ❓
      </button>
    </header>
  );
};
