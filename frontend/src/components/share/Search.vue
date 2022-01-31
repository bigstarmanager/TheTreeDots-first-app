<template>
  <div :class="classHeader">
    <div class="q-gutter-y-md column">
      <q-input
        color="teal"
        :dense="false"
        outlined
        :debounce="debounce"
        v-model="inputSearch"
        :placeholder="placeholder"
      >
        <template v-slot:append>
          <span class="material-icons" @click="pushOutput" style="font-weight: bold; color: black">
            search
          </span>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'commonSearch',
  data() {
    return {
      inputSearch: ''
    };
  },
  props: {
    placeholder: {
      type: String,
      default: 'Search'
    },
    classHeader: {
      type: String,
      default: ''
    },
    debounce: {
      type: String,
      default: '800'
    }
  },
  watch: {
    inputSearch(val) {
      this.$emit('outputSearch', val);
    }
  },
  methods: {
    pushOutput() {
      this.$emit('outputSearch', this.inputSearch);
    }
  }
};
</script>

<style lang="scss">
.q-field__control.relative-position.row.no-wrap.text-teal {
  height: 4vh;
}

.q-field__append.q-field__marginal.row.no-wrap.items-center {
  height: 100%;
}
</style>
