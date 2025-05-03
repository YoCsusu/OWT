import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authReq = request.clone({
      headers: request.headers.set('X-Requested-With', 'XMLHttpRequest')
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur inconnue est survenue';

        if (error.error instanceof ErrorEvent) {
          // Erreur côté client
          errorMessage = `Erreur: ${error.error.message}`;
        } else {
          // Erreur côté serveur
          switch (error.status) {
            case 0:
              errorMessage = 'Le serveur n\'est pas joignable. Vérifiez votre connexion réseau.';
              break;
            case 400:
              errorMessage = 'Requête invalide';
              break;
            case 401:
              errorMessage = 'Authentification requise';
              console.log('Non autorisé, redirection vers la page de login');

              // Utiliser la redirection directe du navigateur
              const returnUrl = window.location.pathname + window.location.search;
              window.location.href = `/Identity/Account/Login?ReturnUrl=${encodeURIComponent(returnUrl)}`;
              break;
            case 403:
              errorMessage = 'Accès non autorisé';
              break;
            case 404:
              errorMessage = 'Ressource non trouvée';
              break;
            case 500:
              errorMessage = 'Erreur serveur interne';
              break;
            default:
              errorMessage = `Erreur ${error.status}: ${error.message}`;
          }
        }

        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
