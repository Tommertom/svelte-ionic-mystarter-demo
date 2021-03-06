import { EventEmitter } from '../../stencil-public-runtime';
export declare class PWACameraModal {
    el: any;
    onPhoto: EventEmitter;
    noDeviceError: EventEmitter;
    facingMode: string;
    noDevicesText: string;
    noDevicesButtonText: string;
    handlePhoto: (photo: Blob) => Promise<void>;
    handleNoDeviceError: (photo: any) => Promise<void>;
    handleBackdropClick(e: MouseEvent): void;
    handleComponentClick(e: MouseEvent): void;
    handleBackdropKeyUp(e: KeyboardEvent): void;
    render(): any;
}
