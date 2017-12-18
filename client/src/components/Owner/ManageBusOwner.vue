<template>
  <div class="manageBusOwner" style="width: 80%">
    <v-alert  color="warning" icon="info" transition="scale-transition" value="true" v-show="message.length>0">
      {{message}}
    </v-alert>
    <div class="container" style="background-color: white">
      <h4 style="color: black">{{ title }}</h4>
      <v-alert color="error" icon="warning" transition="scale-transition" value="true" v-show="listmessage.length>0">
        {{listmessage}}
      </v-alert>


      <v-card style="padding-bottom: 50px">
        <v-card-title>
          Owned Buses
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
              <td class="text-xs-right">{{ props.item.operator }}</td>
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
                <!--<v-card-actions>-->
                  <!--<v-btn-->
                    <!--v-on:click="selectBus(props.item.licence,props.item.type,props.item.r_rows,props.item.r_seats,props.item.l_rows,props.item.l_seats)"-->
                  <!--&gt;Add Trip</v-btn>-->
                <!--</v-card-actions>-->
              </v-card>
            </v-flex>

              <v-flex xs6>
                <v-btn block
                       color="success"
                       v-on:click="selectBus(props.item.licence,props.item.type,props.item.r_rows,props.item.r_seats,props.item.l_rows,props.item.l_seats)"
                       dark>Add Trips</v-btn>
                <v-btn block color="warning" dark @click="editBus(props.item.licence)">Edit Bus</v-btn>
                <v-btn block color="error" dark @click="deleteBus(props.item.licence)">Delete Bus</v-btn>
              </v-flex>
            </v-layout>
            <!--<v-card flat>-->
              <!--<v-card-text>{{props.item.r_rows}},{{props.item.l_rows}},{{props.item.r_seats}},{{props.item.l_seats}}</v-card-text>-->
            <!--</v-card>-->
          </template>
        </v-data-table>
      </v-card>


      <!--Add new bus-->
      <div>
        <v-layout row justify-center>
          <v-dialog v-model="dialog" persistent max-width="1000px">
            <v-btn slot="activator">Add new Bus</v-btn>
            <v-card>
              <!--<v-card-title>-->
                <!--<span class="headline">Add New Bus</span>-->
              <!--</v-card-title>-->
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-form v-model="valid" ref="form">
                    <v-flex xs12>
                      <v-text-field label="Licence Number"
                                    :rules="licRules"
                                    :counter="10"
                                    v-model="licence"
                                    required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-select
                        label="Type"
                        required
                        v-model="bus_type"
                        :rules="typeRules"
                        :items="['Luxury', 'Semi-Luxury', 'AC', 'Normal']"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 style="margin-top: 20px">
                      <hr>
                      <v-subheader style="padding-left: 0px; margin-left: 0px; margin-top: 15px; height: 25px; font-size: 20px"> Seat structure</v-subheader>
                    </v-flex>
                    <v-flex xs12>
                      <v-layout row wrap>
                      <v-flex xs9>
                        <v-slider label="Right side: rows" v-bind:max="40" v-bind:min="l_rows" v-model="r_rows" required></v-slider>
                      </v-flex>
                      <v-flex xs2>
                        <v-text-field v-model="r_rows" type="number" v-bind:max="40" v-bind:min="l_rows"></v-text-field>
                      </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12>
                      <v-layout row wrap>
                        <v-flex xs9>
                          <v-slider label="Right side: seats" v-bind:max="6-l_seats" v-bind:min="1" v-model="r_seats" required></v-slider>
                        </v-flex>
                        <v-flex xs2>
                          <v-text-field v-model="r_seats" v-bind:max="6-l_seats" v-bind:min="1" type="number"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12>
                      <v-layout row wrap>
                        <v-flex xs9>
                          <v-slider label="Left side: rows" v-bind:max="r_rows" v-bind:min="2" v-model="l_rows" required></v-slider>
                        </v-flex>
                        <v-flex xs2>
                          <v-text-field v-model="l_rows" type="number" v-bind:max="r_rows" v-bind:min="2"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12>
                      <v-layout row wrap>
                        <v-flex xs9>
                          <v-slider label="Left side: seats" v-bind:max="6-r_seats" v-bind:min="0" v-model="l_seats" required></v-slider>
                        </v-flex>
                        <v-flex xs2>
                          <v-text-field v-model="l_seats" v-bind:max="6-r_seats" v-bind:min="0" type="number"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    *The Number of Seats in the back will be the sum of the number in the left row and right row +1.
                    The number of rows in the right side will always be greater than or equal to the rows in the left side.
                    The maximum sum of seats in the left row and right row will be 8 and at least the right row must have 1 seat.
                    The Seat structure is shown below.

                    <!--Seat display starts here-->
                    <v-flex xs12>
                    <span align="center">
                    <div class="container" style="border: 10px solid; padding-top: 40px;"
                         v-bind:style="{ width:  ((l_seats+1+r_seats)*40 +95)+ 'px', height:  ((r_rows+1)*40 +125)+ 'px' }">
                      <div class="container" v-bind:style="{ width:  ((l_seats+1+r_seats)*40 +35)+ 'px' }">
                        <div class="sideRow">
                          <div v-for="y in (l_rows)">
                            <label class="fullSeats" v-for="x in (l_seats)" style="float: left">
                            </label>
                            <label class="emptySeats" style="float: left"></label>
                            <label class="fullSeats" v-for="x in r_seats" style="float: left">
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="container" v-bind:style="{ width:  ((l_seats+1+r_seats)*40 +35)+ 'px'}">
                        <div class="sideRow">
                          <div v-for="y in Array.from(new Array((r_rows-l_rows)), (x,i) => i + l_rows+1)">
                            <label class="emptySeats" v-for="x in (l_seats+1)" style="float: left"></label>
                            <label class="fullSeats" v-for="x in r_seats" style="float: left">
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="container" v-bind:style="{ width:  ((l_seats+1+r_seats)*40 +35)+ 'px' }">
                        <div class="backRow">
                          <label v-for="x in (l_seats+1+r_seats)" style="float: left; margin:auto">
                          </label>
                        </div>
                      </div>
                    </div>
                      </span>
                    </v-flex>
                    <!--Ends here-->

                      <!--image-->
                    <!--<v-flex xs12 style="margin-top: 20px">-->
                      <!--<hr>-->
                      <!--<v-subheader style="padding-left: 0px; margin-left: 0px; margin-top: 15px; height: 25px; font-size: 20px">Image</v-subheader>-->
                      <!--<p>*A clear image properly showing the features of the bus so that the passengers can identify the bus.</p>-->
                    <!--</v-flex>-->
                      <!--<v-flex xs12>-->
                        <!--<div class="row" align="center">-->
                          <!--<img v-if="ImageUrl!=null" :src="ImageUrl" style="max-width: 100%; max-height: 100%">-->
                        <!--</div>-->
                      <!--</v-flex>-->
                      <!--<v-flex xs12>-->
                        <!--<v-layout justify-center row>-->
                        <!--<v-btn raised class="Primary" @click="onPickFile" >{{imageButton}}</v-btn>-->
                        <!--<input-->
                          <!--type="file"-->
                          <!--style="display: none"-->
                          <!--ref="fileInput"-->
                          <!--accept="image/*"-->
                          <!--@change="onFilePicked">-->
                        <!--</v-layout>-->
                      <!--</v-flex>-->

                    <!--<v-flex xs12 style="margin-top: 20px">-->
                      <!--<hr>-->
                      <!--<v-subheader style="padding-left: 0px; margin-left: 0px; margin-top: 15px; height: 25px; font-size: 20px">Add Trips</v-subheader>-->
                    <!--</v-flex>-->

                    <v-flex xs12 style="margin-top: 20px">
                      <hr>
                      <v-subheader style="padding-left: 0px; margin-left: 0px; margin-top: 15px; height: 25px; font-size: 20px">Operator</v-subheader>
                      <v-flex xs12 style="margin-top: 20px" v-if="(editing)&&(!editOpers)">
                        <p style="font-size: 17px; text-align: center">Operator: {{operator[0]}},{{operator[1]}}</p>
                        <v-btn block color="warning" dark @click="switchToEditOper">Update Operator</v-btn>
                      </v-flex>
                      <v-switch :label="operatorMessage"
                                v-model="operatorType"
                                :disabled="operators.length===0"
                                color="red darken-3"
                                hide-details
                                v-if="(!editing)||(editOpers)"
                                style="margin-left: 50px; margin-top: 20px"
                                @change="operatorChange">

                      </v-switch>
                    </v-flex>
                    </v-form>
                    <v-flex xs12 v-if="(!editing)||(editOpers)">
                      <v-form v-model="validSelect" ref="formSelect">
                        <v-card flat style="padding: 50px; height: 230px" v-show="!operatorType">
                          <v-select
                            v-bind:items="operators"
                            v-model="operator"
                            label="Operator ID, Name"
                            append-icon="person"
                            hide-details
                            :rules="selectRules"
                          ></v-select>
                        </v-card>
                      </v-form>
                      <v-form v-model="validNew" ref="formNew">
                      <v-card flat style="padding: 50px; height: 230px" v-show="operatorType">
                        <v-text-field
                          label="E-mail"
                          v-model="operatoremail"
                          :rules="emailRules"
                          :counter="254"
                          required
                        ></v-text-field>
                        <p>*Will add a new operator into the system.</p>
                      </v-card>
                      </v-form>
                    </v-flex>

                  </v-layout>
                </v-container>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="dialog = false" @click="closeForm">Close</v-btn>
                <v-btn color="blue darken-1" flat @click="clearForm">Clear</v-btn>
                <v-btn color="blue darken-1"
                       v-if="(!editing)"
                       flat @click.native="dialog = false" @click="addNewBus"
                       :disabled="(!valid)||(((!validNew)&&(operatorType))||((!validSelect)&&(!operatorType)))"
                >Add Bus</v-btn>
                <v-btn color="blue darken-1"
                       v-if="(editing)"
                       flat @click.native="dialog = false" @click="updateBus"
                       :disabled="((editOpers)&&((!valid)||(((!validNew)&&(operatorType))||((!validSelect)||(!operatorType)))))&&((!editOpers)&&((!valid)))"
                >Update Bus</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
      </div>
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
    title: 'Manage the buses you own',
    valid: true,
    validSelect: true,
    validNew: true,
    listmessage: 'Sorry no buses were found :(',
    message:'',
    dialog: false,
    r_rows:10,
    l_rows:8,
    r_seats:2,
    l_seats:2,
    licence:"",
    bus_type:"",
    validOperator: false,
    licRules: [
      (v) => !!v || 'Licence is required',
      (v) => v && v.length <=10  || 'Name must be less than 10 characters',
      (v) => /^[A-Z]{2,3}[-][0-9]{4}$/.test(v) || 'The NIC entered must be valid in the new NIC format.'
    ],
    typeRules: [
      (v) => !!v || 'Bus Type is required'
    ],
    selectRules: [
      (v) => !!v || 'Bus operator is required'
    ],
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
      (v) => v && v.length <= 254 || 'Email must be less than 254 characters'
    ],

    operatoremail:'',
    owner:JSON.parse(localStorage.getItem("user")).id,
    operator:['',''],
    operators:[],
    imageButton:"Upload Image",


    ImageUrl:null,
    filesURL:null,
    image:null,

    operatorType:true,
    operatorMessage:'Select existing operator as the operator',

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
      { text: 'Operator', value: 'operator' },
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
    onPickFile(){
      this.$refs.fileInput.click();
    },
    onFilePicked(event){
      const files=event.target.files;
      const fileReader = new FileReader();
//      let filename=files[0].name;
//      if (filename.lastIndexOf('.') <=0){
//        return alert('Please upload a valid file!')
//      }
      if(files[0]!=undefined) {
        this.imageButton='Upload different image';
        fileReader.addEventListener('load', () => {
          this.ImageUrl = fileReader.result;
//          console.log(fileReader.result)
        });
        fileReader.readAsDataURL(files[0]);
        this.image = files[0];

        const formData = new FormData();

        // append the files to FormData
        formData.append('asd', files[0]);
        console.log(formData.get('asd'));
      }
    },
    operatorChange(){
      if (!this.operatorType){
        this.operatorMessage='Select existing operator or owner as the operator';
      }
      else {
        this.operatorMessage='Add new operator';
      }
    },
