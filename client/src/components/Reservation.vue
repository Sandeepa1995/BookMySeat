<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-card>
          <v-container>
            <v-card-text>
              <h2 class="text-xs-center mb-0">{{trip.start}} - {{trip.end}}</h2>
              <h2 class="text-xs-center mb-3">{{trip.route}}</h2>
              <h6 class="text-xs-center">License Number: {{trip.license}}</h6>
              <h6 class="text-xs-center">Leaving Time: {{trip.time}}</h6>
              <h6 class="text-xs-center">Starting Location: {{trip.start}}</h6>
              <h6 class="text-xs-center">Stops:   </h6>
              <h6 class="text-xs-center">Bus Type: {{trip.type}}</h6>
              <h6 class="text-xs-center">Date: {{date.date}}</h6>
              <h5 class="text-xs-center green--text">Seats Available: {{trip.seats- bookings}} / {{trip.seats}}</h5>


            </v-card-text>
            <v-flex xs12 md4 offset-md4>
              <v-select
                v-bind:items="items"
                v-model="nofSeats"
                label="Number of Seats"
                :rules="[v => !!v || 'Please enter the number of seats you want to reserve. ']"
                item-value="text"
                required
              ></v-select>
            </v-flex>
            <v-flex md6 offset-md3>
              <v-alert
                color="success"
                value="true"
                class="text-xs-center"
                v-show="banner1">
                Your reservation was successful. Check your user profile to see the reservation.
              </v-alert>
              <v-alert
                color="error"
                value="true"
                class="text-xs-center"
                v-show="banner2">
                There was an error when making your reservation. Please try again.
              </v-alert>
            </v-flex>
            <v-card-actions>
              <v-flex d-flex>
                <v-btn
                  flat
                  color="red"
                  v-on:click="makeReservation">
                  Make Reservation
                </v-btn>
              </v-flex>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  const axios = require('axios');
  export default {
    data () {
      return {
        trip: '',
        date: '',
        userID: '',
        bookings: '',
        nofSeats: '',

        banner1: false,
        banner2: false,

        items: [
          1,
          2,
          3,
          4,
          5,
          6
        ],
      }
    },
    mounted () {
      this.trip = JSON.parse(localStorage.getItem('selectedVal'));
      this.date = JSON.parse(localStorage.getItem('date'));
      this.userID = JSON.parse(localStorage.getItem('user'));
      this.getBookings();
    },
    methods: {
      hideBanner() {
        this.banner1 = false;
        this.banner2 = false;
      },

      makeReservation() {
        for(var i=0;i<this.nofSeats;i++){
          axios({
            method: 'post',
            url: 'http://localhost:3000/common/reserve',
            data: {
              details: this.trip,
              date: this.date,
              user: this.userID,
            },
            headers:{'Content-Type':'application/json'}
          }).then((res) => {
            if(res.data.output === 'Successful'){
              this.banner1 = true;
              this.banner2 = !this.banner1;
              this.getBookings();
            }
            else{
              this.banner2 = true;
            }
          }).catch((err) => {
            console.log('Error: '+err);
          });
        }
        setTimeout(() => {
          this.banner1 = false;
          this.banner2 = false;
        },5000);
      },

      getBookings() {
        axios({
          method: 'post',
          url: 'http://localhost:3000/common/bookings',
          data: {
            date: this.date,
            details: this.trip
          },
          headers: {'Content-Type': 'application/json'}
        }).then((res) => {
          if(res.data.success === true){
            if(res.data.output != null){
              this.bookings = JSON.stringify(res.data.output);
            }
            else{
              this.bookings = 0;
            }

          }
        }).catch((err) => {
          console.log('Error:'+err);
        })
      }
    }
  }
</script>
