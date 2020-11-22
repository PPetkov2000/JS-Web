import { Component, OnInit } from '@angular/core';
import { ArticleData } from 'src/app/data/data';
import { Article } from 'src/app/models/article.model';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  articles: Article[];

  constructor() { }

  ngOnInit(): void {
    this.articles = new ArticleData().getData();
  }

}
