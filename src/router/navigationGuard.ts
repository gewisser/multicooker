import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useDish } from 'stores/dish';
import { storeToRefs } from 'pinia';

export function beforeEach(/* store: Pinia */) {
  const dishStore = useDish();
  const { dishSources } = storeToRefs(dishStore);

  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    if (to.name === 'CookProcPg' && dishSources.value === 'new_dish') {
      next('/');
      return;
    }

    next();
  };
}
