<template>
  <v-layout>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h2 class="text-xs-center mb-0">{{trip.start}} - {{trip.end}}</h2>
          <h2 class="text-xs-center mb-3">{{trip.route}}</h2>
        </div>
      </v-card-title>
      <v-card-text>
        <h6 class="text-xs-center">License Number: {{trip.license}}</h6>
        <h6 class="text-xs-center">Leaving Time: {{trip.time}}</h6>
        <h6 class="text-xs-center">Starting Location: {{trip.start}}</h6>
        <h6 class="text-xs-center">Stops:   </h6>
        <h6 class="text-xs-center">Bus Type: {{trip.type}}</h6>
        <h5 class="text-xs-center green--text">Seats Available: {{trip.seats}}</h5>


      </v-card-text>
      <v-card-actions>

        <v-btn flat color="red" >Make Reservation</v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
  export default {

    data () {
      return {
        trip: ''
      }
    },
    mounted () {
      this.trip = JSON.parse(localStorage.getItem('selectedVal'));
    }
  }
</script>
