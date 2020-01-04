import { ipcMain, IpcMainInvokeEvent } from 'electron';

import { RemoteServiceType } from '@shared/remote';
import { IconRepository, CharacterRepository, RenderRepository, Live2DRepository, ThemeRepository } from './repositories';
import { FileService } from './services';

const createEventHandler = (service) => async (event: IpcMainInvokeEvent, method, args) => {
  return await service[method].apply(service, args);
}

export function createIpc() {
  ipcMain.handle(RemoteServiceType.File, createEventHandler(new FileService()));

  ipcMain.handle(RemoteServiceType.Icon, createEventHandler(new IconRepository()));

  ipcMain.handle(RemoteServiceType.Character, createEventHandler(new CharacterRepository()));

  ipcMain.handle(RemoteServiceType.Live2D, createEventHandler(new Live2DRepository()));

  ipcMain.handle(RemoteServiceType.Render, createEventHandler(new RenderRepository()));

  ipcMain.handle(RemoteServiceType.Theme, createEventHandler(new ThemeRepository()));
}