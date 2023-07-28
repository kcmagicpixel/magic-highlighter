import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import type { Tournament } from "../../../store/tournament.store";

export const TournamentInfo: React.FC<{ tournament: Tournament }> = observer(
  ({ tournament }) => {
    const data = useMemo(() => {
      if (!tournament) return [];
      return [
        { label: "Slug", value: tournament.slug },
        { label: "Start Date", value: tournament.startDate },
      ];
    }, [tournament]);

    return (
      <table className="mt-1">
        <tbody>
          {data.map((i) => {
            return (
              <tr key={i.label}>
                <td>{i.label}</td>
                <td>{i.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  },
);
