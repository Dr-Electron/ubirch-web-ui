import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'settings',
        pathMatch: 'full',
      },
      {
        path: 'settings',
        loadChildren: () => import('./device-settings/device-settings.module').then(m => m.DeviceSettingsPageModule)
      },
      {
        path: 'pubkeys',
        loadChildren: () => import('./device-pubkeys/device-pubkeys.module').then(m => m.DevicePubkeysPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/settings',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}