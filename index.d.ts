import type Plyr from 'plyr';

export default class PlyrVr{
  constructor(player: Plyr, options: any);

  changeProjection_(projection: string): void;

  triggerError_(errorObj: any): void

  log(...msgs: any[]): void

  handleVrDisplayActivate_(): void

  handleVrDisplayDeactivate_(): void

  requestAnimationFrame(fn: FrameRequestCallback): number

  cancelAnimationFrame(id: number): void

  togglePlay_(): void

  animate_(): void

  handleResize_(): void

  setProjection(projection: string): void

  init(): void

  addCardboardButton_(): void

  getVideoEl_(): HTMLVideoElement

  reset(): void

  dispose(): void

  polyfillVersion(): string
}
