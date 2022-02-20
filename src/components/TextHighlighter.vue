<template>
  <span v-html="result"></span>
</template>

<script>
export default {
  props: ["text", "query"],
  computed: {
    result() {
      let resultText = this.text;

      if (this.text && this.query) {
        const regex = new RegExp(this.query, "gi");

        resultText = resultText.replace(regex, "<mark>$&</mark>");
      }

      return resultText;
    },
  },
};
</script>