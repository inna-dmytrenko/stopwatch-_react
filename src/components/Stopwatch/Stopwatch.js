import { useEffect, useState, useCallback, useMemo } from "react";
import { Observable, Subject } from "rxjs";
import { map, buffer, debounceTime, filter, takeUntil } from "rxjs/operators";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import timeToString from "../../helpers/timeToString";

import styles from "./Stopwatch.module.css";

export default function OutlinedButtons() {
  const [state, setState] = useState("stop");
  const [time, setTime] = useState(0);

  const stop$ = useMemo(() => new Subject(), []);
  const click$ = useMemo(() => new Subject(), []);
  const start = () => {
    setState("start");
  };
  const stop = useCallback(() => {
    setTime(0);
    setState("stop");
  }, []);

  const reset = useCallback(() => {
    setTime(0);
  }, []);

  useEffect(() => {
    const doubleClick$ = click$.pipe(
      buffer(click$.pipe(debounceTime(300))),
      map((list) => list.length),
      filter((value) => value >= 2)
    );
    const timer$ = new Observable((observer) => {
      let count = 0;
      const intervalId = setInterval(() => {
        observer.next((count += 1));
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    });
    const subscribtion$ = timer$
      .pipe(takeUntil(doubleClick$))
      .pipe(takeUntil(stop$))
      .subscribe({
        next: () => {
          if (state === "start") {
            setTime((prev) => prev + 1);
          }
        },
      });

    return () => {
      subscribtion$.unsubscribe();
    };
  }, [state, click$, stop$]);

  const wait = useCallback(() => {
    const doubleClick$ = click$.pipe(
      buffer(click$.pipe(debounceTime(300))),
      map((list) => list.length),
      filter((value) => value >= 2)
    );
    const timer$ = new Observable((observer) => {
      let count = 0;
      const intervalId = setInterval(() => {
        observer.next((count += 1));
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    });
    const subscribtion$ = timer$
      .pipe(takeUntil(doubleClick$))
      .pipe(takeUntil(stop$))
      .subscribe({
        next: () => {
          if (state === "start") {
            setTime((prev) => prev + 1);
          }
        },
      });
    click$.next();
    setState("wait");
    return () => {
      subscribtion$.unsubscribe();
    };
  }, [state, click$, stop$]);
  return (
    <>
      <div className={styles.stopwatch}>
        <h1>
          <span className={styles.gold}>GOLD</span> STOPWATCH
        </h1>
        <div className={styles.circle}>
          <span className={styles.time} id="display">
            <h1 className="stopwatch indicator">{timeToString(time)}</h1>
          </span>
        </div>

        <Stack direction="row" spacing={2}>
          {state !== "start" ? (
            <Button variant="outlined" onClick={start}>
              Start
            </Button>
          ) : (
            <Button variant="outlined" onClick={stop}>
              Stop{" "}
            </Button>
          )}

          <Button variant="outlined" onClick={wait}>
            Wait
          </Button>

          <Button variant="outlined" href="#outlined-buttons" onClick={reset}>
            Reset
          </Button>
        </Stack>
      </div>
    </>
  );
}
