import { gql } from "graphql-request";
import { z } from "zod";

export const currentUserQuery = gql`
  query CurrentUser {
    currentUser {
      id
      player {
        gamerTag
      }
    }
  }
`;

export const CurrentUserResponse = z.object({
  currentUser: z.object({
    id: z.number(),
    player: z.object({
      gamerTag: z.string(),
    }),
  }),
});
