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
import ManageBusOperator from '@/components/Operator/ManageBusOperator'
import Reservation from '@/components/Reservation'

//Routes
import RoutesHome from '../components/Routes/RoutesHome.vue'
import NewRoute from '../components/Routes/NewRoute.vue'
import SearchRoutes from '../components/Routes/SearchRoutes.vue'
import SearchResults from '../components/Routes/SearchResults.vue'
import EditRoute from '../components/Routes/EditRoute.vue'

Vue.use(Router);

const router = new Router({
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
      path: '/owner/managebus',
      name: 'ManageBusOwner',
      component: ManageBusOwner
    },
    {
      path: '/operator/managebus',
      name: 'ManageBusOperator',
      component: ManageBusOperator
    },
    {
      path: '/routes',
      name: 'RoutesHome',
      component: RoutesHome
    },
    {
      path: '/routes/new',
      name: 'NewRoute',
      component: NewRoute
    },
    {
      path: '/routes/search',
      name: 'SearchRoutes',
      component: SearchRoutes
    },
    {
      path: '/routes/search/results',
      name: 'SearchResults',
      component: SearchResults
    },
    {
      path: '/routes/:id/edit',
      name: 'EditRoute',
      component: EditRoute
    },
    {
      path: '/reservation/:id',
      name: 'Reservation',
      component: Reservation
    }
  ]
})


router.beforeEach((to,from,next)=>{
  // console.log(to);
  if(to.meta.requiresAuth){
    var loggeduser= localStorage.getItem("user");
    console.log(loggeduser);
    if (loggeduser===null) {
      next();
    }
    else {
      console.log("A");
      next({path:'/'});
    }
    // next();
  }
  else {
    next();
  }
  next();
});

export default router;
