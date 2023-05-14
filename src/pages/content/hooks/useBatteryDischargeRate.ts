import { useEffect, useState } from "react";

interface NavigatorBatteryManager extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

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

  return { batteryDischargeRate, initialBatteryLevel, finalBatteryLevel };
};
