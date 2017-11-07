<template>
  <div class="home">
    <h2>{{ msg }}</h2>
    <h4>Be hip, and book a seat for your trip!</h4>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to BookMySeat'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

  .home{
    text-align: center;
  }
</style>
