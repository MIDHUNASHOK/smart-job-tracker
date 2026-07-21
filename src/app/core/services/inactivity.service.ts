import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {

 //timeout setting
  private readonly TIMEOUT_MS = 15 * 60 * 1000;

  // User actions that count as "activity" and reset the timer.
  private readonly activityEvents = [
    'mousemove',
    'mousedown',
    'keydown',
    'scroll',
    'touchstart',
    'click'
  ];

  private timerId: any = null;
  private lastReset = 0;
  private monitoring = false;

  // Bound handlers so we can add AND remove the exact same references.
  private readonly onActivity = () => this.resetTimer();
  private readonly onVisibility = () => this.handleVisibilityChange();

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  /** Begin watching for inactivity. Call this once the user is logged in. */
  start(): void {

    if (this.monitoring) {
      return;
    }

    this.monitoring = true;

    // Run listeners OUTSIDE Angular's zone. mousemove/scroll fire constantly,
    // and letting them trigger change detection every time would tank performance.
    this.ngZone.runOutsideAngular(() => {

      this.activityEvents.forEach(evt =>
        window.addEventListener(evt, this.onActivity, { passive: true })
      );

      // Catches the "laptop went to sleep, then woke up" case.
      document.addEventListener('visibilitychange', this.onVisibility);

    });

    this.resetTimer();
  }

  /** Stop watching and clear everything. Called on logout / leaving the app. */
  stop(): void {

    if (!this.monitoring) {
      return;
    }

    this.monitoring = false;

    this.activityEvents.forEach(evt =>
      window.removeEventListener(evt, this.onActivity)
    );

    document.removeEventListener('visibilitychange', this.onVisibility);

    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  /** Reset the countdown. Throttled to at most once per second. */
  private resetTimer(): void {

    const now = Date.now();

    // Throttle: no need to reset (or write to storage) on every pixel of mousemove.
    if (now - this.lastReset < 1000) {
      return;
    }
    this.lastReset = now;

    // Timestamp lets us detect a timeout that elapsed while the tab was asleep.
    localStorage.setItem('lastActivity', now.toString());

    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    this.timerId = setTimeout(() => {
      // Re-enter Angular's zone: routing + toast must run inside it.
      this.ngZone.run(() => this.logout());
    }, this.TIMEOUT_MS);
  }

  /** When the tab becomes visible again, check whether we already timed out. */
  private handleVisibilityChange(): void {

    if (document.visibilityState !== 'visible') {
      return;
    }

    const last = Number(localStorage.getItem('lastActivity') || 0);
    const idleFor = Date.now() - last;

    if (last && idleFor >= this.TIMEOUT_MS) {
      this.ngZone.run(() => this.logout());
    } else {
      this.resetTimer();
    }
  }

  /** Perform the actual logout. */
  private logout(): void {

    this.stop();

    this.authService.logout();               // clears the token
    localStorage.removeItem('lastActivity');

    this.toastService.warning('You were logged out due to inactivity');

    this.router.navigate(['/login']);
  }
}