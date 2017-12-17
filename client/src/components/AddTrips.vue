<template>
  <v-container>
    <v-flex xs12 class="mt-3">
      <h3 class="text-xs-center mt-1">Add New Trips</h3>
    </v-flex>
    <v-layout>
      <v-flex md8 offset-md2>
        <v-alert
          color="error"
          icon="warning"
          value="true"
          v-show="failed">
          There is an error in the server.
        </v-alert>
        <v-alert
          color="warning"
          icon="warning"
          value="true"
          v-show="exists">
          The details you entered are already in our database. Please recheck the input.
        </v-alert>
        <v-alert
          color="success"
          icon="check_circle"
          value="true"
          v-show="success">
          Trip added successfully.
        </v-alert>
        <v-form v-model="valid" ref="form" lazy-validation>
          <!--<v-select-->
          <!--label="License"-->
          <!--v-model="license"-->
          <!--:items="items"-->
          <!--:rules="[v => !!v || 'License is required']"-->
          <!--required-->
          <!--&gt;</v-select>-->
          <v-text-field
            label="License Number"
            disabled
            v-model="license"
            :rules="[v => !!v || 'License is required.']"
            required
          ></v-text-field>
          <v-select
          label="Route"
          v-model="route"
          :items="items"
          :change="getDestination()"
          :rules="[v => !!v || 'Route is required']"
          required
          ></v-select>
          <!--<v-text-field-->
            <!--v-model="route"-->
            <!--label="Route"-->
            <!--:rules="[v => !!v || 'Route is required.']"-->
            <!--required-->
          <!--&gt;</v-text-field>-->
          <v-text-field
            label="Start Location"
            v-model="start"
            disabled
            :rules="[v => !!v || 'Start Location is required.']"
            required
          ></v-text-field>
          <v-text-field
            label="End Location"
            v-model="end"
            disabled
            :rules="[v => !!v || 'End Location is required.']"
            required
          ></v-text-field>
          <v-menu
            lazy
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            full-width
            :nudge-right="40"
            max-width="290px"
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              label="Departure Time"
              v-model="time"
              append-icon="update"
              readonly
              required
            ></v-text-field>
            <v-time-picker
              v-model="time"
              autosave
              format="24hr"></v-time-picker>
          </v-menu>
          <v-text-field
            label="Bus Type"
            disabled
            v-model="type"
            :rules="[v => !!v || 'Bus type is required.']"
            required
          ></v-text-field>
          <!--<v-select-->
            <!--label="Bus Type"-->
            <!--v-model="type"-->
            <!--:items="items"-->
            <!--append-icon="donut_large"-->
            <!--:rules="[v => !!v || 'Bus type is required']"-->
            <!--required-->
          <!--&gt;</v-select>-->
          <v-text-field
            label="Number of Seats"
            disabled
            v-model="seats"
            :rules="[v => !!v || 'Number of seats is required.']"
            required
          ></v-text-field>

          <!--<v-checkbox-->
            <!--label="Do you agree?"-->
            <!--v-model="checkbox"-->
            <!--:rules="[v => !!v || 'You must agree to continue!']"-->
            <!--required-->
          <!--&gt;</v-checkbox>-->

          <v-btn
            @click="submit"
            :disabled="!valid">
            submit
          </v-btn>
          <v-btn
            @click="clear"
            dark>clear</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>


</template>

<script>

  // From Departure time Removed v-model="menu2"
  import VForm from "vuetify/src/components/VForm/VForm";
  const axios = require('axios');
  export default {
    components: {VForm},
    data() {
      return {
        user:JSON.parse(localStorage.getItem("user")),
        token:localStorage.getItem("token"),
        failed: false,
        exists: false,
        success: false,
        valid: true,

//        id: '',
        license: '',
        route: '',
        start: '',
        end: '',
        type: '',
        time: '',
        seats: '',
        selected: '',
        items: [],
      }
    },
    mounted(){
      this.selected = JSON.parse(localStorage.getItem('selectedBus'));
      this.license = this.selected.license;
      this.type = this.selected.type;
      this.seats = this.selected.seats;
      this.getRoute();

    },
    methods: {
      getRoute () {
        axios({
          method: 'post',
          url: 'http://localhost:3000/owner/getRoute',
          data: {},
          headers: {'Content-Type':'application/json'}
        }).then((res) => {
            if(res.data.success === true){
              var x = res.data.output
              for(var j in x){
                this.items.push(x[j].route_num)
              }
            }
        }).catch((error) => {
          console.log(error);
        })
      },

      getDestination () {
        if(this.route != ''){
          axios({
            method: 'post',
            url: 'http://localhost:3000/owner/getDest',
            data: {
              route: this.route
            },
            headers: {'Content-Type':'application/json'}
          }).then((res) => {
            var x = res.data.output;
            this.start = x[0].start;
            this.end = x[0].end;
          }).catch((error) => {
            console.log(error);
          })
        }
      },

      submit () {
        if (this.$refs.form.validate()) {
          axios({
            method: 'post',
            url: 'http://localhost:3000/owner/newtrip',
            data:{
//              id: this.id,
              license: this.license,
              route: this.route,
              start: this.start,
              end: this.end,
              type: this.type,
              time: this.time,
              seats: this.seats
            },
            headers: {'Content-Type':'application/json','Authorization':this.token}
          }).then((res) => {
            console.log(res.data);
            if(res.data.output === 'Failed'){
//              this.failed = true;
              this.failed = true;
              this.exists = false;
              this.success = false;
            }
            else if(res.data.output === 'Exists'){
              this.failed = false;
              this.exists = true;
              this.success = false;
            }
            else if(res.data.output === 'Successful'){
//              this.success = true;
              this.failed = false;
              this.exists = false;
              this.success = true;
            }
          }).catch((err) => {

          });
        }
      },

      clear () {
        this.$refs.form.reset();
        this.failed = false;
        this.exists = false;
        this.success = false

      }
    }
  }
</script>

<!--<v-text-field-->
<!--label="Trip ID"-->
<!--v-model="id"-->
<!--required-->
<!--&gt;</v-text-field>-->

<!--<v-text-field-->
<!--label="Time of Departure"-->
<!--v-model="time"-->
<!--:rules="[v => !!v || 'Time is required.']"-->
<!--required-->
<!--&gt;</v-text-field>-->
