<template>
  <div>
    <q-select
      v-model="value"
      input-debounce="0"
      :options="options"
      @input="handleChange"
      dense
      borderless
      :style="width"
      :popup-content-style="width"
      popup-content-class="popupStyle"
      class="selectStyle"
      :disable="disable"
      :outlined="outlined"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>
<script>
export default {
  name: 'selectAssign',
  data() {
    return {
      options: [],
      value: null
    };
  },
  props: {
    dataProps: {
      type: Array,
      default() {
        return [];
      }
    },
    placeholder: {
      type: String,
      default: 'Single Select'
    },
    width: {
      type: String,
      default: 'width:50%'
    },
    defaultValue: {
      type: Object,
      default() {
        return {};
      }
    },
    keyName: {
      type: String,
      default: ''
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    dataProps(val) {
      this.options = val;
    },
    defaultValue(val) {
      this.value = val;
    }
  },
  computed: {},
  created() {
    if (this.dataProps) {
      this.options = this.dataProps;
      this.value = this.options[0];
    }
    if (this.defaultValue) {
      this.value = { ...this.defaultValue };
    }
  },
  methods: {
    handleChange(value) {
      if (this.keyName) {
        this.$emit('updateData', value, this.keyName);
      } else {
        this.$emit('updateData', value);
      }
    },
    filterFn(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.options = this.dataProps.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
      });
    }
  }
};
</script>
<style lang="scss">
.popupStyle {
  .q-item__label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.selectStyle {
  .q-field__append {
    transform: translateY(8px);
  }
}
</style>
