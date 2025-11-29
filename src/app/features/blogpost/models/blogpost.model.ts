import { category } from "../../category/models/category.model"

export interface AddBlogPostRequest{
    title : string,
    shortDescription : string,
    content : string,
    featuredImageUrl : string,
    urlHandle : string,
    author : string,
    publishedDate : Date,
    isVisible : boolean,
    categories : string[]
}

export interface BlogPost{
    id : string,
    title : string,
    shortDescription : string,
    content : string,
    featuredImageUrl : string,
    urlHandle : string,
    author : string,
    publishedDate : string,
    isVisible : boolean,
    categories : category[]
}

export interface UpdateBlogpostRequest{
    title : string,
    shortDescription : string,
    content : string,
    featuredImageUrl : string,
    urlHandle : string,
    author : string,
    publishedDate : Date,
    isVisible : boolean,
    categories : string[]
}