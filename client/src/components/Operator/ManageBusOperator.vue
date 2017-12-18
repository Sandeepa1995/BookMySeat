<template>
  <div class="manageBusOwner" style="width: 80%">
    <v-alert  color="warning" icon="info" transition="scale-transition" value="true" v-show="message.length>0">
      {{message}}
    </v-alert>
    <div class="container" style="background-color: white">
      <h4>{{ title }}</h4>
      <v-alert color="error" icon="warning" transition="scale-transition" value="true" v-show="listmessage.length>0">
        {{listmessage}}
      </v-alert>


      <v-card style="padding-bottom: 50px">
        <v-card-title>
          Operating Buses
          <v-spacer></v-spacer>
          <v-text-field
            append-icon="search"
            label="Search"
            single-line
            hide-details
            v-model="search"
          ></v-text-field>
        </v-card-title>
        <v-data-table
          v-bind:headers="headers"
          v-bind:items="buses"
          v-bind:search="search"
          hide-actions
          item-key="licence"
        >
          <template slot="items" slot-scope="props">
            <tr @click="props.expanded = !props.expanded">
              <td class="text-xs-right">{{ props.item.licence }}</td>
              <td class="text-xs-right">{{ props.item.type }}</td>
              <td class="text-xs-right">{{ props.item.owner }}</td>
              <td class="text-xs-right">{{ props.item.state }}</td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <v-layout row wrap>
            <v-flex xs6>
              <v-card flat>
                <v-card-text><p>Number of rows in the right column: <strong style="font-size: 14px">{{props.item.r_rows}}</strong></p>
                  <p>Number of seats per row in the right column: <strong style="font-size: 14px">{{props.item.r_seats}}</strong></p>
                  <p>Number of rows in the left column: <strong style="font-size: 14px">{{props.item.l_rows}}</strong></p>
                  <p>Number of seats per row in the left column: <strong style="font-size: 14px">{{props.item.l_seats}}</strong></p>
                </v-card-text>
              </v-card>
            </v-flex>

              <v-flex xs6>
                <v-btn block v-if="props.item.state ==='Waiting for your response'" color="success" dark @click="acceptBus(props.item.licence)">Accept Bus</v-btn>
                <v-btn block color="error" dark @click="rejectBus(props.item.licence)">Reject Bus/Resign from Bus</v-btn>
              </v-flex>
            </v-layout>
            <!--<v-card flat>-->
              <!--<v-card-text>{{props.item.r_rows}},{{props.item.l_rows}},{{props.item.r_seats}},{{props.item.l_seats}}</v-card-text>-->
            <!--</v-card>-->
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import VTextField from "vuetify/es5/components/VTextField/VTextField";
export default {
  components: {VTextField},
  name: 'manageBusOwner',
  data: () => ({
    user:JSON.parse(localStorage.getItem("user")),
    token:localStorage.getItem("token"),
    title: 'Manage the buses you operate',
    valid: true,
    validSelect: true,
    validNew: true,
    listmessage: 'Sorry no buses were found :(',
    message:'',
    dialog: false,
    validOperator: false,

    operator:JSON.parse(localStorage.getItem("user")).id,
    imageButton:"Upload Image",


    ImageUrl:null,
    filesURL:null,
    image:null,

    operatorType:true,

    buses:[],

    editing:false,
    editOpers:false,
    bus_state:"",
    orig_licence:'',

    tmp: '',
    search: '',
    pagination: {},
    headers: [
      {
        text: 'Licence Number',
        value: 'licence'
      },
      { text: 'Type', value: 'type' },
      { text: 'Owner', value: 'owner' },
      { text: 'State', value: 'state' }
    ],

    selectedBus: {
      license: '',
      type: '',
      seats: ''
    }

  }),
  computed: {
  },
  methods: {
    selectBus (license,type,rr,rs,lr,ls) {
      this.selectedBus.license = license;
      this.selectedBus.type = type;
      this.selectedBus.seats = (rr+1)*rs + (lr+1)*ls + 1;
      localStorage.setItem('selectedBus',JSON.stringify(this.selectedBus));
      this.$router.push('/addtrips');
    },

    getvals(){
      console.log(this.r_rows,(this.r_rows+1),(this.r_rows+1)*40,(this.r_rows+1)*40 +125)
    },

    acceptBus(lic){
      axios({
        method: 'post',
        url: 'http://localhost:3000/operator/acceptbus',
        data:{licence:lic},
        headers: {'Content-Type': 'application/json','Authorization':this.token}
      }).then((response) => {
        if(response.data.success){
          this.message = response.data.msg;
          location.reload();
        }
        else{
          this.message = response.data.msg;
        }
      })
        .catch(function (error) {
          console.log(error);
        });
    },

    rejectBus(lic){
      if (confirm("Are you sure you want to reject this bus? *This will remove this bus from the list") == true) {
        axios({
          method: 'post',
          url: 'http://localhost:3000/operator/rejectbus',
          data:{licence:lic},
          headers: {'Content-Type': 'application/json','Authorization':this.token}
        }).then((response) => {
          if(response.data.success){
            this.message = response.data.msg;
            location.reload();
          }
          else{
            this.message = response.data.msg;
          }
        })
          .catch(function (error) {
            console.log(error);
          });
      }

    },
    switchToEditOper(){
      if (confirm("Change the current Operator? *Please close the form if you decide not to midway") == true) {
        this.operator=["",""];
        this.editOpers=true;
//        this.validSelect= false;
//        this.validNew= false;
      }
    }
  },
  mounted(){
    console.log(this.operator);
    axios({
      method: 'post',
      url: 'http://localhost:3000/operator/managebus',
      data:{operator_id:this.operator },
      headers: {'Content-Type': 'application/json','Authorization':this.token}
    }).then((response) => {
//      console.log(JSON.stringify(response.data.buses));
      if(response.data.success){
        if(response.data.buses.length>0){
          this.listmessage="";
        }

        for (var bus in response.data.buses) {
          if(response.data.buses[bus].state==="waiting"){
            this.buses.push({
              licence:response.data.buses[bus].licence_no,
              type: response.data.buses[bus].type,
              r_rows:response.data.buses[bus].r_rows,
              l_rows:response.data.buses[bus].l_rows,
              r_seats:response.data.buses[bus].r_seats,
              l_seats:response.data.buses[bus].l_seats,
              state:"Waiting for your response",
              owner:response.data.buses[bus].owner_id+","+response.data.buses[bus].name
            })
          }
          else if (response.data.buses[bus].state!=="rejected"){
            this.buses.push({
              licence:response.data.buses[bus].licence_no,
              type: response.data.buses[bus].type,
              r_rows:response.data.buses[bus].r_rows,
              l_rows:response.data.buses[bus].l_rows,
              r_seats:response.data.buses[bus].r_seats,
              l_seats:response.data.buses[bus].l_seats,
              state:response.data.buses[bus].state,
              owner:response.data.buses[bus].owner_id+","+response.data.buses[bus].name
            })
          }
        }
        console.log(this.buses);
      }
    })
      .catch(function (error) {
        console.log(error);
      });
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

  .manageBusOwner{
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
</style>
