<template>
  <div id="edit-route">

    <v-container>

      <h3 id="title">{{title}}</h3>

      <v-card>

        <v-form v-model="valid" ref="form" id="edit-route-form">

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

          <v-btn
            v-on:click="updateRoute"
            :disabled="!valid"
          >
            submit
          </v-btn>

          <v-btn
            v-on:click="clear"
          >
            clear
          </v-btn>
        </v-form>

      </v-card>

    </v-container>

  </div>
</template>

<script>
  import axios from 'axios'

  export default{
    name: 'new-route',
    data(){
      return{
        title: 'Edit Route',
        routeID: '',
        routeNum: '',
        routeStart: '',
        routeEnd: '',
        routeStops: '',
        valid: false,
//        recieved: true,
        rules: [
          (v) => !!v || 'This field is required'
        ]
      }
    },
    methods: {
      updateRoute(){
        if(this.routeNum==="" || this.routeStart==="" || this.routeEnd===""){
          alert("Please fill the required fields");
        } else{
          axios({
            method: "post",
            url: "http://localhost:3000/routes/" + this.routeID + "/edit",
            data: {
              routeID: this.routeID,
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
    },
    mounted(){
      var recRoute = JSON.parse(localStorage.getItem("routeToEdit"));

      if((typeof recResults) === "string"){

      } else{
        this.routeID = recRoute.routeID;
        this.routeNum = recRoute.routeNum;
        this.routeStart = recRoute.routeStart;
        this.routeEnd = recRoute.routeEnd;
        this.routeStops = recRoute.routeStops.join(" ");
      }
    }
  }

</script>

<style scoped>
  #title{
    text-align: center;
  }
  #edit-route-form{
    margin: 20px;
    padding: 20px;
  }

</style>
