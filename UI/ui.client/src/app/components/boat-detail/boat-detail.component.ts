import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Boat } from '../../models/boat.model';
import { BoatService } from '../../services/boat.service';

@Component({
  selector: 'app-boat-detail',
  templateUrl: './boat-detail.component.html',
  standalone: false,
  styleUrls: ['./boat-detail.component.scss']
})
export class BoatDetailComponent implements OnInit, OnChanges {
  @Input() boat: Boat | null = null;
  isEditing = false;
  isSaving = false;
  error: string | null = null;
  editForm: { name: string; description: string } = { name: '', description: '' };

  constructor(private boatService: BoatService) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['boat'] && this.boat) {
      this.resetForm();
    }
    this.isEditing = false;
  }

  resetForm(): void {
    if (this.boat) {
      this.editForm = {
        name: this.boat.name,
        description: this.boat.description
      };
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.resetForm();
    }
  }

  saveChanges(): void {
    if (this.boat && this.editForm.name.trim()) {
      this.isSaving = true;
      this.error = null;

      const updatedBoat: Boat = {
        ...this.boat,
        name: this.editForm.name,
        description: this.editForm.description
      };

      this.boatService.updateBoat(updatedBoat).subscribe({
        next: (response) => {
          this.boat = response;
          this.isEditing = false;
          this.isSaving = false;
        },
        error: (err) => {
          this.error = 'Erreur lors de la mise à jour du bateau';
          this.isSaving = false;
        }
      });
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.resetForm();
    this.error = null;
  }
}
