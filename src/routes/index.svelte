<script lang="ts">
  import { goto } from "@roxi/routify";

  $goto("/tabs/[tabs]", { tabs: "tab2" }); // $goto("/message/[id]", { id: "5" })
</script>
