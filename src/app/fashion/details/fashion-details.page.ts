import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fashion-details',
  templateUrl: './fashion-details.page.html',
  styleUrls: [
    './styles/fashion-details.page.scss',
    './styles/fashion-details.shell.scss',
    './styles/fashion-details.ios.scss',
    './styles/fashion-details.md.scss'
  ]
})
export class FashionDetailsPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription;

  details: any;
  colorVariants = [];
  sizeVariants = [];
  slidesOptions: any = {
    zoom: {
      toggle: false // Disable zooming to prevent weird double tap zomming on slide images
    }
  };

  constructor(
    private route: ActivatedRoute,
    public alertController: AlertController
  ) { }


  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      this.details = routeData['data'];

      this.colorVariants = this.details.colorVariants
      .map(item =>
        ({
          name: item.name,
          type: 'radio',
          label: item.name,
          value: item.value,
          checked: item.default
        })
      );

      this.sizeVariants = this.details.sizeVariants
      .map(item =>
        ({
          name: item.name,
          type: 'radio',
          label: item.name,
          value: item.value,
          checked: item.default
        })
      );
    });
  }

  async openColorChooser() {
    const alert = await this.alertController.create({
      header: 'Color',
      inputs: this.colorVariants,
      cssClass: 'variant-alert color-chooser',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'OK',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  async openSizeChooser() {
    const alert = await this.alertController.create({
      header: 'Size',
      inputs: this.sizeVariants,
      cssClass: 'variant-alert size-chooser',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'OK',
          handler: (selectedValue) => {
            console.log('Selected Value', selectedValue);
          }
        }
      ]
    });

    await alert.present();
  }
}
