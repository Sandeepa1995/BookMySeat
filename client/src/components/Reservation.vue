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
              <!--<h6 class="text-xs-center">Stops:   </h6>-->
              <h6 class="text-xs-center">Bus Type: {{trip.type}}</h6>
              <h6 class="text-xs-center">Date: {{date.date}}</h6>
              <h5 class="text-xs-center green--text">Seats Available: {{trip.seats - booked.length}} / {{trip.seats}}</h5>


            </v-card-text>
            <!--<v-flex xs12 md4 offset-md4>-->
              <!--<v-select-->
                <!--v-bind:items="items"-->
                <!--v-model="nofSeats"-->
                <!--label="Number of Seats"-->
                <!--:rules="[v => !!v || 'Please enter the number of seats you want to reserve. ']"-->
                <!--item-value="text"-->
                <!--required-->
              <!--&gt;</v-select>-->
            <!--</v-flex>-->

            <v-layout row>
              <v-flex sm-12>
                <h6 class="text-xs-center">Please select the seats from the arrangement.</h6>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex>
                <div class="container" style="border: 10px solid; padding-top: 50px" v-bind:style="{ width:  ((l_seats+1+r_seats)*50 +95)+ 'px', height:  ((r_rows+1)*50 +125)+ 'px' }">
                  <div class="container" v-bind:style="{ width:  ((l_seats+1+r_seats)*50 +35)+ 'px' }">
                    <div class="sideRow">
                      <div v-for="y in (l_rows)">
                        <label class="fullSeats" v-for="x in (l_seats)" style="float: left"
                               v-bind:class="{selectedSeat:checkbox.indexOf(getSeat(x,y)) >= 0,unavailableSeat:booked.indexOf(getSeat(x,y)) >= 0}">
                          <input type="checkbox" :value="getSeat(x,y)" v-model="checkbox" v-show="false"
                                 :disabled="(booked.indexOf(getSeat(x,y)) >= 0)">
                        </label>
                        <label class="emptySeats" style="float: left"></label>
                        <label class="fullSeats" v-for="x in r_seats" style="float: left"
                               v-bind:class="{selectedSeat:checkbox.indexOf(getSeat(x+l_seats,y)) >= 0,unavailableSeat:booked.indexOf(getSeat(x+l_seats,y)) >= 0}">
                          <input type="checkbox" :value="getSeat(x+l_seats,y)" v-model="checkbox" v-show="false"
                                 :disabled="(booked.indexOf(getSeat(x+l_seats,y)) >= 0)">
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="container" v-bind:style="{ width:  ((l_seats+1+r_seats)*50 +35)+ 'px'}">
                    <div class="sideRow">
                      <div v-for="y in Array.from(new Array((r_rows-l_rows)), (x,i) => i + l_rows+1)">
                        <label class="emptySeats" v-for="x in (l_seats+1)" style="float: left"></label>
                        <label class="fullSeats" v-for="x in r_seats" style="float: left"
                               v-bind:class="{selectedSeat:checkbox.indexOf(getSeat(x,y)) >= 0,unavailableSeat:booked.indexOf(getSeat(x,y)) >= 0}">
                          <input type="checkbox" :value="getSeat(x,y)" v-model="checkbox" v-show="false"
                                 :disabled="(booked.indexOf(getSeat(x,y)) >= 0)">
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="container" v-bind:style="{ width:  ((l_seats+1+r_seats)*50 +35)+ 'px' }">
                    <div class="backRow">
                      <label v-for="x in (l_seats+1+r_seats)" style="float: left; margin:auto"
                             v-bind:class="{selectedSeat:checkbox.indexOf(getSeat(x,r_rows+1)) >= 0,unavailableSeat:booked.indexOf(getSeat(x,r_rows+1)) >= 0}">
                        <input type="checkbox" :value="getSeat(x,r_rows+1)" v-model="checkbox" v-show="false"
                               :disabled="(booked.indexOf(getSeat(x,r_rows+1)) >= 0)">
                      </label>
                    </div>
                  </div>
                </div>
              </v-flex>
            </v-layout>
            <br>
            <v-layout row>
              <v-flex md-6>
                <h6 class="text-xs-right">Seat numbers selected:</h6>
              </v-flex>
              <v-flex md-6 >
                <h6> {{checkbox}}</h6>
              </v-flex>
            </v-layout>
            <v-flex md8 offset-md2>
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
              <v-alert
                color="error"
                value="true"
                class="text-xs-center"
                v-show="banner3">
                Please select at least one seat to reserve!
              </v-alert>
            </v-flex>

            <v-layout row>
              <v-flex d-flex>
                <v-btn
                  flat
                  color="red"
                  v-on:click="makeReservation">
                  Make Reservation
                </v-btn>
              </v-flex>
            </v-layout>


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
//        bookings: [],
//        nofSeats: '',

        banner1: false,
        banner2: false,
        banner3: false,

        r_rows:0,
        l_rows:0,
        r_seats:0,
        l_seats:0,
        checkbox: [],
        booked:[]
      }
    },
    mounted () {
      this.trip = JSON.parse(localStorage.getItem('selectedVal'));
      this.date = JSON.parse(localStorage.getItem('date'));
      this.userID = JSON.parse(localStorage.getItem('user'));
      this.getBookings();
      this.getDimensions();
    },
    methods: {
      hideBanner() {
        this.banner1 = false;
        this.banner2 = false;
      },

      makeReservation() {
        if(this.checkbox.length !=0) {
          for (var i = 0; i < this.checkbox.length; i++) {
            axios({
              method: 'post',
              url: 'http://localhost:3000/common/reserve',
              data: {
                details: this.trip,
                date: this.date,
                user: this.userID,
                seat: this.checkbox[i]
              },
              headers: {'Content-Type': 'application/json'}
            }).then((res) => {
              if (res.data.output === 'Successful') {
                this.banner1 = true;
                this.banner2 = !this.banner1;
                this.banner3 = !this.banner1;
                this.getBookings();
              }
              else {
                this.banner2 = true;
              }
            }).catch((err) => {
              console.log('Error: ' + err);
            });
          }
          this.checkbox = [];
          setTimeout(() => {
            this.banner1 = false;
            this.banner2 = false;
          }, 5000);
        }
        else{
          this.banner3 = true;
        }
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
            this.booked = [];
            var x = (res.data.output);
            for(var j in x){
              this.booked.push(parseInt(x[j].seat_no));
            }
            console.log(this.booked);
          }
        }).catch((err) => {
          console.log('Error:'+err);
        })
      },

      getSeat(x,y){
        if (y<=this.l_rows){
          return (y-1)*(this.l_seats+this.r_seats)+x;
        }
        else if (y<=this.r_rows){
          return (this.l_rows)*(this.l_seats)+(y-1)*(this.r_seats)+x;
        }
        else{
          return (this.l_rows)*(this.l_seats)+(this.r_rows)*(this.r_seats)+x;
        }
      },

      getDimensions () {
        axios({
          method: 'post',
          url: 'http://localhost:3000/common/getdim',
          data: {
            license: this.trip.license
          },
          headers: {'Content-Type':'application/json'}
        }).then((res) => {
          var x = res.data.output;

          this.r_rows = parseInt(x[0].r_rows);
          this.r_seats = parseInt(x[0].r_seats);
          this.l_rows = parseInt(x[0].l_rows);
          this.l_seats = parseInt(x[0].l_seats);
        }).catch((error) => {
          console.log(error);
        })
      }
    }
  }
</script>

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

  .backRow label {
    width: 50px;
    height: 50px;
    outline: 1px solid;
  }

  .sideRow div .fullSeats {
    width: 50px;
    height: 50px;
    outline: 1px solid;
  }

  .sideRow div .emptySeats {
    width: 50px;
    height: 50px;
  }

  .selectedSeat{
    background-color: green;
  }

  .unavailableSeat{
    background-color: red;
  }
</style>
