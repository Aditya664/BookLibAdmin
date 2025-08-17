import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Genre } from '../../../models/genre.model';

export interface GenreDialogData {
  isEdit: boolean;
  genre?: Genre;
}

@Component({
  selector: 'app-genre-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './genre-form-dialog.component.html',
  styleUrl: './genre-form-dialog.component.scss'
})
export class GenreFormDialogComponent implements OnInit {
  genreForm: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GenreFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GenreDialogData
  ) {
    this.isEdit = data.isEdit;
    this.genreForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.genre) {
      this.populateForm(this.data.genre);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      iconName: ['', [Validators.required]],
    });
  }

  populateForm(genre: Genre): void {
    this.genreForm.patchValue({
      name: genre.name,
      iconName: genre.iconName || '',
    });
  }

  onSubmit(): void {
    if (this.genreForm.valid) {
      const formValue = this.genreForm.value;
      this.dialogRef.close(formValue);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.genreForm.controls).forEach(key => {
      const control = this.genreForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.genreForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors?.['minlength']?.requiredLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${control.errors?.['maxlength']?.requiredLength} characters`;
    }
    return '';
  }
}
