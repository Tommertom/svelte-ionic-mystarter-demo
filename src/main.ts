import App from './App.svelte'

import { setupIonicSvelte } from '$ionic/svelte';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

setupIonicSvelte();

// if the page was prerendered, we want to remove the prerendered html
document.querySelector('[data-routify]')?.remove()
const app = new App({
  target: document.getElementById('app')
})
// defineCustomElements(window);
export default app

/*
  <script src="https://cdn.jsdelivr.net/npm/exif-js"></script>
  <script type="module"
    src="https://unpkg.com/@ionic/pwa-elements@latest/dist/ionicpwaelements/ionicpwaelements.esm.js"></script>
  <script nomodule
    src="https://unpkg.com/@ionic/pwa-elements@latest/dist/ionicpwaelements/ionicpwaelements.js"></script>

*/
