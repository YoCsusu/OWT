// src/app/components/boat-list/boat-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Boat } from '../../models/boat.model';
import { BoatService } from '../../services/boat.service';

@Component({
  selector: 'app-boat-list',
  templateUrl: './boat-list.component.html',
  standalone: false,
  styleUrls: ['./boat-list.component.scss']
})
export class BoatListComponent implements OnInit {
  boats$: Observable<Boat[]>;
  selectedBoat: Boat | null = null;
  showAddForm = false;
  loading = false;
  error: string | null = null;

  constructor(private boatService: BoatService) {
    this.boats$ = this.boatService.getBoats();
  }

  ngOnInit(): void {
    // S'abonner au bateau sélectionné
    this.boatService.getSelectedBoat().subscribe(boat => {
      this.selectedBoat = boat;
    });

    // Charge la liste initiale des bateaux
    this.refreshBoats();
  }

  refreshBoats(): void {
    this.loading = true;
    this.error = null;
    this.boatService.loadAllBoats();
    this.loading = false;
  }

  selectBoat(boat: Boat): void {
    this.loading = true;
    this.error = null;

    this.boatService.getBoatById(boat.id).subscribe({
      next: () => {
        this.showAddForm = false;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des détails du bateau';
        this.loading = false;
      }
    });
  }

  deleteBoat(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bateau?')) {
      this.loading = true;
      this.error = null;

      this.boatService.deleteBoat(id).subscribe({
        next: () => {
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression du bateau';
          this.loading = false;
          this.refreshBoats(); // Recharger la liste en cas d'erreur
        }
      });
    }
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.selectedBoat = null;
    }
  }

  onBoatAdded(): void {
    this.showAddForm = false;
    this.refreshBoats();
  }
}
