import { gql } from "graphql-request";
import { z } from "zod";

export const tournamentBySlugQuery = gql`
  query TournamentBySlugQuery($slug: String) {
    tournament(slug: $slug) {
      id
      name
      startAt
      timezone
    }
  }
`;

export const TournamentBySlugResponse = z.object({
  tournament: z.object({
    id: z.number(),
    name: z.string(),
    startAt: z.number(),
    timezone: z.string().nullable(),
  }),
});
