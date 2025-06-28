import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Lazy loading das views
const AuthView = () => import("../views/AuthView.vue");
const DashboardView = () => import("../views/DashboardView.vue");
const IncomeView = () => import("../views/IncomeView.vue");
const CreditCardsView = () => import("../views/CreditCardsView.vue");
const SubscriptionsView = () => import("../views/SubscriptionsView.vue");
const ServicesView = () => import("../views/ServicesView.vue");

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: AuthView,
    meta: { requiresGuest: true },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/income",
    name: "income",
    component: IncomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/credit-cards",
    name: "credit-cards",
    component: CreditCardsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/subscriptions",
    name: "subscriptions",
    component: SubscriptionsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/services",
    name: "services",
    component: ServicesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guards de navegação
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
