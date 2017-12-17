<template>
  <div class="manageBusOwner" style="width: 80%">
    <div class="container" style="background-color: white">
      <h4>{{ title }}</h4>
      <v-alert color="error" icon="warning" transition="scale-transition" value="true" v-show="message.length>0">
        {{message}}
      </v-alert>
      <div>
        <v-layout row justify-center>
          <v-dialog v-model="dialog" persistent max-width="500px">
            <v-btn slot="activator">Add new Bus</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">User Profile</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-text-field label="Legal first name" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field label="Legal last name" hint="example of persistent helper text"
                                    persistent-hint
                                    required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field label="Email" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field label="Password" type="password" required></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-select
                        label="Age"
                        required
                        :items="['0-17', '18-29', '30-54', '54+']"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-select
                        label="Interests"
                        multiple
                        autocomplete
                        chips
                        :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
                <v-btn color="blue darken-1" flat @click.native="dialog = false">Save</v-btn>
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
export default {
  name: 'manageBusOwner',
  data: () => ({
    title: 'Manage the buses you own',
    valid: true,
    message: 'Sorry no buses were found :(',
    dialog: false
  }),
  methods: {

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

</style>
