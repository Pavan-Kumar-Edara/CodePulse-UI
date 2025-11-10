import { Component, effect, inject, input } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { updateCategoryRequest } from '../models/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-category',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.css',
})
export class EditCategory {

  constructor() {
    effect(() => {
      if (this.categoryService.updateCategoryStatus() === 'success') {
        this.categoryService.updateCategoryStatus.set('idle');
        this.router.navigate(['/admin/categories']);
      }

      if (this.categoryService.updateCategoryStatus() === 'error') {
        this.categoryService.updateCategoryStatus.set('idle');
        console.error('Something Went Wrong...');
      }
    })
  }
  id = input<string>();

  private categoryService = inject(CategoryService);
  private router = inject(Router);

  categoryResosurceref = this.categoryService.getCategoryById(this.id);

  categoryResponse = this.categoryResosurceref.value;

  editCategoryFormGroup = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)]
    }),
    urlHandle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)]
    })
  })

  get nameFormControl() {
    return this.editCategoryFormGroup.controls.name;
  }
  get urlHandleFormControl() {
    return this.editCategoryFormGroup.controls.urlHandle;
  }

  effectRef = effect(() => {
    this.editCategoryFormGroup.controls.name.patchValue(this.categoryResponse()?.name ?? '');
    this.editCategoryFormGroup.controls.urlHandle.patchValue(this.categoryResponse()?.urlHandle ?? '');
  })

  onSubmit() {
    const id = this.id();

    if (!this.editCategoryFormGroup.valid || !id) {
      return;
    }

    const formRawValue = this.editCategoryFormGroup.getRawValue()

    const updateCategoryRequestDto: updateCategoryRequest = {
      name: formRawValue.name,
      urlHandle: formRawValue.urlHandle
    }

    this.categoryService.updateCategoryById(id, updateCategoryRequestDto)
  }

  deleteCategory() {
    const id = this.id();

    if (!id) {
      return;
    }

    this.categoryService.deleteCategoryById(id)
      .subscribe(
        {
          next: () => {
            this.router.navigate(['/admin/categories'])
          },
          error: () => {
            console.log('Something went wrong..!')
          }
        }
      )
  }
}
