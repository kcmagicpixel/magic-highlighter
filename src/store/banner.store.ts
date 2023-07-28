import { makeAutoObservable, reaction } from "mobx";

export interface BannerMessage {
  type: "warning" | "danger" | "success" | "info";
  message: string;
}

export class BannerStore {
  public current?: BannerMessage;
  private timeout?: number;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => this.current,
      (curr) => {
        this.clearTimeout();
        if (curr && curr.type === "success") {
          this.timeout = window.setTimeout(() => {
            this.clearBanner();
          }, 5000);
        }
      },
    );
  }

  public setBanner = (banner: BannerMessage) => {
    this.current = banner;
    const logLevel =
      banner.type === "success"
        ? console.debug
        : banner.type === "warning"
        ? console.warn
        : banner.type === "info"
        ? console.info
        : console.error;
    logLevel(banner.message);
  };

  public clearBanner = () => {
    this.clearTimeout();
    this.current = undefined;
  };

  public clearTimeout = () => {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
      this.timeout = undefined;
    }
  };
}
