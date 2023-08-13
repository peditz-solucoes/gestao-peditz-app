import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    electronBridge: {
      printLine: (printerName: string, line: string) => void
    }
  }
}
