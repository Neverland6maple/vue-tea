import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    name: "Home",
    component: Home,
  },{
    path: "/",
    redirect:"/home"
  },
  {
    path: "/list",
    name: "List",
    component: () =>
      import("../views/List.vue"),
  },{
    path: "/my",
    name: "My",
    component: () =>
      import("../views/My.vue"),
  },{
    path: "/cart",
    name: "Cart",
    component: () =>
      import("../views/Cart.vue"),
  },{
    path: "/search",
    name: "Search",
    component: () =>
      import("../views/Search.vue"),
      children:[
        {
          path: "",
          name: "Index",
          component: () =>
            import("../views/Search/Search-index.vue"),
        },{
          path: "list",
          name: "SearchList",
          component: () =>
            import("../views/Search/Search-list.vue"),
        },
      ],
  },{
    path: "/detail",
    name: "Detail",
    meta:{
      keepAlive:true
    },
    component: () =>
      import("../views/Detail.vue"),
  },{
    path: "/login",
    name: "Login",
    component: () =>
      import("../views/Login/Login.vue"),
  },{
    path: "/userLogin",
    name: "UserLogin",
    component: () =>
      import("../views/Login/UserLogin.vue"),
  },{
    path: "/register",
    name: "Register",
    component: () =>
      import("../views/Login/Register.vue"),
  },{
    path: "/recovery",
    name: "Recovery",
    component: () =>
      import("../views/Recovery/Recovery.vue"),
    children:[
        {
          path:"",
          name:'RecoveryIndex',
          component:()=>
            import("../views/Recovery/RecoveryIndex.vue")
        },{
          path:'btn/:tel',
          name:'Btn',
          component:()=>
            import("../views/Recovery/RecoveryBtn.vue")
        },
      ], 
  },{
    path:'/path',
    name:'Path',
    component:()=>
      import("../views/Path.vue"),
    children:[
      {
        path:'',
        name:'Path-index',
        component:()=>
          import("../views/path/Path-index.vue")
      },{
        path:'/path-list',
        name:'Path-list',
        component:()=>
          import("../views/path/Path-list.vue")
      }
    ]
  },{
    path:'/order',
    name:'Order',
    component:()=>
      import("../views/Order.vue")
  },{
    path:'/payment',
    name:'Payment',
    component:()=>
      import('../views/Payment.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to,from,next)=>{
  const nextRoute = ['Payment','Cart','Path','Order','pathIndex','path-list'];

  let userInfo = JSON.parse(localStorage.getItem('teaUserInfo'));

  if(nextRoute.indexOf( to.name as string) >= 0 ){
    if(!userInfo){
      console.log(1);
      router.push('/login');
      return;
    }
  }
  next()
})

export default router;
