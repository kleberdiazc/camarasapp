import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-deals-details',
  templateUrl: './deals-details.page.html',
  styleUrls: [
    './styles/deals-details.page.scss',
    './styles/deals-details.shell.scss'
  ]
})
export class DealsDetailsPage implements OnInit {

  details: any;
  slidesOptions: any = {
    zoom: {
      toggle: false // Disable zooming to prevent weird double tap zomming on slide images
    }
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      this.details = routeData['data'];
    });
  }
}
