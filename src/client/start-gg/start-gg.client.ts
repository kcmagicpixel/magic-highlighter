import request from "graphql-request";
import {
  CurrentUserResponse,
  currentUserQuery,
} from "./query/current-user.query";
import {
  TournamentBySlugResponse,
  tournamentBySlugQuery,
} from "./query/tournament-by-slug.query";

class StartGGClient {
  private static readonly URL = "https://api.start.gg/gql/alpha";
  private apiToken?: string;

  private get headers(): Headers {
    const result = new Headers();
    if (this.apiToken) {
      result.append("Authorization", `Bearer ${this.apiToken}`);
    }
    return result;
  }

  public setApiToken(token: string) {
    this.apiToken = token;
  }

  public async loadCurrentUser() {
    const result = await request(
      StartGGClient.URL,
      currentUserQuery,
      undefined,
      this.headers,
    );
    return CurrentUserResponse.parse(result);
  }

  public async loadTournamentBySlug(slug: string) {
    const result = await request(
      StartGGClient.URL,
      tournamentBySlugQuery,
      { slug },
      this.headers,
    );
    return TournamentBySlugResponse.parse(result);
  }
}

export const startGGClient = new StartGGClient();
