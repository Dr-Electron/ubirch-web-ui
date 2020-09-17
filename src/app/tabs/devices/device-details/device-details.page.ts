import {Component, OnDestroy} from '@angular/core';
import {Device} from '../../../models/device';
import {Router} from '@angular/router';
import {DeviceService} from '../../../services/device.service';
import {ToastController} from '@ionic/angular';
import {HeaderActionButton} from '../../../components/header/header-action-button';
import {BEDevice} from '../../../models/bedevice';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.page.html',
  styleUrls: ['./device-details.page.scss'],
})
export class DeviceDetailsPage implements OnDestroy {

   id: string;
   private deviceHasUnsavedChanges = false;
   loadedDevice: BEDevice;

   constructor(
       private deviceService: DeviceService,
       public toastCtrl: ToastController,
       public router: Router,
   ) { }

   deviceSubscription = this
    .deviceService
    .observableCurrentDevice
    .subscribe(device => {
      this.loadedDevice = device;
    });

  actionButtons = [new HeaderActionButton({
    color: 'dark',
    labelKey: 'action-button.back-to.thingslist',
    iconPath: 'assets/app-icons/back-button.svg',
    action: 'back2DevicesList'
  })];

  handleButtonClick(action: string) {
    switch (action) {
      case 'back2DevicesList':
        this.navigate2DevicesList();
        break;
    }
  }

  navigate2DevicesList() {
    this.router.navigate(['devices']);
  }

  get title(): string {
    return this.loadedDevice ? this.loadedDevice.description : '';
  }
  ngOnDestroy(): void {
    if (this.deviceSubscription) {
      this.deviceSubscription.unsubscribe();
    }
  }

}
