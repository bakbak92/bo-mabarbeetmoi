import { createRouter, createWebHistory } from 'vue-router'
//import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue")
    },
    {
      path: "/customers",
      name: "customers",
      component: () => import("../views/Customers.vue")
    },
    {
      path: "/orders",
      name: "orders",
      component: () => import("../views/Orders.vue")
    },
    {
      path: "/products",
      name: "products",
      component: () => import("../views/Products.vue")
    },
    {
      path: "/promos",
      name: "promos",
      component: () => import("../views/Promos.vue")
    },
    {
      path: "/delivery",
      name: "delivery",
      component: () => import("../views/Delivery.vue")
    },
    {
      path: "/category",
      name: "category",
      component: () => import("../views/Category.vue")
    },
    {
      path: "/products/:id",
      name: "product",
      component: () => import("../views/ProductItem.vue")
    },
    {
      path: "/customers/:id",
      name: "customer",
      component: () => import("../views/CustomerItem.vue")
    },
    {
      path: "/",
      redirect: to => {
        return {
          path: "/products"
        }
      }
    }
  ]
})

// const store = useUserStore()
// router.beforeEach(async (to, from, next) => {
//   const user = await store.logIn();
//   if(user === null && to.name !== "login"){
//       next({name: "login"});
//   }else{
//       next();
//   }
// })
export default router
