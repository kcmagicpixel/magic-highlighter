import type React from "react";
import { useStore } from "../../../store";
import { useCallback, useState } from "react";

export const StartGGLoadBySlug: React.FC = () => {
  const { tournament } = useStore();
  const [slug, setSlug] = useState(tournament.selectedTournamentSlug ?? "");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      await tournament.loadTournamentBySlug(slug);
    } finally {
      setLoading(false);
    }
  }, [slug, tournament]);

  return (
    <div className="justify-between align-center mt-1">
      <h3 className="m-0">{tournament.current?.name}</h3>
      <div className="justify-end">
        <input
          placeholder="start.gg tournament slug"
          disabled={isLoading}
          value={slug}
          onChange={(e) => setSlug(e.currentTarget.value)}
        />
        <button disabled={isLoading} onClick={handleSubmit} className="ml-1">
          Submit
        </button>
      </div>
    </div>
  );
};
