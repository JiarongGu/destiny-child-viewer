import { RouteProps } from 'react-router';

export interface RouteModel {
  name?: string;
  key: string;
  props: RouteProps;
  link?: string;
  icon?: string;
  routes?: Array<RouteModel>;
}
