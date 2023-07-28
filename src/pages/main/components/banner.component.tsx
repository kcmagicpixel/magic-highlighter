import { observer } from "mobx-react-lite";
import type React from "react";
import { useRef } from "react";
import { useStore } from "../../../store";
import "./banner.component.scss";
import classNames from "classnames";
import type { BannerMessage } from "../../../store/banner.store";

export const Banner: React.FC = observer(() => {
  const { banner } = useStore();
  const last = useRef<BannerMessage | undefined>(undefined);

  if (banner.current) last.current = banner.current;

  return (
    <div
      id="banner"
      className={classNames(!banner.current && "hidden", last.current?.type)}
      onMouseEnter={banner.clearTimeout}
      aria-live="assertive"
    >
      <span>{last.current?.message}</span>
      <button onClick={banner.clearBanner} aria-label="Clear message">
        X
      </button>
    </div>
  );
});
