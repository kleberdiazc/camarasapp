import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.page.html',
  styleUrls: [
    './styles/food-details.page.scss',
    './styles/food-details.shell.scss'
  ]
})
export class FoodDetailsPage implements OnInit {
  details: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      this.details = routeData['data'];
    });
  }
}
