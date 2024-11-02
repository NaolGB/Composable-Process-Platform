import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NotificationInterface } from '../../interfaces/design-interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  @Input() notifications: NotificationInterface[] = [];
  @Input() dismissalTime = 5000;
  @Output() notificationDismissed = new EventEmitter<NotificationInterface>();

  private intervals: Map<string, any> = new Map();

  ngOnInit() {
    this.notifications.forEach(notification => {
      if (!notification.dismissed) {
        this.startCountdown(notification);
      }
    });
  }

  ngOnDestroy() {
    this.intervals.forEach(clearInterval);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['notifications']) {
      const newNotifications: NotificationInterface[] = changes['notifications'].currentValue;
      newNotifications.forEach(notification => {
        if (!notification.dismissed && !this.intervals.has(notification.message)) {
          this.startCountdown(notification);
        }
      });
    }
  }

  startCountdown(notification: NotificationInterface) {
    const intervalId = setInterval(() => {
      notification.remainingTime -= 1000;
      if (notification.remainingTime <= 0) {
        this.dismissNotification(notification);
      }
    }, 1000);
    this.intervals.set(notification.message, intervalId);
  }

  dismissNotification(notification: NotificationInterface) {
    notification.dismissed = true;
    clearInterval(this.intervals.get(notification.message));
    this.intervals.delete(notification.message);
    // Use setTimeout to allow for the CSS transition
    setTimeout(() => {
      this.notificationDismissed.emit(notification);
    }, 400); // Adjust based on your CSS transition
  }
}
