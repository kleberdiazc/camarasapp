import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-food-listing',
  templateUrl: './food-listing.page.html',
  styleUrls: [
    './styles/food-listing.page.scss',
    './styles/food-listing.shell.scss'
  ]
})
export class FoodListingPage implements OnInit {
  items: [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      this.items = routeData['data'].items;
    });
  }
}
