<template>
  <v-container class="mt-0">
    <v-layout row>
      <v-flex xs12>
        <h3 class="text-xs-center mt-1">Search for Buses</h3>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <h6 class="text-xs-center">Please enter the destination you want to travel to, in order to find available trips.</h6>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs6 md6 offset-xs3>
        <v-alert
          color="warning"
          icon="warning"
          value="true"
          v-show="banner">
          Sorry, there are no available trips for your request.
        </v-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 md8 offset-sm2>
        <v-text-field
          placeholder="ex: Kandy or Badulla"
          name="value"
          v-model="searchValue"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-btn
          block
          dark
          v-on:click='searchTrips'
          >Search</v-btn>
      </v-flex>

    </v-layout>
  </v-container>
</template>


<script>
  const axios = require('axios');
  export default {
    name: 'searchBus',
    data() {
      return {
        searchValue: '',
        banner: false,
        messages: {
          errorMessage: ''
        }
      }
    },
    computed: {

    },
    methods: {
      searchTrips () {
//        console.log("called");
        axios({
          method: 'post',
          url: 'http://localhost:3000/common/search',
          data: {searchValue: this.searchValue},
          headers: {'Content-Type':'application/json'}
        }).then((res) => {
          if(res.data.output != 'Cannot find the route'){
//              console.log(res.data.output);
            localStorage.setItem("searchResult",JSON.stringify(res.data.output));
            this.$router.push('/results');
          }
          else{
            this.banner = true;
          }
        }).catch( (err) => {
          console.log('Error: '+ err);
        });
      }
    }
  }


</script>


<!--router-->
<!--to="/results"-->
<!--ref="name"-->
<!--:rules="[() => !!name || 'This field is required to search.']"-->
<!--:error-messages="errorMessages"-->
