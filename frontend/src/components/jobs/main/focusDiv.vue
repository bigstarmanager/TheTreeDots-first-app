<template>
  <div :class="isFocus ? 'active' : 'unActive'" v-on:click="changeColor">
    <span>
      {{ $splitString(titleProps, 15) }}
      <q-tooltip v-if="titleProps && titleProps.length > 15">
        {{ titleProps }}
      </q-tooltip>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modalTitle: '',
      isSHowModal: false,
      isFocus: false
    };
  },
  components: {},
  props: {
    titleProps: {
      type: String,
      default: ''
    }
  },
  methods: {
    changeColor() {
      this.isFocus = !this.isFocus;
      this.$emit('isFocus', this.isFocus);
    }
  }
};
</script>

<style lang="scss" scoped>
.active {
  padding: 8px 10px;
  height: 40px;
  width: 90%;
  background: #04565a;
  /* Color/Cyan */
  border: 2px solid #04565a;
  box-sizing: border-box;
  border-radius: 4px;

  span {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height, or 111% */
    letter-spacing: 0.32px;
    /* Color/White */
    color: #ffffff;
  }
}

.unActive {
  padding: 8px 10px;
  height: 40px;
  width: 90%;
  background: white;
  /* Color/Cyan */
  border: 2px solid #94959b;
  box-sizing: border-box;
  border-radius: 4px;

  span {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height, or 111% */
    letter-spacing: 0.32px;
    /* Color/White */
    color: black;
  }
}
</style>
>
