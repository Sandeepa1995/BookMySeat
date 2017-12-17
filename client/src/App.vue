<template>
  <v-app>
    <v-navigation-drawer v-model="sideNav" temporary="temporary">
      <v-list>
        <v-list-tile v-for="item in menuItems"
                     :key="item.title"
                      router
                     :to="item.link">
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
      <v-icon dark style="padding-left: 20px">event_seat</v-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">{{title}}</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems"
               :key="item.title"
               router
               :to="item.link">
          <v-icon left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>
        <v-btn flat v-show="loggable" @click="logout">
          <v-icon left>lock</v-icon>
          Logout
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

    <v-footer app>
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
        user: null
      }
    },
    computed:{
      menuItems(){
        let menuItems = [
          {icon: 'search', title: 'Search Buses',link: '/searchBus'},
          {icon:"supervisor_account", title:"Register",link:'/register'},   //Logged out nav components
          {icon:"lock_open", title:"Sign In",link:'/login'}
        ];
        if(localStorage.getItem("user")){
          var user=JSON.parse(localStorage.getItem("user"));
          if (user.type==="Bus Owner") {
            menuItems = [
              {icon: 'search', title: 'Search Buses',link: '/searchBus'},
              {icon: 'input', title: 'Add Trips',link: '/addtrips'},
              {icon:"directions_bus", title:"Manage Buses", link:'/owner/managebus'},
              {icon:"settings", title:"Options", link:'/settings'}   //Logged in nav components
            ]
          }
          else{
            menuItems = [
              {icon: 'search', title: 'Search Buses',link: '/searchBus'},
              {icon:"settings", title:"Options", link:'/settings'}    //Logged in nav components
            ]
          }
        }
        return menuItems
      },
      loggable(){
        if(localStorage.getItem("user")){
          return true
        }
        else{
          return false
        }
      }
    },
    mounted(){
      this.user=localStorage.getItem('user');
    },
    methods: {
      logout(){
        localStorage.setItem("token",null);
        localStorage.setItem("user",null);
        localStorage.clear();
//        localStorage.setItem("message","User logged out");
        this.$router.push('/');
        location.reload();
      }
    }
  }

</script>
