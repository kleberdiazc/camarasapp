import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-travel-listing',
  templateUrl: './travel-listing.page.html',
  styleUrls: [
    './styles/travel-listing.page.scss',
    './styles/travel-listing.shell.scss'
  ]
})
export class TravelListingPage implements OnInit {
  items: [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      this.items = routeData['data'].items;
    });
  }
}
