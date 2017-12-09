<template>
  <div class="manageBusOwner" style="width: 80%">
    <div class="container" style="background-color: white">
      <h4>{{ title }}</h4>
      <v-alert color="error" icon="warning" transition="scale-transition" value="true" v-show="message.length>0">
        {{message}}
      </v-alert>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'
export default {
  name: 'manageBusOwner',
  data: () => ({
    title: 'Manage the buses you own',
    valid: true,
    message: 'Sorry no buses were found :('
  }),
  methods: {

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

  .manageBusOwner{
    text-align: center;
  }

</style>
