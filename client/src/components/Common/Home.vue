<template>
  <div class="home">
    <template>
      <!--<v-parallax src="/../../static/bus_img2.jpg" height="1000">-->
        <v-layout column align-center justify-center style="padding-top: 20%">
          <h1 class="white--text" style="text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">{{ msg }}</h1>
          <h4 class="white--text" style="text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">Be hip, and book a seat for your trip!</h4>
        </v-layout>
        <!--<v-card style="padding: 100px">-->
          <!--<h2></h2>-->
          <!--<h4>Be hip, and book a seat for your trip!</h4>-->
        <!--</v-card>-->
      <!--</v-parallax>-->
    </template>


    <!--&lt;!&ndash;Seat selector starts here&ndash;&gt;-->
    <!--<div class="container" style="border: 10px solid; padding-top: 40px;" v-bind:style="{ width:  ((l_seats+1+r_seats)*40 +95)+ 'px', height:  ((r_rows+1)*40 +125)+ 'px' }">-->
      <!--<div class="container" v-bind:style="{ width:  ((l_seats+1+r_seats)*40 +35)+ 'px' }">-->
        <!--<div class="sideRow">-->
          <!--<div v-for="y in (l_rows)">-->
            <!--<label class="fullSeats" v-for="x in (l_seats)" style="float: left"-->
                   <!--v-bind:class="{selectedSeat:checkbox.indexOf(getSeat(x,y)) >= 0,unavailableSeat:booked.indexOf(getSeat(x,y)) >= 0}">-->
              <!--<input type="checkbox" :value="getSeat(x,y)" v-model="checkbox" v-show="false"-->
                     <!--:disabled="(booked.indexOf(getSeat(x,y)) >= 0)">-->
            <!--</label>-->
            <!--<label class="emptySeats" style="float: left"></label>-->
            <!--<label class="fullSeats" v-for="x in r_seats" style="float: left"-->
                   <!--v-bind:class="{selectedSeat:checkbox.indexOf(getSeat(x+l_seats,y)) >= 0,unavailableSeat:booked.indexOf(getSeat(x+l_seats,y)) >= 0}">-->
              <!--<input type="checkbox" :value="getSeat(x+l_seats,y)" v-model="checkbox" v-show="false"-->
                     <!--:disabled="(booked.indexOf(getSeat(x+l_seats,y)) >= 0)">-->
            <!--</label>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="container" v-bind:style="{ width:  ((l_seats+1+r_seats)*40 +35)+ 'px'}">-->
        <!--<div class="sideRow">-->
          <!--<div v-for="y in Array.from(new Array((r_rows-l_rows)), (x,i) => i + l_rows+1)">-->
            <!--<label class="emptySeats" v-for="x in (l_seats+1)" style="float: left"></label>-->
            <!--<label class="fullSeats" v-for="x in r_seats" style="float: left"-->
                   <!--v-bind:class="{selectedSeat:checkbox.indexOf(getSeat(x,y)) >= 0,unavailableSeat:booked.indexOf(getSeat(x,y)) >= 0}">-->
              <!--<input type="checkbox" :value="getSeat(x,y)" v-model="checkbox" v-show="false"-->
                     <!--:disabled="(booked.indexOf(getSeat(x,y)) >= 0)">-->
            <!--</label>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="container" v-bind:style="{ width:  ((l_seats+1+r_seats)*40 +35)+ 'px' }">-->
        <!--<div class="backRow">-->
          <!--<label v-for="x in (l_seats+1+r_seats)" style="float: left; margin:auto"-->
                 <!--v-bind:class="{selectedSeat:checkbox.indexOf(getSeat(x,r_rows+1)) >= 0,unavailableSeat:booked.indexOf(getSeat(x,r_rows+1)) >= 0}">-->
              <!--<input type="checkbox" :value="getSeat(x,r_rows+1)" v-model="checkbox" v-show="false"-->
                     <!--:disabled="(booked.indexOf(getSeat(x,r_rows+1)) >= 0)">-->
          <!--</label>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!--&lt;!&ndash;Ends here&ndash;&gt;-->

    <!--{{checkbox}}-->
  </div>
</template>

<script>
import VCard from "vuetify/es5/components/VCard/VCard";

export default {
  components: {VCard},
  name: 'home',
  data () {
    return {
      msg: 'Welcome to BookMySeat',

//    For bus seat management
    }
  },
  methods:{
    //For bus seat management
//    getSeat(x,y){
//      if (y<=this.l_rows){
//        return (y-1)*(this.l_seats+this.r_seats)+x;
//      }
//      else if (y<=this.r_rows){
//        return (this.l_rows)*(this.l_seats)+(y-1)*(this.r_seats)+x;
//      }
//      else{
//        return (this.l_rows)*(this.l_seats)+(this.r_rows)*(this.r_seats)+x;
//      }
//    },
//    getvals(){
//      console.log(this.r_rows,(this.r_rows+1),(this.r_rows+1)*40,(this.r_rows+1)*40 +125)
//    }
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

.backRow label {
  width: 40px;
  height: 40px;
  outline: 1px solid;
}

.sideRow div .fullSeats {
  width: 40px;
  height: 40px;
  outline: 1px solid;
}

.sideRow div .emptySeats {
  width: 40px;
  height: 40px;
}

.selectedSeat{
   background-color: green;
 }

.unavailableSeat{
  background-color: red;
}
</style>
