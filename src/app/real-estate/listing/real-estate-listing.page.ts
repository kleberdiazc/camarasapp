import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-real-estate-listing',
  templateUrl: './real-estate-listing.page.html',
  styleUrls: [
    './styles/real-estate-listing.page.scss',
    './styles/real-estate-listing.shell.scss'
  ]
})
export class RealEstateListingPage implements OnInit {
  items: [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      this.items = routeData['data'].items;
    });
  }
}
