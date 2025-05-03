import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Boat } from '../models/boat.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class BoatService {
  private apiUrl = 'http://localhost:3000'; // Remplacez par l'URL de votre API
  private boatsSubject = new BehaviorSubject<Boat[]>([]);
  private selectedBoatSubject = new BehaviorSubject<Boat | null>(null);

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    this.loadAllBoats();
  }

  // Récupérer la liste des bateaux
  loadAllBoats(): void {
    this.http.get<Boat[]>(`/boat`)
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe(boats => {
        this.boatsSubject.next(boats);
      });
  }

  // Observable pour souscrire à la liste des bateaux
  getBoats(): Observable<Boat[]> {
    return this.boatsSubject.asObservable();
  }

  // Récupérer un bateau par son ID
  getBoatById(id: string): Observable<Boat> {
    return this.http.get<Boat>(`/boat/${id}`)
      .pipe(
        tap(boat => this.selectedBoatSubject.next(boat)),
        catchError(this.handleError.bind(this))
      );
  }

  // Observable pour souscrire au bateau sélectionné
  getSelectedBoat(): Observable<Boat | null> {
    return this.selectedBoatSubject.asObservable();
  }

  // Ajouter un nouveau bateau
  addBoat(boat: Omit<Boat, 'id'>): Observable<Boat> {
    return this.http.post<Boat>(`/boat`, boat)
      .pipe(
        tap(newBoat => {
          const currentBoats = this.boatsSubject.value;
          this.boatsSubject.next([...currentBoats, newBoat]);
          this.notificationService.success(`Le bateau "${newBoat.name}" a été ajouté avec succès`);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // Mettre à jour un bateau existant
  updateBoat(updatedBoat: Boat): Observable<Boat> {
    return this.http.patch<Boat>(`/boat`, updatedBoat)
      .pipe(
        tap(boat => {
          const currentBoats = this.boatsSubject.value;
          this.boatsSubject.next(
            currentBoats.map(b => b.id === boat.id ? boat : b)
          );

          if (this.selectedBoatSubject.value?.id === boat.id) {
            this.selectedBoatSubject.next(boat);
          }

          this.notificationService.success(`Le bateau "${boat.name}" a été mis à jour avec succès`);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // Supprimer un bateau
  deleteBoat(id: string): Observable<void> {
    return this.http.delete<void>(`/boat/${id}`)
      .pipe(
        tap(() => {
          const currentBoats = this.boatsSubject.value;
          const boatToDelete = currentBoats.find(boat => boat.id === id);
          this.boatsSubject.next(currentBoats.filter(boat => boat.id !== id));

          if (this.selectedBoatSubject.value?.id === id) {
            this.selectedBoatSubject.next(null);
          }

          if (boatToDelete) {
            this.notificationService.info(`Le bateau "${boatToDelete.name}" a été supprimé`);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // Gestion des erreurs
  private handleError(error: any) {
    console.error('Une erreur est survenue', error);
    let errorMessage = 'Erreur lors de la communication avec le serveur';

    if (error.message) {
      errorMessage = error.message;
    }

    this.notificationService.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
