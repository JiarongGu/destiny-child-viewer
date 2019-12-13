import { RouteModel } from '@models/route';
import { SettingContainer } from './setting-container/setting-container';

export const settingRoute: RouteModel = {
  key: 'setting',
  link: {
    name: 'Setting',
    icon: 'setting',
    url: '/setting',
  },
  config: {
    path: '/setting',
    strict: true,
    component: SettingContainer
  }
};
