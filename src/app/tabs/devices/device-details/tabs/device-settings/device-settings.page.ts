import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Device} from '../../../../../models/device';
import {Router} from '@angular/router';
import {DeviceService} from '../../../../../services/device.service';
import {ModalController, ToastController} from '@ionic/angular';
// tslint:disable-next-line:max-line-length
import {ConfirmDeleteDevicePopupComponent} from '../../../devices-list-page/popups/confirm-delete-device-popup/confirm-delete-device-popup.component';
import {BEDevice} from '../../../../../models/bedevice';

@Component({
  selector: 'app-device-settings',
  templateUrl: './device-settings.page.html',
  styleUrls: ['./device-settings.page.scss'],
})
export class DeviceSettingsPage implements OnInit {

  deviceDetailsForm: FormGroup;
  deviceAttributesForm: FormGroup;
  loadedDevice: BEDevice;

  toastrContent: Map<string, any> = new Map([
    ['del', {
      message: 'Thing deleted',
      duration: 4000,
      color: 'success'
    }],
    ['cancl_del', {
      message: 'Deleting Things canceled',
      duration: 4000,
      color: 'light'
    }],
    ['save', {
      message: '<ion-icon src="assets/app-icons/information.svg"></ion-icon>    Changes on Thing saved',
      duration: 4000,
      color: 'success'
    }],
    ['cancl_save', {
      message: 'Changes on Details of Thing discarded',
      duration: 4000,
      color: 'light'
    }],
    ['err', {
      message: 'Error occurred',
      duration: 10000,
      color: 'danger'
    }]
  ]);
  private deviceHasUnsavedChanges = false;

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    public toastCtrl: ToastController,
    public router: Router,
    private modalCtrl: ModalController
  ) {
  }

  async finished(param: string, details?: string) {
    const content = this.toastrContent.get(param);
    if (details && content && content.message) {
      content.message = content.message + ': ' + details;
    }
    const toast = await this.toastCtrl.create(content);
    toast.present();
  }

  navigate2DevicesList() {
    this.router.navigate(['devices']);
  }

  ngOnInit() {
    this.deviceAttributesForm = this.fb.group({
      apiConfig: [''],
      claimingTags: [[]],
    });
    this.deviceDetailsForm = this.fb.group({
      hwDeviceId: [''],
      description: [''],
      attributes: this.deviceAttributesForm,
    });
    this.patchForm();

    this.deviceService.observableCurrentDevice
      .subscribe(
        loadedDevice => {
          this.loadedDevice = loadedDevice;
          if (this.loadedDevice) {
            this.deviceDetailsForm.patchValue(this.patchForm(this.loadedDevice));
            this.deviceHasUnsavedChanges = false;
            this.watchFormControls();
          }
        }
      );
  }

  watchFormControls(): void {
    this.deviceDetailsForm.valueChanges.subscribe(val => {
      this.deviceHasUnsavedChanges = true;
    });
  }

  saveDevice() {
    const details = this.deviceDetailsForm.getRawValue();

    this.deviceService.updateDeviceFromData(details).subscribe(
      updatedDevice => {
        this.loadedDevice = new BEDevice(updatedDevice);
        this.patchForm(this.loadedDevice);
        this.finished('save');
        this.deviceHasUnsavedChanges = false;
      }
    );
  }

  async confirmDeviceDelete() {
    const modal = await this.modalCtrl.create({
      component: ConfirmDeleteDevicePopupComponent,
      componentProps: {
        devices: [this.loadedDevice]
      }
    });
    modal.onDidDismiss().then((detail: any) => {
      if (detail !== null && detail.data && detail.data.confirmed) {
        this.deviceService.deleteDevice(
          this.loadedDevice.hwDeviceId)
          .subscribe(
            _ => {
              this.navigate2DevicesList();
              this.finished('del');
            },
            err => this.finished(
              'err',
              err.toString()));
      } else {
        this.finished('cancl_del');
      }
    });
    await modal.present();
  }

  discardChanges() {
    this.finished('cancl_save');
    this.patchForm(this.loadedDevice);
  }

  private patchForm(device?: BEDevice): any {
    const val = {
      hwDeviceId: device && device.hwDeviceId ? device.hwDeviceId : '',
      description: device && device.description ? device.description : '',
      attributes: {
        claimingTags: device && device.attributes && device.attributes.claiming_tags ?
          device.attributes.claiming_tags : [],
        apiConfig: device && device.attributes && device.attributes.apiConfig && device.attributes.apiConfig.length > 0 ?
          this.getPrettyJSON(device.attributes.apiConfig[0]) : undefined
      }
    };
    return val;
  }

  private getPrettyJSON(json: string): string {
    return JSON.stringify(JSON.parse(json), null, 2);
  }
}
