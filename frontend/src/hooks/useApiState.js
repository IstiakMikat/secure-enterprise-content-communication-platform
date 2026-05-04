import { useEffect, useState } from "react";

export function useApiState(loader, dependencies = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        setIsLoading(true);
        setError("");
        const result = await loader();
        if (active) {
          setData(result);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError.response?.data?.message ||
              loadError.message ||
              "Unable to load data."
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      active = false;
    };
  }, dependencies);

  return { data, isLoading, error, setData };
}

