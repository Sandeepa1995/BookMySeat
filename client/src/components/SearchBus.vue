<template>
  <v-container class="mt-0">
    <v-layout row>
      <v-flex xs12>
        <h3 class="text-xs-center mt-1" style="text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">Search for Trips</h3>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <h6 class="text-xs-center" style="text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">Please enter the destination you want to travel to, in order to find available trips.</h6>
      </v-flex>
    </v-layout>
    <v-card>
    <v-layout>
      <v-flex xs12 md4 offset-md4>
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
      <v-flex xs12 md4 offset-md4>
        <v-text-field
          label="From"
          name="value"
          v-model="searchValue1"
          :rules="[v => !!v || 'Starting location is required.',
          (v) => /^[a-zA-Z]+$/.test(v) || 'Locations cannot include numbers'
          ]"
          required
        ></v-text-field>
        <v-text-field
          label="To"
          name="value"
          v-model="searchValue2"
          :rules="[v => !!v || 'Destination is required.',
          (v) => /^[a-zA-Z]+$/.test(v) || 'Locations cannot include numbers'  
          ]"
          required
        ></v-text-field>
        <v-menu
          lazy
          :close-on-content-click="false"
          v-model="menu"
          transition="scale-transition"
          offset-y
          full-width
          :nudge-right="40"
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            label="Date "
            v-model="date"
            prepend-icon="event"
            readonly
            :rules="[v => !!v || 'Date is required.']"
            required
          ></v-text-field>
          <v-date-picker v-model="date" no-title scrollable actions>
            <template slot-scope="{ save, cancel }">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                <v-btn flat color="primary" @click="save">OK</v-btn>
              </v-card-actions>
            </template>
          </v-date-picker>
        </v-menu>
        <v-btn
          block
          dark
          v-on:click='searchTrips'
        >Search</v-btn>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>

      </v-flex>

    </v-layout>
    </v-card>
  </v-container>
</template>


<script>
  import VCard from "vuetify/es5/components/VCard/VCard";

  const axios = require('axios');
  export default {
    components: {VCard},
    name: 'searchBus',
    data() {
      return {
        menu: false,
        modal: false,

        date: null,
        searchValue1: '',
        searchValue2: '',

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
          data: {
            searchValue1: this.searchValue1,
            searchValue2: this.searchValue2,
            date: this.date
          },
          headers: {'Content-Type':'application/json'}
        }).then((res) => {
          if(res.data.output != 'Cannot find the route'){
//            console.log(res.data.output);
            localStorage.setItem("searchResult",JSON.stringify(res.data.output));
            localStorage.setItem("date",JSON.stringify({date: this.date}));
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