//    aaaaa(){
//      console.log(this.operator);
//    },
    addNewBus(){
      if (this.$refs.form.validate()) {
        if((this.validNew)&&(this.operatorType)) {
          axios({
            method: 'post',
            url: 'http://localhost:3000/owner/newopnbus',
            data: {
              licence: this.licence,
              type: this.bus_type,
              r_rows: this.r_rows,
              l_rows: this.l_rows,
              r_seats: this.r_seats,
              l_seats: this.l_seats,
              photo: this.ImageUrl,
              owner: this.owner,
              email:this.operatoremail
            },
            headers: {'Content-Type': 'application/json','Authorization':this.token}
          }).then((response)=> {
            console.log(response.data);
            if(!response.data.success){
              this.message=response.data.msg;
              location.reload();
            }
            else {
              this.message=response.data.msg;
            }
          })
            .catch(function (error) {
              console.log(error);
            });

//          axios({
//            method: 'post',
//            url: 'http://localhost:3000/owner/addbus',
//            data: {
//              licence: this.licence,
//              type: this.type,
//              r_rows: this.r_rows,
//              l_rows: this.l_rows,
//              r_seats: this.r_seats,
//              l_seats: this.l_seats,
//              photo: this.ImageUrl,
//              owner: this.owner,
//              operator: this.operator[0]
//            },
//            headers: {'Content-Type': 'multipart/form-data' ,'Authorization':this.token}
//          }).then((response) => {
//            console.log(response.data);
//            this.message = response.data.msg;
//          })
//            .catch(function (error) {
//              console.log(error);
//            });
        }
        else if ((this.validSelect)&&(!this.operatorType)){
          axios({
            method: 'post',
            url: 'http://localhost:3000/owner/addbus',
            data: {
              licence: this.licence,
              type: this.bus_type,
              r_rows: this.r_rows,
              l_rows: this.l_rows,
              r_seats: this.r_seats,
              l_seats: this.l_seats,
              photo: JSON.stringify(this.image),
              owner: this.owner,
              operator: this.operator[0]
            },
            headers: {'Content-Type': 'application/json','Authorization':this.token}
          }).then((response) => {
            console.log(response.data);
            this.message = response.data.msg;
            location.reload();
          })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    },
    editBus(lic){
      this.editing=true;          //Set to false later in update
      axios({
        method: 'post',
        url: 'http://localhost:3000/owner/getbus',
        data:{licence:lic},
        headers: {'Content-Type': 'application/json','Authorization':this.token}
      }).then((response) => {
        if(response.data.success){
//          console.log([response.data.bus.operator_id,response.data.bus.name]);
          this.licence=response.data.bus.licence_no;
          this.orig_licence=response.data.bus.licence_no;
            this.operatorType=false;
            this.bus_type= response.data.bus.type;
            this.r_rows=response.data.bus.r_rows;
            this.l_rows=response.data.bus.l_rows;
            this.r_seats=response.data.bus.r_seats;
            this.l_seats=response.data.bus.l_seats;
            this.operator=[response.data.bus.operator_id,response.data.bus.name];
            this.bus_state=response.data.bus.state;

          this.dialog=true;
        }
      })
        .catch(function (error) {
          console.log(error);
        });
    },
    deleteBus(lic){
      if (confirm("Are you sure you want to delete this bus? *This will delete assigned trips as well") == true) {
        axios({
          method: 'post',
          url: 'http://localhost:3000/owner/deletebus',
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
    },
    updateBus(){
      console.log(this.orig_licence);
      if (this.$refs.form.validate()) {
        if(!this.editOpers){
          axios({
            method: 'post',
            url: 'http://localhost:3000/owner/editbus',
            data: {
              licence: this.licence,
              orig_licence: this.orig_licence,
              type: this.bus_type,
              r_rows: this.r_rows,
              l_rows: this.l_rows,
              r_seats: this.r_seats,
              l_seats: this.l_seats,
              photo: JSON.stringify(this.image),
              owner: this.owner,
              operator: this.operator[0],
              state: this.bus_state
            },
            headers: {'Content-Type': 'application/json', 'Authorization': this.token}
          }).then((response) => {
            console.log(response.data);
            this.message = response.data.msg;
            location.reload();
          })
            .catch(function (error) {
              console.log(error);
            });
        }
        else {
          if ((this.validNew) && (this.operatorType)) {
            axios({
              method: 'post',
              url: 'http://localhost:3000/owner/editopnbus',
              data: {
                licence: this.licence,
                orig_licence: this.orig_licence,
                type: this.bus_type,
                r_rows: this.r_rows,
                l_rows: this.l_rows,
                r_seats: this.r_seats,
                l_seats: this.l_seats,
                photo: this.ImageUrl,
                owner: this.owner,
                email: this.operatoremail,
                state: 'waiting'
              },
              headers: {'Content-Type': 'application/json', 'Authorization': this.token}
            }).then((response) => {
              console.log(response.data);
              if (!response.data.success) {
                this.message = response.data.msg;
              }
              else {
                this.message = response.data.msg;
              }
            })
              .catch(function (error) {
                console.log(error);
              });
          }
          else if ((this.validSelect) && (!this.operatorType)) {
            axios({
              method: 'post',
              url: 'http://localhost:3000/owner/editbus',
              data: {
                licence: this.licence,
                orig_licence: this.orig_licence,
                type: this.bus_type,
                r_rows: this.r_rows,
                l_rows: this.l_rows,
                r_seats: this.r_seats,
                l_seats: this.l_seats,
                photo: JSON.stringify(this.image),
                owner: this.owner,
                operator: this.operator[0],
                state: 'waiting'
              },
              headers: {'Content-Type': 'application/json', 'Authorization': this.token}
            }).then((response) => {
              console.log(response.data);
              this.message = response.data.msg;
              location.reload();
            })
              .catch(function (error) {
                console.log(error);
              });
          }
        }
      }
      this.editOpers=false;
      this.editing=false;
    },
    closeForm(){
      this.editOpers=false;
      this.editing=false;
    },
    clearForm(){
      this.licence="";
      this.bus_type= "";
      this.r_rows=10;
      this.l_rows=8;
      this.r_seats=2;
      this.l_seats=2;
      this.operator=["",""];
    }
  },
  mounted(){
    axios({
      method: 'post',
      url: 'http://localhost:3000/owner/managebus',
      data:{owner_id:this.owner },
      headers: {'Content-Type': 'application/json','Authorization':this.token}
    }).then((response) => {
//      console.log(JSON.stringify(response.data.buses));
      if(response.data.success){
        for (var oper in response.data.operators) {
          this.operators.push([response.data.operators[oper].operator_id,response.data.operators[oper].name])
        }

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
              state:"Waiting for Operator's response",
              operator:response.data.buses[bus].operator_id+","+response.data.buses[bus].name
            })
          }
          else if(response.data.buses[bus].state==="rejected"){
            this.buses.push({
              licence:response.data.buses[bus].licence_no,
              type: response.data.buses[bus].type,
              r_rows:response.data.buses[bus].r_rows,
              l_rows:response.data.buses[bus].l_rows,
              r_seats:response.data.buses[bus].r_seats,
              l_seats:response.data.buses[bus].l_seats,
              state:"Assigned operator rejected the Bus. Reassign the operator.",
              operator:response.data.buses[bus].operator_id+","+response.data.buses[bus].name
            })
          }
          else{
            this.buses.push({
              licence:response.data.buses[bus].licence_no,
              type: response.data.buses[bus].type,
              r_rows:response.data.buses[bus].r_rows,
              l_rows:response.data.buses[bus].l_rows,
              r_seats:response.data.buses[bus].r_seats,
              l_seats:response.data.buses[bus].l_seats,
              state:response.data.buses[bus].state,
              operator:response.data.buses[bus].operator_id+","+response.data.buses[bus].name
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
