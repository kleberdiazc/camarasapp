import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-real-estate-details',
  templateUrl: './real-estate-details.page.html',
  styleUrls: [
    './styles/real-estate-details.page.scss',
    './styles/real-estate-details.shell.scss'
  ]
})
export class RealEstateDetailsPage implements OnInit {
  details: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      this.details = routeData['data'];
    });
  }
}
