import { observer } from "mobx-react-lite";
import type React from "react";
import { useStore } from "../../../store";
import { StartGGAuth } from "./start-gg-auth.component";
import { StartGGLoadBySlug } from "./start-gg-load-by-slug.component";
import { TournamentInfo } from "./tournament-info.component";

export const Tournaments: React.FC = observer(() => {
  const { auth, tournament } = useStore();
  const isAuthenticated = !!auth.startGG.profile;
  const currentTournament = tournament.current;

  return (
    <section>
      <header>
        <h2>Tournament</h2>
        <StartGGAuth />
      </header>
      {isAuthenticated && <StartGGLoadBySlug />}
      {currentTournament && <TournamentInfo tournament={currentTournament} />}
    </section>
  );
});
