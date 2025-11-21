import { useEffect } from "react";

export function useSync(data: Record<string, unknown>) {
  useEffect(() => {
    const timer = setTimeout(async () => {
      const r = await fetch("/api", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!r.ok) {
        alert("Erreur lors de la synchronisation");
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [data]);
}
