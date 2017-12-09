import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Common/Home'
import Register from '@/components/Passenger/Register'
import Login from '@/components/Common/Login'
import Settings from '@/components/Common/Settings'
import SearchBus from '@/components/SearchBus'
import Results from '@/components/Results'
import AddTrips from '@/components/AddTrips'
import ManageBusOwner from '@/components/Owner/ManageBusOwner'

Vue.use(Router);

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/searchBus',
      name: 'SearchBus',
      component: SearchBus
    },
    {
      path: '/results',
      name: 'Results',
      component: Results
    },
    {
      path: '/addtrips',
      name: 'AddTrips',
      component: AddTrips
    },
    {
      path: '/managebus_owner',
      name: 'ManageBusOwner',
      component: ManageBusOwner
    }
  ]
})
