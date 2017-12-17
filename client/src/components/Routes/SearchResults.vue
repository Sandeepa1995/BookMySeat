<template>
  <div id="search-results">

    <v-container>

      <h3 id="title">{{title}}</h3>

      <v-card v-if="!available">
        <v-card-title>
          <div>
            <h5 id="no-results">Your search did not match any routes</h5>
          </div>
        </v-card-title>
      </v-card>



      <v-card v-for="result in results" :key="result">
        <v-card-title>
          <div style="width: 100%">
            <h3 class="headline mb-0">Route Number: <strong>{{result.routeNum}}</strong></h3>
            <div>Starting Point: <strong>{{result.routeStart}}</strong></div>
            <div>Ending Point: <strong>{{result.routeEnd}}</strong></div>

            <br/>

            <v-expansion-panel popout>
              <v-expansion-panel-content>
                <div slot="header">More</div>
                <div style="margin-left: 20px">Stopping Places (in order): </div>
                <div v-for="(stop, index) in result.routeStops">
                  <div style="margin-left: 75px">{{index+1}}. <strong>{{stop}}</strong></div>
                </div>
                <v-card-actions>
                  <v-btn
                    color="primary"
                    v-on:click="editRoute(result.routeID)"
                  >
                    Edit
                  </v-btn>

                  <v-btn
                    color="error"
                    v-on:click="deleteRoute(result.routeID)"
                  >
                    Delete
                  </v-btn>

                </v-card-actions>
              </v-expansion-panel-content>
            </v-expansion-panel>


          </div>
        </v-card-title>
      </v-card>

    </v-container>
  </div>
</template>

<script>
  import axios from 'axios'

  export default{
    name: "search-results",
    data(){
      return{
        title: "Search Results",
        results: [],
        available: true
      }
    },
    methods: {
      deleteRoute: (id)=>{
        axios({
          method: "post",
          url: "http://localhost:3000/routes/" + id + "/delete",
          data: {
            routeID: id
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((res)=>{
          console.log(res);
//          console.log(this);
//          this.$router.push("/routes/search");
          window.location.href = "/routes/";
        }).catch((error)=>{
          console.log(error)
        })
      },
      editRoute: (id)=>{
        axios({
          method: "get",
          url: "http://localhost:3000/routes/" + id + "/edit",
          data: {
            routeID: id
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((res)=>{
          console.log(res);
//          console.log(this);
          localStorage.setItem("routeToEdit", JSON.stringify(res.data.msg));
//          this.$router.push("/routes/" + id + "/edit");
          window.location.href = "/routes/" + id + "/edit";
        }).catch((error)=>{
          console.log(error)
        })
      }
    },
    mounted(){
      var recResults = JSON.parse(localStorage.getItem("searchResults"));

      if((typeof recResults) === "string"){
        this.results = [];
        this.available = false;
      } else{
        this.results = recResults;
        this.available = true;
      }
    }
  }


</script>

<style scoped>
  #title{
    text-align: center;
  }
  #no-results{
    color: gray;
  }
</style>
