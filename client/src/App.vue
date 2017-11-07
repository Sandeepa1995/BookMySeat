<template>
  <v-app>
    <v-navigation-drawer v-model="sideNav" temporary="temporary">
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{item.title}}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark class="red darken-4">
      <v-toolbar-side-icon
      @click.native="sideNav=!sideNav"
      class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title">
          <v-icon left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <v-content>
        <v-container fluid>
          <v-slide-y-transition mode="out-in">
            <v-layout column align-center>
              <router-view></router-view>
            </v-layout>
          </v-slide-y-transition>
        </v-container>
      </v-content>
    </main>

    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    components: {
     },
    data () {
      return {
        sideNav:false,
        title: 'BookMySeat',
        menuItems: [
          {icon:"settings", title:"Settings"},
          {icon:"supervisor_account", title:"Register"},
          {icon:"lock_open", title:"Sign In"}
        ]
      }
    }
  }

</script>
