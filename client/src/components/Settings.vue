<template>
  <div class="settings" style="width: 80%" >
    <v-alert color="warning" icon="info" transition="scale-transition" value="true" v-show="message.length>0">
      {{message}}
    </v-alert>
    <v-tabs dark fixed icons centered>
      <v-tabs-bar class="red darken-4">
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tabs-item href="profile">
          <v-icon>account_circle</v-icon>
          User Profile
        </v-tabs-item>
        <v-tabs-item href="changepass">
          <v-icon>swap_horiz</v-icon>
          Change Password
        </v-tabs-item>
        <v-tabs-item href="addoperator" v-show="user.type=='Bus Owner'">
          <v-icon>accessibility</v-icon>
          Add Operator
        </v-tabs-item>
        <v-tabs-item href="addowner" v-show="user.type=='NTC'">
          <v-icon>supervisor_account</v-icon>
          Add Owner
        </v-tabs-item>
      </v-tabs-bar>
      <v-tabs-items>
        <v-tabs-content id="profile">
          <v-card flat style="padding: 50px">
            <h6>Account Type: {{user.type}}</h6>
            <h6>E-Mail: {{user.email}}</h6>
            <v-form v-model="validDetails" ref="detailform">
              <v-text-field
                label="Name"
                v-model="name"
                :rules="nameRules"
                :counter="60"
                required
                :disabled="user.type=='NTC'"
              ></v-text-field>
              <v-text-field
                label="Contact Number"
                v-model="contact"
                :rules="contactRules"
                :counter="10"
                required
                :disabled="user.type=='NTC'"
              ></v-text-field>
              <v-btn
                v-show="user.type!='NTC'"
                @click="submitDetails"
                :disabled="!validDetails"
              >
                Changer user details
              </v-btn>
            </v-form>
          </v-card>
        </v-tabs-content>
        <v-tabs-content id="changepass">
          <v-card flat>
            <v-form v-model="valid" ref="form" style="padding: 50px">
              <v-text-field
                label="Old Password"
                v-model="oldpassword"
                ref="oldpassword"
                :rules="pWRules"
                :counter="60"
                type="password"
                required
              ></v-text-field>
              <v-text-field
                label="New Password"
                v-model="password"
                ref="password"
                :rules="pWRules"
                :counter="60"
                type="password"
                required
              ></v-text-field>
              <v-text-field
                label="Confirm New Password"
                v-model="confirmedPW"
                ref="confirmedPW"
                :counter="60"
                :rules="[() => !!confirmedPW || 'Please confirm the password entered above',
                () => confirmedPW==password || 'The entered passwords do not match'
                ]"
                type="password"
                required
              ></v-text-field>
              <v-btn
                @click="submitPassword"
                :disabled="!valid"
              >
                Change Password
              </v-btn>
            </v-form>
          </v-card>
        </v-tabs-content>
        <v-tabs-content id="addowner">
          <v-card flat style="padding: 50px" v-show="user.type=='NTC'">
            <v-form v-model="validOwner" ref="addownerform">
              <v-text-field
                label="Name"
                v-model="ownername"
                :rules="nameRules"
                :counter="60"
                required
              ></v-text-field>
              <v-text-field
                label="E-mail"
                v-model="owneremail"
                :rules="emailRules"
                :counter="254"
                required
              ></v-text-field>
              <v-btn
                @click="submitOwner"
                :disabled="!validOwner"
              >
                Add new Owner to the System
              </v-btn>
            </v-form>
          </v-card>
        </v-tabs-content>
        <v-tabs-content id="addoperator">
          <v-card flat style="padding: 50px" v-show="user.type=='Bus Owner'">
            <v-form v-model="validOperator" ref="addoperatorform">
              <v-text-field
                label="E-mail"
                v-model="operatoremail"
                :rules="emailRules"
                :counter="254"
                required
              ></v-text-field>
              <v-btn
                @click="submitOperator"
                :disabled="!validOperator"
              >
                Add new Bus Operator to the System
              </v-btn>
            </v-form>
          </v-card>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script>
  import axios from 'axios'
