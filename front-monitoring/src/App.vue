<template>
  <div id="app">
    <h1>Servicio de monitoreo</h1>
    <ServerTags />
    <TotalRequests/>
  </div>
</template>

<script>
import ServerTags from './components/Tags.vue';
import TotalRequests from './components/TotalRequests'

export default {
  name: 'App',
  components: {
    ServerTags, 
    TotalRequests,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>