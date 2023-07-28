import { autorun, flow, makeAutoObservable } from "mobx";
import { z } from "zod";
import { startGGClient } from "../client";
import type { RootStore } from "./root.store";

const AuthSchema = z.object({
  startGG: z.object({
    apiToken: z.string().optional(),
    profile: z
      .object({
        id: z.number(),
        username: z.string(),
      })
      .optional(),
  }),
});

type AuthStoreState = z.infer<typeof AuthSchema>;

export class AuthStore implements AuthStoreState {
  private static readonly STORAGE_KEY = "auth-store";
  public startGG: AuthStoreState["startGG"];

  public get isStartGGAuthenticated() {
    return !!this.startGG.apiToken && !!this.startGG.profile;
  }

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
    try {
      const localData = localStorage.getItem(AuthStore.STORAGE_KEY);
      if (!localData) throw new Error("No local data");
      const data = AuthSchema.parse(JSON.parse(localData));
      this.startGG = data.startGG;
    } catch (e) {
      this.startGG = {};
    }

    // Persists everything in this store to localstorage
    autorun(() => {
      const serialized = JSON.stringify({ startGG: this.startGG });
      localStorage.setItem(AuthStore.STORAGE_KEY, serialized);
    });

    // Loads the user profile after the token is set.
    autorun(() => {
      if (this.startGG.apiToken) {
        startGGClient.setApiToken(this.startGG.apiToken);
      }
    });
  }

  public readonly setApiToken = (token?: string) => {
    this.startGG.apiToken = token;
    this.startGG.profile = undefined;
  };

  public readonly loadProfile = flow(function* (this: AuthStore) {
    try {
      const data: Awaited<
        ReturnType<(typeof startGGClient)["loadCurrentUser"]>
      > = yield startGGClient.loadCurrentUser();
      this.startGG.profile = {
        username: data.currentUser.player.gamerTag,
        id: data.currentUser.id,
      };
      console.log(this.startGG.profile);
      this.root.banner.setBanner({
        message: `Successfully authenticated as ${this.startGG.profile.username}`,
        type: "success",
      });
      return this.startGG.profile;
    } catch (e) {
      this.startGG = {};
      this.root.banner.setBanner({
        message: "Failed to auth with start.gg",
        type: "danger",
      });
      throw e;
    }
  });
}