export default {
  name: 'settings',
  data () {
    return {
      user:JSON.parse(localStorage.getItem("user")),
      token:localStorage.getItem("token"),
      valid: true,
      validDetails: true,
      validOwner: true,
      validOperator: true,
      message: '',
      password: '',
      oldpassword: '',
      confirmedPW:'',
      pWRules: [
        (v) => !!v || 'Password is required',
        (v) => v && v.length <= 60 || 'Password must be less than 60 characters'
      ],
      name: '',
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) => v && v.length <= 60 || 'Name must be less than 60 characters'
      ],
      contact: '',
      contactRules: [
        (v) => !!v || 'Contact number is required',
        (v) => /^[0-9]{10}$/.test(v) || 'The contact number be valid.'
      ],
      ownername:'',
      owneremail:'',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
        (v) => v && v.length <= 254 || 'Email must be less than 254 characters'
      ],
      operatoremail:''

    }
  },
  mounted(){
    this.name=this.user.name;
    this.contact=this.user.contact;
  },
  methods: {
    submitPassword () {
      if (this.user.type === "Passenger") {
        if (this.$refs.form.validate()) {
          axios({
            method: 'post',
            url: 'http://localhost:3000/passenger/changepass',
            data: {
              email: this.user.email,
              password: this.oldpassword,
              newpass: this.password,
              type: "Passenger"
            },
            headers: {'Content-Type': 'application/json','Authorization':this.token}
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
      }
      else if (this.user.type === "NTC") {
        if (this.$refs.form.validate()) {
          axios({
            method: 'post',
            url: 'http://localhost:3000/ntc/changepass',
            data: {
              email: this.user.email,
              password: this.oldpassword,
              newpass: this.password
            },
            headers: {'Content-Type': 'application/json','Authorization':this.token}
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
      }
      else if (this.user.type === "Bus Owner") {
        if (this.$refs.form.validate()) {
          axios({
            method: 'post',
            url: 'http://localhost:3000/owner/changepass',
            data: {
              email: this.user.email,
              password: this.oldpassword,
              newpass: this.password
            },
            headers: {'Content-Type': 'application/json','Authorization':this.token}
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
      }
    },
    submitDetails () {
      if (this.user.type === "Passenger") {
        if (this.$refs.detailform.validate()) {
          axios({
            method: 'post',
            url: 'http://localhost:3000/passenger/changedetails',
            data: {
              email: this.user.email,
              contact: this.contact,
              name: this.name
            },
            headers: {'Content-Type': 'application/json','Authorization':this.token}
          }).then((response) => {
            console.log(response.data);
            if (!response.data.success) {
              this.message = response.data.msg;
              localStorage.setItem("user",JSON.stringify(response.data.user));
            }
            else {
              this.message = response.data.msg;
            }
          })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
      else if (this.user.type === "Bus Owner") {
        if (this.$refs.detailform.validate()) {
          axios({
            method: 'post',
            url: 'http://localhost:3000/owner/changedetails',
            data: {
              email: this.user.email,
              contact: this.contact,
              name: this.name
            },
            headers: {'Content-Type': 'application/json','Authorization':this.token}
          }).then((response) => {
            console.log(response.data);
            if (!response.data.success) {
              this.message = response.data.msg;
              localStorage.setItem("user",JSON.stringify(response.data.user));
            }
            else {
              this.message = response.data.msg;
            }
          })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    },
    submitOwner(){
      if (this.$refs.addownerform.validate()) {
        axios({
          method: 'post',
          url: 'http://localhost:3000/ntc/registerowner',
          data: {
            name: this.ownername,
            email:this.owneremail
          },
          headers: {'Content-Type': 'application/json','Authorization':this.token}
        }).then((response)=> {
          console.log(response.data);
          if(!response.data.success){
            this.message=response.data.msg;
          }
          else {
            this.message=response.data.msg;
          }
        })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    submitOperator(){
      if (this.$refs.addoperatorform.validate()) {
        axios({
          method: 'post',
          url: 'http://localhost:3000/owner/registeroperator',
          data: {
            email:this.operatoremail
          },
          headers: {'Content-Type': 'application/json','Authorization':this.token}
        }).then((response)=> {
          console.log(response.data);
          if(!response.data.success){
            this.message=response.data.msg;
          }
          else {
            this.message=response.data.msg;
          }
        })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
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

p{
  text-align: center;
}

  .home{
    text-align: center;
  }
</style>
