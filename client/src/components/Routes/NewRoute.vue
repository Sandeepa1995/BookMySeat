<template>
  <div id="new-route">

    <v-container grid-list-md>

      <v-layout row wrap>

        <v-flex xs12>

          <h3 id="title">{{title}}</h3>

          <v-card>

            <v-form v-model="valid" ref="form" id="new-route-form">

              <v-text-field
                label="Route Number"
                v-model="routeNum"
                :rules="rules"
                required
              ></v-text-field>

              <v-text-field
                label="Starting Point"
                v-model="routeStart"
                :rules="rules"
                required
              ></v-text-field>

              <v-text-field
                label="Ending Point"
                v-model="routeEnd"
                :rules="rules"
                required
              ></v-text-field>

              <v-text-field
                label="Intermediate Stops"
                v-model="routeStops"
                placeholder="Insert the stops (if any) in order, separated by spaces"
                multiLine
              ></v-text-field>

              <v-layout row justify-space-around>
                <v-btn
                  v-on:click="addRoute"
                  :disabled="!valid"
                >
                  submit
                </v-btn>

                <v-btn
                  v-on:click="clear"
                >
                  clear
                </v-btn>

              </v-layout>

            </v-form>

          </v-card>

        </v-flex>

      </v-layout>

    </v-container>

  </div>
</template>

<script>
  import axios from 'axios'

  export default{
    name: 'new-route',
    data(){
      return{
        title: 'Add a New Route',
        routeNum: '',
        routeStart: '',
        routeEnd: '',
        routeStops: '',
        valid: false,
        rules: [
          (v) => !!v || 'This field is required'
        ]
      }
    },
    methods: {
      addRoute(){
        if(this.routeNum==="" || this.routeStart==="" || this.routeEnd===""){
          alert("Please fill the required fields");
        } else{
          axios({
            method: "post",
            url: "http://localhost:3000/routes/new",
            data: {
              routeNum: this.routeNum,
              routeStart: this.routeStart,
              routeEnd: this.routeEnd,
              routeStops: this.routeStops
            },
            headers: {
              'Content-Type': 'application/json'
            }
          }).then((res)=>{
            console.log(res);
            console.log(this);
            this.$router.push("/routes");
          }).catch((error)=>{
            console.log(error);
          })
        }
      },
      clear(){
        this.$refs.form.reset();
      }
    }
  }

</script>

<style scoped>
  #title{
    text-align: center;
  }
  #new-route{
    width: 75%;
  }
  #new-route-form{
    margin: 20px;
    padding: 20px;
  }
</style>
