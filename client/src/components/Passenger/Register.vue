<template>
  <div class="register">
    <h4>{{ title }}</h4>
    <v-alert color="error" icon="warning" transition="scale-transition" value="true" v-show="message.length>0">
      {{message}}
    </v-alert>
    <v-form v-model="valid" ref="form">
      <v-text-field
        label="NIC Number"
        placeholder="19951170283V"
        :rules="nICRules"
        :counter="13"
        v-model="nIC"
        required
      ></v-text-field>
      <v-text-field
        label="Name"
        v-model="name"
        :rules="nameRules"
        :counter="60"
        required
      ></v-text-field>
      <v-text-field
        label="E-mail"
        v-model="email"
        :rules="emailRules"
        :counter="254"
        required
      ></v-text-field>
      <v-text-field
        label="Contact Number"
        v-model="contact"
        :rules="contactRules"
        placeholder="0771952458"
        :counter="10"
        required
      ></v-text-field>
      <v-text-field
        label="Password"
        v-model="password"
        ref="password"
        :rules="pWRules"
        :counter="15"
        type="password"
        required
      ></v-text-field>
      <v-text-field
        label="Confirm Password"
        v-model="confirmedPW"
        ref="confirmedPW"
        v-bind:counter="password.length"
        :rules="[() => !!confirmedPW || 'Please confirm the password entered above',
                () => confirmedPW==password || 'The entered passwords do not match'
        ]"
        type="password"
        required
      ></v-text-field>
      <v-btn
        @click="submit"
        :disabled="!valid"
      >
        submit
      </v-btn>
      <v-btn @click="clear">clear</v-btn>
    </v-form>
  </div>
</template>

<script>
  import axios from 'axios'
export default {
  name: 'register',
  data: () => ({
    title: 'Register to BookMySeat as a Passenger',
    valid: true,
    message: '',
    name: '',
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => v && v.length <= 60 || 'Name must be less than 60 characters'
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
      (v) => v && v.length <= 254 || 'Email must be less than 254 characters'
    ],
    nIC: '',
    nICRules: [
      (v) => !!v || 'NIC number is required',
      (v) => /^[0-9]{12}[V]$/.test(v) || 'The NIC entered must be valid in the new NIC format.'
    ],
    password: '',
    confirmedPW:'',
    pWRules: [
      (v) => !!v || 'Password is required',
      (v) => v && v.length <= 15 || 'Password must be less than 60 characters'
    ],
    contact: '',
    contactRules: [
      (v) => !!v || 'Contact number is required',
      (v) => /^[0-9]{10}$/.test(v) || 'The contact number be valid.'
    ]
  }),
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        axios({
          method: 'post',
          url: 'http://localhost:3000/passenger/register',
          data: {
            id:this.nIC,
            name: this.name,
            email:this.email,
            password:this.password,
            contact:this.contact
          },
          headers: {'Content-Type': 'application/json'}
        }).then((response)=> {
          console.log(response.data);
          if(!response.data.success){
            this.message=response.data.msg;
          }
          else {
            localStorage.setItem("message",response.data.msg);
            this.$router.push('/login');
          }
        })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    clear () {
      this.$refs.form.reset();
      this.message='';
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

  .home{
    text-align: center;
  }

</style>
