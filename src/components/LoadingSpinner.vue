<template>
  <div id="loading-spinner" v-if="show">
    <div class="bg-light rounded py-3 px-4 shadow-sm">
      <span class="spinner-border spinner-border-sm me-2"></span>
      <span>Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["show"],
};
</script>

<style lang="scss" scoped>
@import "~bootstrap/scss/_mixins.scss";
@import "~bootstrap/scss/_functions.scss";
@import "~bootstrap/scss/_variables.scss";

#loading-spinner {
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparentize($color: $dark, $amount: 0.5);
  height: 100vh;
  width: 100vw;
  z-index: 1090;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>