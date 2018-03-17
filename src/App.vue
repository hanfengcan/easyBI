<template>
  <div id="app">
    <mdiv>
      <div slot="container" style="width: 100%; height: 100%; background-color: skyblue;"></div>
    </mdiv>
    <mdiv name="测试">
      <div slot="container" style="width: 100%; height: 100%; background-color: lightblue;"></div>
    </mdiv>
  </div>
</template>

<script>
import mdiv from './components/mdiv'

export default {
  name: 'App',
  components: {
    mdiv
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  position: relative;
  color: #2c3e50;
  margin: 60px auto;
  height: 90%;
  width: 1000px;
  border: 1px solid transparent;
  box-shadow: 2px 2px 6px #CCCCCC;
  border-radius: 6px;
  background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);
}

html {
  height: 100%;
}

body {
  margin: 0px;
  height: calc(100% - 60px);
}
</style>
