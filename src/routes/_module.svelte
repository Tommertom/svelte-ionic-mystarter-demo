<script lang="ts">
  import { defineCustomElements } from "@ionic/pwa-elements/loader";
  import { onMount } from "svelte";

  onMount(() => {
    // defineCustomElements(window); // gives error "failed to fetch dynamically imported module"
  });
</script>

<ion-app>
  <div class="ion-page" id="main">
    <slot />
  </div>
</ion-app>
