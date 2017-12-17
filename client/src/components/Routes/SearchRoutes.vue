<template>
  <div id="search-routes">

    <v-container grid-list-md>

      <v-layout row-wrap>

        <v-flex xs-12>

          <h3 id="title">{{title}}</h3>

          <v-card>

            <v-form v-model="valid" ref="form" id="search-form">

              <v-text-field
                label="Route Number"
                v-model="routeNum"
              ></v-text-field>

              <v-text-field
                label="City"
                v-model="city"
              ></v-text-field>

              <v-layout row justify-space-around>

                <v-btn
                  v-on:click="search"
                >
                  search
                  <v-icon>search</v-icon>
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
    name: 'search-routes',
    data(){
      return{
        title: "Search for Routes",
        routeNum: "",
        city: ""
      }
    },
    methods: {
      search(){
        if(this.routeNum==="" && this.city===""){
          alert("Please fill at least one criteria");
        } else{
          axios({
            method: "post",
            url: "http://localhost:3000/routes/search",
            data: {
              routeNum: this.routeNum,
              city: this.city,
            },
            headers: {
              'Content-Type': 'application/json'
            }
          }).then((res)=>{
            console.log(res);
            localStorage.setItem("searchResults", JSON.stringify(res.data.msg));
            console.log(this);
            this.$router.push("/routes/search/results");
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
  #search-form{
    margin: 20px;
    padding: 20px;
  }
  #search-routes{
    width: 75%;
  }

</style>
