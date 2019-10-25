import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DeviceService} from '../../../../../services/device.service';
import {Device} from '../../../../../models/device';
import {KeyService} from '../../../../../services/key.service';
import {PubKeyInfo} from '../../../../../models/pub-key-info';
import {environment} from '../../../../../../environments/environment';
import {interval, of, Subscription} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-device-pubkeys',
  templateUrl: './device-pubkeys.page.html',
  styleUrls: ['./device-pubkeys.page.scss'],
})
export class DevicePubkeysPage implements OnInit {
    @ViewChild('dateColumn', {static: true}) dateColumn: TemplateRef<any>;

    polling = new Subscription();

    loadedDevice: Device;
    public pubKeyList: PubKeyInfo[];

  constructor(
      private deviceService: DeviceService,
      private keyService: KeyService
  ) { }

    ionViewWillEnter() {
        this.restartPolling();
    }

    ngOnInit() {
      this.deviceService.observableCurrentDevice
        .subscribe(
            loadedDevice =>  {
              this.loadedDevice = loadedDevice;
              this.restartPolling();
            }
        );
  }

    ionViewWillLeave() {
        this.stopPolling();
    }

    private restartPolling() {
        this.stopPolling();

        this.polling = interval(environment.POLLING_INTERVAL_MILLISECONDS)
            .pipe(
                startWith(0),
                switchMap(() => {
                    if (this.loadedDevice && this.loadedDevice.hwDeviceId) {
                        // load pubKeys
                        return this.keyService.getPubKeysOfThing(this.loadedDevice.hwDeviceId);
                    } else {
                        return of(null);
                    }
                })
            )
            .subscribe( pubKeyList =>
                // list of pubKeys, sort by validNotAfter
                this.pubKeyList = pubKeyList && pubKeyList.length > 0 ?
                    pubKeyList.sort(KeyService.compareKeys) : undefined );
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
        /* To copy any Text */
            const selBox = document.createElement('textarea');
            selBox.style.position = 'fixed';
            selBox.style.left = '0';
            selBox.style.top = '0';
            selBox.style.opacity = '0';
            selBox.value = val;
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand('copy');
            document.body.removeChild(selBox);
    }

}
