import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { Notification } from '../../services/interface';
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
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() notifications: Notification[] = [];
  @Input() dismissalTime = 5000;
  @Output() notificationDismissed = new EventEmitter<Notification>();
  
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
      const newNotifications: Notification[] = changes['notifications'].currentValue;
      newNotifications.forEach(notification => {
        if (!notification.dismissed && !this.intervals.has(notification.message)) {
          this.startCountdown(notification);
        }
      });
    }
  }

  startCountdown(notification: Notification) {
    const intervalId = setInterval(() => {
      notification.remainingTime -= 1000;
      if (notification.remainingTime <= 0) {
        this.dismissNotification(notification);
      }
    }, 1000);
    this.intervals.set(notification.message, intervalId);
  }

  dismissNotification(notification: Notification) {
    notification.dismissed = true;
    clearInterval(this.intervals.get(notification.message));
    this.intervals.delete(notification.message);
    // Use setTimeout to allow for the CSS transition
    setTimeout(() => {
      this.notificationDismissed.emit(notification);
    }, 400); // Adjust based on your CSS transition
  }
}
