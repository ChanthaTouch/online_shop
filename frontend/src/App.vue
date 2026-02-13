<template>
  <router-view />
</template>

<script setup lang="ts">
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
}

body {
  font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #f5e6d3 0%, #fff5e6 50%, #fffbf0 100%);
  color: #4a3728;
  min-height: 100vh;
}

/* Premium scrollbar */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #fff5e6;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #d4a574 0%, #c9915b 100%);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #c9915b 0%, #b8804f 100%);
}
</style>
