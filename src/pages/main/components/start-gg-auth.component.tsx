import { observer } from "mobx-react-lite";
import type React from "react";
import { useCallback, useState } from "react";
import { useStore } from "../../../store";

const StartGGLogin: React.FC = observer(() => {
  const { auth } = useStore();
  const [isLoading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const handleSetToken = useCallback(async () => {
    try {
      setLoading(true);
      auth.setApiToken(input);
      await auth.loadProfile();
      setInput("");
    } finally {
      setLoading(false);
    }
  }, [auth, input]);

  return (
    <div className="align-center">
      <input
        disabled={isLoading}
        placeholder="Enter API Token"
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
      />
      <button disabled={isLoading} onClick={handleSetToken} className="ml-1">
        Sign In
      </button>
    </div>
  );
});

const StartGGProfile: React.FC = observer(() => {
  const { auth } = useStore();
  const { profile } = auth.startGG;
  const [isLoading, setLoading] = useState(false);
  if (!profile) throw new Error("invariant violation");

  return (
    <span className="align-center">
      {profile.username}
      <button
        disabled={isLoading}
        onClick={async () => {
          try {
            setLoading(true);
            await auth.loadProfile();
          } finally {
            setLoading(false);
          }
        }}
        className="ml-1"
        aria-label="Refresh start.gg profile"
      >
        🔄
      </button>
      <button
        disabled={isLoading}
        onClick={() => auth.setApiToken(undefined)}
        aria-label="Clear start.gg login"
        className="ml-1"
      >
        ❌
      </button>
    </span>
  );
});

export const StartGGAuth: React.FC = observer(() => {
  const { auth } = useStore();
  const isAuthenticated = !!auth.startGG.profile;

  return !isAuthenticated ? <StartGGLogin /> : <StartGGProfile />;
});
