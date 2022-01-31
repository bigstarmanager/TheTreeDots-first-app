<template>
  <modalCommon
    v-model="visible"
    :modalTitle="'Create batch job'"
    :bodyStyle="'height: 25vh'"
    @cancel="handleCancel"
  >
    <template #content>
      <div class="content">
        <template v-if="loading">
          <q-spinner color="primary" size="3em" />
        </template>

        <h6>{{ text }}</h6>

        <div class="action">
          <q-btn color="red" :size="'medium'" @click="handleCancel" v-if="!loading"> Cancel </q-btn>
          <q-btn color="teal" :size="'medium'" @click="loading ? cancelSubmit() : handleOk()">
            {{ loading ? 'Dismiss' : 'Confirm' }}
          </q-btn>
        </div>
      </div>
    </template>
  </modalCommon>
</template>

<script>
import { SITE_CONFIG } from 'src/config/site.config';

export default {
  name: 'modalCreateBatchJob',
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  computed: {
    visible: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit('update:input', val);
      }
    }
  },
  data() {
    return {
      SITE_CONFIG,
      text: '',
      loading: false,
      timeOut: null
    };
  },
  created() {
    this.text = 'You will be creating a batch job for 3 job(s)';
  },
  methods: {
    handleOk(e) {
      console.log('e ::: ', e);
      this.loading = true;
      this.text = 'Batch job #10021 is processing. You will see the batch job once its completed';
      this.timeOut = setTimeout(() => {
        if (this.loading) {
          this.$emit('update:show', false);
          this.loading = false;
        }
      }, 3000);
    },
    cancelSubmit() {
      this.loading = false;
    },
    handleCancel(e) {
      console.log('e ::: ', e);
      this.$emit('update:show', false);
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  text-align: center;
  h3 {
    margin: 24px 0;
  }
  .action {
    button {
      margin: 0 4px;
    }
  }
}
</style>
