<template>
  <div id="layout-default" class="container-fluid p-0">
    <nav class="navbar navbar-light fixed-top bg-light border-bottom shadow-sm">
      <div class="container-fluid justify-content-center">
        <router-link class="navbar-brand" to="/">
          BASF FrontEnd Test
        </router-link>
      </div>
    </nav>
    <slot />
  </div>
</template>

<script>
export default {
  name: "layout-default",
};
</script>