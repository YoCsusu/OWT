import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, Notification, NotificationType } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  standalone: false,
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription = this.notificationService.getNotifications()
      .subscribe(notification => {
        this.notifications.push(notification);

        if (notification.duration && notification.duration > 0) {
          setTimeout(() => this.removeNotification(notification), notification.duration);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeNotification(notification: Notification): void {
    this.notifications = this.notifications.filter(n => n !== notification);
  }

  getIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.Success:
        return 'fa-check-circle';
      case NotificationType.Error:
        return 'fa-times-circle';
      case NotificationType.Info:
        return 'fa-info-circle';
      case NotificationType.Warning:
        return 'fa-exclamation-triangle';
      default:
        return 'fa-bell';
    }
  }
}
