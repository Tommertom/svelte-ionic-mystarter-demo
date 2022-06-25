import { is } from '$lib/ionic/svelte';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';

export let photos: UserPhoto[] = [];
let PHOTO_STORAGE: string = 'photos';

export const loadSaved = async () => {
    // Retrieve cached photo array data
    const photoList = await Storage.get({ key: PHOTO_STORAGE });
    photos = JSON.parse(photoList.value) || [];

    // If running on the web...
    if (!is('hybrid')) {
        // Display the photo by reading into base64 format
        for (let photo of photos) {
            // Read each saved photo's data from the Filesystem
            const readFile = await Filesystem.readFile({
                path: photo.filepath,
                directory: Directory.Data,
            });

            // Web platform only: Load the photo as base64 data
            photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
        }
    }
}

/* Use the device camera to take a photo:
// https://capacitor.ionicframework.com/docs/apis/camera
 
// Store the photo data into permanent file storage:
// https://capacitor.ionicframework.com/docs/apis/filesystem
 
// Store a reference to all photo filepaths using Storage API:
// https://capacitor.ionicframework.com/docs/apis/storage
*/
export const addNewToGallery = async () => {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri, // file-based data; provides best performance
        source: CameraSource.Camera, // automatically take a new photo with the camera
        quality: 100, // highest quality (0 to 100)
    });

    const savedImageFile = await savePicture(capturedPhoto);

    // Add new photo to Photos array
    photos.unshift(savedImageFile);

    // Cache all photo data for future retrieval
    Storage.set({
        key: PHOTO_STORAGE,
        value: JSON.stringify(photos),
    });
}

// Save picture to file on device
export const savePicture = async (photo: Photo) => {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await readAsBase64(photo);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
    });

    if (is('hybrid')) {
        // Display the new image by rewriting the 'file://' path to HTTP
        // Details: https://ionicframework.com/docs/building/webview#file-protocol
        return {
            filepath: savedFile.uri,
            webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        };
    } else {
        // Use webPath to display the new image instead of base64 since it's
        // already loaded into memory
        return {
            filepath: fileName,
            webviewPath: photo.webPath,
        };
    }
}

// Read camera photo into base64 format based on the platform the app is running on
const readAsBase64 = async (photo: Photo) => {
    // "hybrid" will detect Cordova or Capacitor
    if (is('hybrid')) {
        // Read the file into base64 format
        const file = await Filesystem.readFile({
            path: photo.path,
        });

        return file.data;
    } else {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(photo.webPath!);
        const blob = await response.blob();

        return (await convertBlobToBase64(blob)) as string;
    }
}

// Delete picture by removing it from reference data and the filesystem
export const deletePicture = async (photo: UserPhoto, position: number) => {
    // Remove this photo from the Photos reference data array
    photos.splice(position, 1);

    // Update photos array cache by overwriting the existing photo array
    Storage.set({
        key: PHOTO_STORAGE,
        value: JSON.stringify(photos),
    });

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data,
    });
}

const convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });

export interface UserPhoto {
    filepath: string;
    webviewPath: string;
}
