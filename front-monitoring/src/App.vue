<template>
  <div id="app">
    <h1>Monitoring service</h1>
    <ServerTags />
    <div class="content">
      <TotalRequests/>
      <PieChart/>
    </div>
    <div class="centered">
      <TimeChart/>
      <LinesChart/>
      <TableServers/>
    </div>
  
    <footer class="footer">
      <p>&copy; 2024 Monitoreo de Parqueadero NN. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>


<script>
import ServerTags from './components/Tags.vue';
import TotalRequests from './components/TotalRequests'
import PieChart from './components/PieChart.vue';
import TimeChart from './components/TimeChart.vue'
import LinesChart from './components/LinesChart.vue'
import TableServers from './components/TableServers.vue'

export default {
  name: 'App',
  components: {
    ServerTags, 
    TotalRequests,
    PieChart,
    TimeChart,
    TableServers,
    LinesChart,

  }
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
  justify-content: center;
}

.footer {
  margin-top: 60px;
  background-color: #257fa5;
  color: white;
  padding: 30px 0;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.centered {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

</style>
