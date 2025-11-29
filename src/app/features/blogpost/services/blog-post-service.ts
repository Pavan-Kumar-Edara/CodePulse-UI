import { inject, Injectable, InputSignal } from '@angular/core';
import { AddBlogPostRequest, BlogPost, UpdateBlogpostRequest } from '../models/blogpost.model';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {

  private http = inject(HttpClient);
  apiBaseUrl = environment.apiBaseUrl;

  createBlogPost(blogpost: AddBlogPostRequest) : Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.apiBaseUrl}/api/blogposts`, blogpost)
  }

  getAllBlogPosts() : HttpResourceRef<BlogPost[] | undefined> {
     return httpResource<BlogPost[]>(() => `${this.apiBaseUrl}/api/blogposts`)
  }

  getBlogPostById(id : InputSignal<string | undefined>) : HttpResourceRef<BlogPost | undefined>{
    return httpResource<BlogPost>(() => `${this.apiBaseUrl}/api/blogposts/${id()}`)
  }

  updateBlogPost(id : string, body : UpdateBlogpostRequest): Observable<BlogPost>{
    return this.http.put<BlogPost>(`${this.apiBaseUrl}/api/blogposts/${id}`,body)
  }

  deleteBlogPost(id : string) : Observable<BlogPost>{
    return this.http.delete<BlogPost>(`${this.apiBaseUrl}/api/blogposts/${id}`)
  }
}
