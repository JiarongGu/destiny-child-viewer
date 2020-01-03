import { MotionType } from '@shared/models';

export type Live2DMotionCollection = { [key in MotionType]?: Array<Live2DMotion> };