import { delay } from "../utils/delay";
import { useEffect } from "react";

/**
 * Hook que hace una interrupción...
 * @param runEffect
 * @param waitTime
 * @param cb
 */
export const useWait = (
  runEffect = false,
  waitTime: number,
  cb: () => void
) => {
  useEffect(() => {
    const runAsync = async () => {
      /**
       * Se espera el tiempo especificado
       */
      await delay(waitTime);
      /**
       * Se ejecuta el callback...
       */
      cb();
    };

    /**
     * Si se indica que hay una interrupción, se ejecuta la función...
     */
    if (runEffect) {
      runAsync();
    }
  }, [runEffect, waitTime, cb]);
};
