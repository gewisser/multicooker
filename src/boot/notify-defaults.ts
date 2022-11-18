import { Notify } from 'quasar';

Notify.setDefaults({
  position: 'top',
  timeout: 5000,
  progress: true,
});

Notify.registerType('success', {
  icon: 'app:check',
  color: 'positive',
});

Notify.registerType('error', {
  icon: 'app:error',
  color: 'negative',
});
