import { useState, useEffect } from "react";

interface UseFormLoadingProps {
  dependencies?: (() => Promise<unknown>)[];
  autoGenerateCode?: () => Promise<string>;
  skipLoading?: boolean;
}

export function useFormLoading({
  dependencies = [],
  autoGenerateCode,
  skipLoading = false,
}: UseFormLoadingProps) {
  const [isLoading, setIsLoading] = useState(!skipLoading);
  const [loadingProgress, setLoadingProgress] = useState("Initializing...");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<unknown[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");

  useEffect(() => {
    if (skipLoading) {
      setIsLoading(false);
      return;
    }

    const loadFormData = async () => {
      let attemptCount = 0;
      const maxAttempts = 3;

      while (attemptCount < maxAttempts) {
        try {
          attemptCount++;
          setError(null);

          // Step 1: Initialize
          setLoadingProgress(
            `Initializing form (attempt ${attemptCount}/${maxAttempts})...`
          );

          const loadingTasks: Promise<unknown>[] = [];

          // Step 2: Load dependencies
          if (dependencies.length > 0) {
            setLoadingProgress("Loading required data...");
            loadingTasks.push(...dependencies.map((dep) => dep()));
          }

          // Step 3: Generate code if needed
          if (autoGenerateCode) {
            setLoadingProgress("Generating unique code...");
            loadingTasks.push(autoGenerateCode());
          }

          // Execute all tasks in parallel
          const results = await Promise.all(loadingTasks);

          // Step 4: Validate results
          setLoadingProgress("Validating data...");

          // Separate code generation result from other data
          let dataResults = results;
          let codeResult = "";

          if (autoGenerateCode) {
            codeResult = results[results.length - 1] as string;
            dataResults = results.slice(0, -1);
          }

          // Validate dependencies data
          const isValidData = dataResults.every((result) => {
            if (Array.isArray(result)) {
              return result.length >= 0; // Allow empty arrays
            }
            return result !== null && result !== undefined;
          });

          // Validate generated code
          const isValidCode =
            !autoGenerateCode ||
            (typeof codeResult === "string" && codeResult.length > 0);

          if (isValidData && isValidCode) {
            setLoadingProgress("Setting up form...");

            // Set results
            setData(dataResults);
            if (autoGenerateCode) {
              setGeneratedCode(codeResult);
            }

            // Small delay for smooth UX
            await new Promise((resolve) => setTimeout(resolve, 300));

            setIsLoading(false);
            return; // Success, exit loop
          } else {
            throw new Error("Invalid data received from server");
          }
        } catch (err) {
          console.error(`Loading attempt ${attemptCount} failed:`, err);

          if (attemptCount === maxAttempts) {
            // Last attempt failed
            setError(
              "Failed to load form data. Please try refreshing the page."
            );
            setLoadingProgress("Loading failed");
            setIsLoading(false);
          } else {
            // Retry with delay
            setLoadingProgress(
              `Loading failed. Retrying in 2 seconds... (${attemptCount}/${maxAttempts})`
            );
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }
    };

    loadFormData();
  }, [skipLoading, dependencies, autoGenerateCode]);

  return {
    isLoading,
    loadingProgress,
    error,
    data,
    generatedCode,
    retry: () => {
      setIsLoading(true);
      setError(null);
      setLoadingProgress("Initializing...");
    },
  };
}
