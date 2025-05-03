import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BoatService } from '../../services/boat.service';

@Component({
  selector: 'app-boat-form',
  templateUrl: './boat-form.component.html',
  standalone: false,
  styleUrls: ['./boat-form.component.scss']
})
export class BoatFormComponent implements OnInit {
  @Output() boatAdded = new EventEmitter<void>();

  newBoat = {
    name: '',
    description: ''
  };

  isSubmitting = false;
  error: string | null = null;

  constructor(private boatService: BoatService) { }

  ngOnInit(): void { }

  addBoat(): void {
    if (this.newBoat.name.trim()) {
      this.isSubmitting = true;
      this.error = null;

      this.boatService.addBoat({
        name: this.newBoat.name,
        description: this.newBoat.description
      }).subscribe({
        next: () => {
          this.resetForm();
          this.isSubmitting = false;
          this.boatAdded.emit();
        },
        error: (err) => {
          this.error = 'Erreur lors de l\'ajout du bateau';
          this.isSubmitting = false;
        }
      });
    }
  }

  resetForm(): void {
    this.newBoat = {
      name: '',
      description: ''
    };
    this.error = null;
  }

  cancel(): void {
    this.resetForm();
    this.boatAdded.emit();
  }
}
