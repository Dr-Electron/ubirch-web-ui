import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DeviceService} from '../../../../../services/device.service';
import {Device} from '../../../../../models/device';
import {KeyService} from '../../../../../services/key.service';
import {PubKeyInfo} from '../../../../../models/pub-key-info';
import {environment} from '../../../../../../environments/environment';
import {interval, of, Subscription} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';
import {UbirchWebUIUtilsService} from '../../../../../utils/ubirch-web-uiutils.service';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-device-pubkeys',
  templateUrl: './device-pubkeys.page.html',
  styleUrls: ['./device-pubkeys.page.scss'],
})
export class DevicePubkeysPage implements OnInit {
    @ViewChild('dateColumn', {static: true}) dateColumn: TemplateRef<any>;

    polling = new Subscription();

    loadedDevice: Device;
    pubKeyList: PubKeyInfo[];

    loadingSpinner: Promise<void | HTMLIonLoadingElement>;
    loaded = false;

  constructor(
      private deviceService: DeviceService,
      private keyService: KeyService,
      private loadingController: LoadingController
  ) { }

    ionViewWillEnter() {
        this.restartPolling();
    }

    ngOnInit() {
      this.deviceService.observableCurrentDevice
        .subscribe(
            loadedDevice =>  {
              this.loadedDevice = loadedDevice;
              this.restartPolling(true);
            }
        );
  }

    ionViewWillLeave() {
        this.stopPolling();
    }

    private restartPolling(showSpinner?: boolean) {
        this.stopPolling();

        this.polling = interval(environment.POLLING_INTERVAL_MILLISECONDS)
            .pipe(
                startWith(0),
                switchMap(() => {
                    if (this.loadedDevice && this.loadedDevice.hwDeviceId) {
                        // load pubKeys
                        if (showSpinner) {
                          this.showLoader();
                        }
                        return this.keyService.getPubKeysOfThing(this.loadedDevice.hwDeviceId);
                    } else {
                        return of(null);
                    }
                })
            )
            .subscribe( pubKeyList => {
                // list of pubKeys, sort by validNotAfter
                this.pubKeyList = pubKeyList && pubKeyList.length > 0 ?
                  pubKeyList.sort(KeyService.compareKeys) : undefined;
                this.loaded = true;
                this.hideLoader();
              }
            );
    }

    private stopPolling() {
        if (this.polling) {
            this.polling.unsubscribe();
        }
    }

    get DATE_TIME_ZONE_FORMAT(): string {
      return environment.DATE_TIME_ZONE_FORMAT;
    }

    copyToClipboard(val: string) {
      UbirchWebUIUtilsService.copyToClipboard(val);
    }

  showLoader() {
    this.loadingSpinner = this.loadingController.create({
      message: 'Loading pubKeys of thing'
    }).then((res) => {
      res.present();
    });
  }

  hideLoader() {
    if (this.loadingSpinner) {
      this.loadingController.dismiss();
      this.loadingSpinner = undefined;
    }
  }

}
