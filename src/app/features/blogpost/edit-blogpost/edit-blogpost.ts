import { Component, effect, inject, input } from '@angular/core';
import { BlogPostService } from '../services/blog-post-service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../category/services/category-service';
import { UpdateBlogpostRequest } from '../models/blogpost.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-blogpost',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './edit-blogpost.html',
  styleUrl: './edit-blogpost.css',
})
export class EditBlogpost {

  id = input<string>();

  blogPostService = inject(BlogPostService);
  categoryService = inject(CategoryService);
  router = inject(Router);

  private blogPostRef = this.blogPostService.getBlogPostById(this.id);
  private categoriesRef = this.categoryService.getAllCategories();

  blogPostResponse = this.blogPostRef.value;
  categoriesResponse = this.categoriesRef.value;

  editBlogPostForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(100)]
    }),
    shortDescription: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(300)]
    }),
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)]
    }),
    featuredImageUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)]
    }),
    urlHandle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)]
    }),
    publishedDate: new FormControl<string>(new Date().toISOString().split('T')[0], {
      nonNullable: true,
      validators: [Validators.required]
    }),
    author: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)]
    }),
    isVisisble: new FormControl<boolean>(true, {
      nonNullable: true,
    }),
    categories: new FormControl<string[]>([])
  })

  effectRef = effect(() => {
    if (this.blogPostResponse()) {
      this.editBlogPostForm.patchValue({
        title: this.blogPostResponse()?.title,
        shortDescription: this.blogPostResponse()?.shortDescription,
        content: this.blogPostResponse()?.content,
        author: this.blogPostResponse()?.author,
        featuredImageUrl: this.blogPostResponse()?.featuredImageUrl,
        isVisisble: this.blogPostResponse()?.isVisible,
        publishedDate: new Date(this.blogPostResponse()?.publishedDate!).toISOString().split('T')[0],
        urlHandle: this.blogPostResponse()?.urlHandle,
        categories: this.blogPostResponse()?.categories.map(x => x.id)
      })
    }
  })

  onSubmit() {
    const id = this.id();
    if (id && this.editBlogPostForm.valid) {
      const formValue = this.editBlogPostForm.getRawValue();

      const updateBlogPostRequestDto: UpdateBlogpostRequest = {
        title: formValue.title,
        shortDescription: formValue.shortDescription,
        content: formValue.content,
        author: formValue.author,
        featuredImageUrl: formValue.featuredImageUrl,
        isVisible: formValue.isVisisble,
        publishedDate: new Date(formValue.publishedDate),
        urlHandle: formValue.urlHandle,
        categories: formValue.categories ?? []
      }

      this.blogPostService.updateBlogPost(id, updateBlogPostRequestDto)
      .subscribe({
        next : (response) => {
          console.log(response);
          this.router.navigate(['/admin/blogposts'])
        },
        error : () => {
          console.log('Something Went Wrong.....!')
        }
      });
    }   
  }

  onDelete(){
    const id = this.id();
    if(id){
      this.blogPostService.deleteBlogPost(id)
      .subscribe({
        next:()=>{
          this.router.navigate(['/admin/blogposts'])
        },
        error:()=>{
          console.error('Something went wrong..!')
        }
      })
    }
  }
}
