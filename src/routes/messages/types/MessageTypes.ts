export enum MessageTypes {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  VIDEO = 'video',
  AUDIO = 'audio',
}
export type MessageTypesType =
  | MessageTypes.TEXT
  | MessageTypes.IMAGE
  | MessageTypes.FILE
  | MessageTypes.VIDEO
  | MessageTypes.AUDIO;
