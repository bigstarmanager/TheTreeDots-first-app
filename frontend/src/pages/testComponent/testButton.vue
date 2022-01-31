<template>
  <div>
    <div class="row">
      <div class="q-pa-md">
        <div>Button border disable</div>
        <q-btn :disabled="true" no-wrap dense no-caps padding="0.5rem" outline color="button-border-disable">
          <span>Regular Order</span>
        </q-btn>
      </div>
      <div class="q-pa-md">
        <div>Button border active</div>
        <q-btn :disabled="false" no-wrap dense no-caps padding="0.5rem" outline color="button-border-active">
          <span>Regular Order</span>
        </q-btn>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="q-pa-md">
        <div>Button fill disable</div>
        <q-btn :disabled="true" no-wrap dense no-caps padding="0.5rem" color="button-fill-disable">
          <span>Regular Order</span>
        </q-btn>
      </div>
      <div class="q-pa-md">
        <div>Button fill active</div>
        <q-btn :disabled="false" no-wrap dense no-caps padding="0.5rem" color="button-fill-active">
          <span>Regular Order</span>
        </q-btn>
      </div>
      <div class="q-pa-md">
        <div>Button fill warning</div>
        <q-btn :disabled="false" no-wrap dense no-caps padding="0.5rem" color="negative">
          <span>Regular Order</span>
        </q-btn>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="q-pa-md">
        <div>Button flat disable</div>
        <q-btn :disabled="true" no-wrap dense no-caps flat padding="0.5rem" color="color-disable">
          <span>Regular Order</span>
        </q-btn>
      </div>
      <div class="q-pa-md">
        <div>Button flat active</div>
        <q-btn :disabled="false" no-wrap dense no-caps flat padding="0.5rem" color="color-main">
          <span>Regular Order</span>
        </q-btn>
      </div>
      <div class="q-pa-md">
        <div>Button flat black</div>
        <q-btn :disabled="false" no-wrap dense no-caps flat padding="0.5rem" color="dark">
          <span>Regular Order</span>
        </q-btn>
      </div>
    </div>
    <hr />
    <div class="q-pa-md">
      <div class="row q-gutter-sm">
        <q-btn no-caps unelevated color="positive" @click="triggerPositive" label="Trigger 'positive'" />
        <q-btn no-caps unelevated color="negative" @click="triggerNegative" label="Trigger 'negative'" />
        <q-btn
          no-caps
          unelevated
          color="warning"
          text-color="dark"
          @click="triggerWarning"
          label="Trigger 'warning'"
        />
        <q-btn no-caps unelevated color="info" @click="triggerInfo" label="Trigger 'info'" />
        <q-btn no-caps unelevated color="grey-8" @click="triggerOngoing" label="Trigger 'ongoing' (v1.14+)" />
      </div>
    </div>
    <hr />
    <div class="q-pa-md">
      <q-btn color="purple" @click="showLoading" label="Show Loading" />
    </div>
    <hr />

    <q-option-group v-model="status" :options="options" color="option-fill-active" inline />
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          label: 'Not Started',
          value: 2
        },
        {
          label: 'In Progress',
          value: 3
        },
        {
          label: 'Completed',
          value: 4
        }
      ],
      status: 3
    };
  },
  methods: {
    triggerPositive() {
      this.$q.notify({
        type: 'positive',
        position: 'top',
        message: `This is a "positive" type notification.`
      });
    },

    triggerNegative() {
      this.$q.notify({
        type: 'negative',
        position: 'top',
        message: `This is a "negative" type notification.`
      });
    },

    triggerWarning() {
      this.$q.notify({
        type: 'warning',
        position: 'top',
        message: `This is a "warning" type notification.`
      });
    },

    triggerInfo() {
      this.$q.notify({
        type: 'info',
        position: 'top',
        message: `This is a "info" type notification.`
      });
    },

    triggerOngoing() {
      // we need to get the notification reference
      // otherwise it will never get dismissed ('ongoing' type has timeout 0)
      const notif = this.$q.notify({
        type: 'ongoing',
        position: 'top',
        message: 'Looking up the search terms...'
      });

      // simulate delay
      setTimeout(() => {
        notif({
          type: 'positive',
          position: 'top',
          message: 'Found the results that you were looking for',
          timeout: 1000
        });
      }, 4000);
    },
    // loading
    showLoading() {
      this.$q.loading.show();

      // hiding in 2s
      this.timer = setTimeout(() => {
        this.$q.loading.hide();
        this.timer = void 0;
      }, 2000);
    }
  },
  beforeDestroy() {
    if (this.timer !== void 0) {
      clearTimeout(this.timer);
      this.$q.loading.hide();
    }
  }
};
</script>

<style></style>
