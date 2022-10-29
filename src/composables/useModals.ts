import { defineStore } from 'pinia';
import { customAlphabet } from 'nanoid';
import { shallowRef, ref, nextTick, Component } from 'vue';

export interface IModal {
  name: string;
  show: boolean;
  attrs?: Record<string, unknown>;
  listeners?: Record<string, unknown>;
  component: Record<string, unknown>;
  compAttrs?: Record<string, unknown>;
  compListeners?: Record<string, unknown>;
}

export interface IModalOptions {
  name?: string;
  attrs?: Record<string, unknown>;
  listeners?: Record<string, unknown>;
  compAttrs?: Record<string, unknown>;
  compListeners?: Record<string, unknown>;
}

const generateId = customAlphabet(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  12
);

export const useModals = defineStore('modals', {
  state: () => {
    return {
      items: [] as IModal[],
    };
  },
  actions: {
    show(component: Component, options?: IModalOptions) {
      let name: string;

      if (options?.name !== undefined) {
        name = options.name;
      } else if (component.name !== undefined) {
        name = component.name;
      } else {
        name = 'dynamic_modal_' + generateId();
      }

      const modal = this.items.find((m) => m.name === name);

      if (modal === undefined) {
        const modalItem = {
          ...options,
          component: shallowRef(component),
          name,
          show: ref(false),
        };

        this.items.push(modalItem as unknown as IModal);

        void nextTick(() => {
          modalItem.show.value = true;
        });
      }
    },
    hide(name: string) {
      const modal = this.items.find((m) => m.name === name);

      if (modal !== undefined) {
        modal.show = true;
      }
    },
    remove(name?: string) {
      if (name === undefined) return;

      const index = this.items.findIndex((v) => v.name === name);

      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },
  },
});
