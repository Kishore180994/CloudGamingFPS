/**
 * Author: Chandra Kishore Danduri
 */

import { useEffect, useState } from "react";

/**
 * Custom interface extending the Navigator interface to include `getBattery` method.
 * This is necessary because as of my knowledge cutoff in September 2021, `getBattery`
 * is not yet included in the standard Navigator interface.
 */
interface NavigatorBatteryManager extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

/**
 * Custom interface for the BatteryManager. This includes all the properties and methods
 * that the BatteryManager is expected to have according to the Battery Status API.
 */
interface BatteryManager {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
  onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    useCapture?: boolean
  ): void;
}

/**
 * This is a custom React Hook named `useBatteryDischargeRate`. It provides the battery discharge
 * rate of the device when it is not charging.
 *
 * @param {boolean} start - A boolean indicating whether or not to start calculating the battery discharge rate.
 * @returns {Object} - An object containing battery discharge rate, initial battery level, and final battery level.
 *
 * If the `start` parameter is true, it initiates the calculation process. The process starts by recording the
 * initial battery level. Then, it waits until the device stops charging. Once the device stops charging, it
 * calculates the discharge rate, which is the difference between the initial and final battery level divided
 * by the time difference. It updates the `batteryDischargeRate` state with this value. The `initialBatteryLevel`
 * and `finalBatteryLevel` are also recorded and returned.
 *
 * The hook also contains a cleanup function inside the useEffect hook. If `start` is set to false, it stops
 * the calculation process and resets the states to their initial values.
 *
 * Note: This hook uses the Battery Status API which is not supported in all browsers. Make sure to check
 * for its availability before using this hook in a production environment.
 */
export const useBatteryDischargeRate = (start: boolean) => {
  const [batteryDischargeRate, setBatteryDischargeRate] = useState<
    string | null
  >(null);
  const [initialBatteryLevel, setInitialBatteryLevel] = useState<number | null>(
    null
  );
  const [finalBatteryLevel, setFinalBatteryLevel] = useState<number | null>(
    null
  );

  const calculateDischargeRate = (
    initialLevel: number,
    finalLevel: number,
    startTime: number,
    endTime: number
  ) => {
    const levelDiff = initialLevel - finalLevel;
    const timeDiff = (endTime - startTime) / 1000; // Convert to seconds
    const dischargeRate = levelDiff / timeDiff;
    return dischargeRate.toFixed(2);
  };

  useEffect(() => {
    if (start) {
      setFinalBatteryLevel(null);
      setBatteryDischargeRate(null);
    }
  }, [start]);

  useEffect(() => {
    if ("getBattery" in navigator) {
      let battery: BatteryManager | null = null;

      (navigator as NavigatorBatteryManager)
        .getBattery?.()
        .then((bat: BatteryManager) => {
          battery = bat;
          if (start) {
            setInitialBatteryLevel(battery.level * 100);
          } else if (initialBatteryLevel !== null) {
            const currentBatteryLevel = battery.level * 100;
            // const dischargeRate = initialBatteryLevel - battery.level * 100;
            const dischargeRate = calculateDischargeRate(
              initialBatteryLevel,
              currentBatteryLevel,
              performance.timeOrigin,
              Date.now()
            );

            setBatteryDischargeRate(dischargeRate);
            setFinalBatteryLevel(battery.level * 100);
          }
        });
    }
  }, [start, initialBatteryLevel]);

  return {
    batteryDischargeRate,
    initialBatteryLevel: initialBatteryLevel
      ? parseFloat(initialBatteryLevel.toFixed(2))
      : 0,
    finalBatteryLevel: finalBatteryLevel
      ? parseFloat(finalBatteryLevel.toFixed(2))
      : 0,
  };
};
