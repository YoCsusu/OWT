import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning'
}

export interface Notification {
  message: string;
  type: NotificationType;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();

  constructor() { }

  getNotifications(): Observable<Notification> {
    return this.notificationSubject.asObservable();
  }

  success(message: string, duration: number = 3000): void {
    this.showNotification({
      message,
      type: NotificationType.Success,
      duration
    });
  }

  error(message: string, duration: number = 5000): void {
    this.showNotification({
      message,
      type: NotificationType.Error,
      duration
    });
  }

  info(message: string, duration: number = 3000): void {
    this.showNotification({
      message,
      type: NotificationType.Info,
      duration
    });
  }

  warning(message: string, duration: number = 4000): void {
    this.showNotification({
      message,
      type: NotificationType.Warning,
      duration
    });
  }

  private showNotification(notification: Notification): void {
    this.notificationSubject.next(notification);
  }
}
