<template>
  <v-layout style="width: 100%">
    <v-flex xs12 sm8 offset-sm2>
      <v-card
        hover
        ripple
        class="mt-1 mb-1"
        v-for ="trip in Trips"
        :key = "trip.id">
        <v-layout row>
          <v-flex md4>
            <v-card-title primary-title>
              <div>
                <h6 class="mb-0 mt-0">{{trip.route}} {{trip.start}} - {{trip.end}}</h6>
              </div>
            </v-card-title>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex md3 class="mt-3  pa-2">
            Leaving time: {{trip.time}}
          </v-flex>
          <v-flex md3 v-show="user.type=='Passenger' || user.type=='Bus Operator'">
            <v-spacer></v-spacer>
            <v-card-actions>
              <v-btn
                flat
                color="blue"
                class="mt-2 ml-3"
                v-on:click="makeReservation(trip.id,trip.license,trip.route,trip.start,trip.end,trip.time,trip.type,trip.seats)"
               >
                Reserve
              </v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex md3 class="ml-3">
            License Number: {{trip.license}}
          </v-flex>
          <v-flex md3>
            Starting from: {{trip.start}}
          </v-flex>
          <v-flex md3 class="ml-1">
            Bus type: {{trip.type}}
          </v-flex>
          <v-flex md3 class="ml-2">
            Available seats: {{trip.seats-trip.bookings}} / {{trip.seats}}
          </v-flex>
        </v-layout>

      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  const axios = require('axios');
  export default {
    name: 'results',
    user: null,
    data() {
      return {
        Trips: [],
        selectedTrip: {
          id: '',
          route: '',
          license: '',
          start: '',
          end: '',
          time: '',
          type: '',
          seats: ''
        }
      }
    },
    mounted () {
      var result = JSON.parse(localStorage.getItem('searchResult'));
      this.user=JSON.parse(localStorage.getItem('user'));
//      result.pop();
//      console.log(result);
      this.Trips = result;
//
    },
    methods: {
      makeReservation(id,license,route,start,end,time,type,seats) {
        this.selectedTrip.id = id;
        this.selectedTrip.route = route;
        this.selectedTrip.license = license;
        this.selectedTrip.start = start;
        this.selectedTrip.end = end;
        this.selectedTrip.time = time;
        this.selectedTrip.type = type;
        this.selectedTrip.seats = seats;
        localStorage.setItem('selectedVal',JSON.stringify(this.selectedTrip));
        this.$router.push('/reservation/' +id);
      }
    }
  }
</script>

//      axios({
//        method: 'get',
//        url: 'http://localhost:3000/results',
//        headers: {'Content-Type': 'application/json'}
//      }).then((response) => {
//        console.log(response.data);
//        this.Trips = response.data[0];
//      }).catch((err) => {
//        console.log('Error: '+ err);
//      });
