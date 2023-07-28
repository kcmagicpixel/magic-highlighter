import { autorun, flow, makeAutoObservable } from "mobx";
import type { RootStore } from "./root.store";
import { startGGClient } from "../client";
import { DateTime } from "luxon";

export interface Set {
  id: unknown;
}

class Tournament {
  public id: unknown;
  public name: string;
  public slug: string;
  public startDate: string;

  constructor(
    private readonly root: RootStore,
    data: { name: string; slug: string; id: unknown; startDate: string },
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.name = data.name;
    this.slug = data.slug;
    this.id = data.id;
    this.startDate = data.startDate;
  }

  public merge(other: Tournament) {
    if (this.id !== other.id) throw new Error("invariant violation");
    this.name = other.name;
    this.slug = other.slug;
    this.startDate = other.startDate;
  }
}

export class TournamentStore {
  private static readonly SELECTED_SLUG_KEY = "selected-tournament-slug";

  public current?: Tournament;
  public selectedTournamentSlug?: string;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.selectedTournamentSlug =
      localStorage.getItem(TournamentStore.SELECTED_SLUG_KEY) ?? undefined;

    autorun(() => {
      if (this.selectedTournamentSlug) {
        localStorage.setItem(
          TournamentStore.SELECTED_SLUG_KEY,
          this.selectedTournamentSlug,
        );
      } else {
        localStorage.removeItem(TournamentStore.SELECTED_SLUG_KEY);
      }
    });
  }

  public loadTournamentList = flow(function* (this: TournamentStore) {});

  public loadTournamentBySlug = flow(function* (
    this: TournamentStore,
    slug: string,
  ) {
    this.selectedTournamentSlug = slug;
    try {
      const result: Awaited<
        ReturnType<(typeof startGGClient)["loadTournamentBySlug"]>
      > = yield startGGClient.loadTournamentBySlug(slug);
      const startDate = DateTime.fromSeconds(result.tournament.startAt, {
        zone: result.tournament.timezone ?? undefined,
      }).toISO({ includeOffset: true });

      const tournament = new Tournament(this.root, {
        ...result.tournament,
        slug,
        startDate,
      });
      if (this.current && this.current.id === tournament.id) {
        this.current.merge(tournament);
      } else {
        this.current = tournament;
      }
    } catch (e) {
      this.root.banner.setBanner({
        type: "danger",
        message: `Failed to load tournament: ${slug}`,
      });
      throw e;
    }
  });
}

export { type Tournament };
