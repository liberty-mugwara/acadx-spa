<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as store from 'src/store/modules';
import { setState } from 'src/helpers';
@Component
export default class App extends Vue {
  get loading(): boolean {
    return store.loader.loading;
  }

  get message(): string {
    return store.loader.message;
  }

  get notifications(): [string, string][] {
    return store.notifs.notifications;
  }

  @Watch('$route', { immediate: true, deep: true })
  onUrlChange() {
    setState('page/pagination', false);
    store.form.hideSuccess();
  }

  @Watch('loading')
  showOrHideLoader(newVal: boolean) {
    if (newVal && !this.$q.loading.isActive) {
      this.$q.loading.show({
        message: this.message,
      });
    } else if (!newVal && this.$q.loading.isActive) {
      this.$q.loading.hide();
    }
  }

  @Watch('notifications')
  showNotifications(newVal: [string, string][]) {
    if (newVal.length > 0) {
      const msg = this.notifications[this.notifications.length - 1][1];
      const type = this.notifications[this.notifications.length - 1][0];
      const position = type == 'info' ? 'bottom' : 'top';
      const dismissColor = type == 'warning' ? 'negative' : 'yellow';
      if (this.notifications) {
        this.$q.notify({
          message: msg,
          type: type,
          color: type,
          group: type,
          multiLine: true,
          position: position,
          actions: [
            {
              label: 'Dismiss',
              color: dismissColor,
              handler: () => {
                /* ... */
              },
            },
          ],
        });
      }
    }
  }
}
</script>
