import { AuthStore } from "./auth.store";
import { BannerStore } from "./banner.store";
import { TournamentStore } from "./tournament.store";

class _RootStore {
  public readonly banner = new BannerStore();
  public readonly auth = new AuthStore(this);
  public readonly tournament = new TournamentStore(this);
}

export const rootStore = new _RootStore();
export type RootStore = InstanceType<typeof _RootStore>;
