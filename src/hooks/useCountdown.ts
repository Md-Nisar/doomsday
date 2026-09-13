import { useEffect, useMemo, useState } from 'react'

export interface CountdownValue {
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
  isComplete: boolean
}

const DAY_MS = 86_400_000
const HOUR_MS = 3_600_000
const MINUTE_MS = 60_000

/**
 * `days` is calendar months short of the target, not total days — months
 * have to be counted with real calendar arithmetic (28-31 days each), not a
 * fixed-length division, or "months" would drift against the actual date.
 * Walking forward one calendar month at a time from `now` until the next
 * step would pass `targetTime` gives the correct whole-month count; the
 * remainder (at most a bit over a month, in ms) is then split into
 * days/hours/minutes/seconds exactly as before.
 */
function getRemaining(targetTime: number, now: number): CountdownValue {
  const diff = targetTime - now

  if (diff <= 0) {
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true }
  }

  let months = 0
  const cursor = new Date(now)
  while (true) {
    const next = new Date(cursor)
    next.setMonth(next.getMonth() + 1)
    if (next.getTime() > targetTime) break
    cursor.setTime(next.getTime())
    months += 1
  }

  const remainder = targetTime - cursor.getTime()

  return {
    months,
    days: Math.floor(remainder / DAY_MS),
    hours: Math.floor((remainder % DAY_MS) / HOUR_MS),
    minutes: Math.floor((remainder % HOUR_MS) / MINUTE_MS),
    seconds: Math.floor((remainder % MINUTE_MS) / 1000),
    isComplete: false,
  }
}

/**
 * Ticks once per second, always recomputing from absolute timestamps
 * (target minus `Date.now()`) instead of decrementing a counter. That
 * makes it self-correcting: if the browser throttles the interval while
 * the tab is backgrounded, the next tick (or the `visibilitychange`
 * handler firing the moment the tab is foregrounded again) still lands on
 * the true remaining time rather than compounding drift. `targetIso` must
 * carry an explicit UTC offset so the countdown targets the same instant
 * for every visitor regardless of their local timezone or DST.
 *
 * The interval itself is stopped while the tab is hidden (nothing is
 * painted, so there's no reason to keep waking the JS engine every
 * second) and restarted — with an immediate resync — the moment the tab
 * becomes visible again.
 */
export function useCountdown(targetIso: string): CountdownValue {
  const targetTime = useMemo(() => new Date(targetIso).getTime(), [targetIso])
  const [value, setValue] = useState(() => getRemaining(targetTime, Date.now()))

  useEffect(() => {
    let intervalId: number | undefined

    const tick = () => setValue(getRemaining(targetTime, Date.now()))

    const startTicking = () => {
      tick()
      intervalId = window.setInterval(tick, 1000)
    }

    const stopTicking = () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId)
        intervalId = undefined
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTicking()
      } else {
        startTicking()
      }
    }

    if (document.hidden) {
      tick()
    } else {
      startTicking()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      stopTicking()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [targetTime])

  return value
}
