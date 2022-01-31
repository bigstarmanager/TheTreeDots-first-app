<template>
  <div class="q-pa-md" style="margin: 0px !important; max-width: 300px; display: flex; padding: 0">
    <div class="col-4">
      <!-- delivery time -->
      <div class="q-gutter-y-md">
        <div class="row no-wrap items-center">
          <!-- <span class="q-mr-sm">From</span> -->
          <q-input
            input-class="text-center"
            outlined
            dense
            v-model="timeStart"
            class="custom-input"
            @click="openTimeStartPopup"
            mask="##:## AM"
            readonly
            placeholder="From"
            :rules="[(val) => true]"
            style="width: 5vw"
          >
            <template v-slot:append>
              <div name="access_time" class="cursor-pointer append--modify">
                <q-popup-proxy
                  ref="qTimeStartProxy"
                  transition-show="scale"
                  transition-hide="scale"
                  @hide="onSelectStartTime"
                  :offset="[50, 20]"
                >
                  <q-card class="time-card">
                    <q-card-section>
                      <div class="flex items-center justify-center q-gutter-x-sm">
                        <q-select
                          class="hours-select"
                          v-model="hourStart"
                          :options="HOURS_LIST"
                          borderless
                          input-class="time-select"
                        >
                        </q-select>
                        <q-select
                          class="hours-select"
                          v-model="minuteStart"
                          :options="MINUTES_LIST"
                          borderless
                        >
                          <template v-if="minuteStart === null" v-slot:selected>
                            <div class="text-grey-6">
                              <q-icon name="remove" />
                              <q-icon name="remove" />
                            </div>
                          </template>
                        </q-select>
                        <div class="flex column items-center justify-center am-pm">
                          <div
                            @click="timeStartFormat = 'AM'"
                            class="cursor-pointer"
                            :class="[{ 'am-pm--active': timeStartFormat === 'PM' }]"
                          >
                            AM
                          </div>
                          <div
                            @click="timeStartFormat = 'PM'"
                            class="cursor-pointer"
                            :class="[{ 'am-pm--active': timeStartFormat === 'AM' }]"
                          >
                            PM
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-popup-proxy>
              </div>
            </template>
          </q-input>

          <q-icon
            style="margin-bottom: 18px; margin-left: 13px; margin-right: 12px"
            name="remove"
            class="q-mx-md"
          />

          <q-input
            style="width: 5vw"
            ref="refEndTime"
            input-class="text-center"
            outlined
            dense
            v-model="timeEnd"
            class="custom-input"
            @click="openTimeEndPopup"
            mask="##:## AM"
            placeholder="To"
            readonly
            :rules="[
              (val) => {
                return timeStart
                  ? parseInt(convertTime12to24(val).replace(':', '')) >=
                      parseInt(convertTime12to24(timeStart).replace(':', '')) ||
                      'End time must be higher than start time'
                  : true;
              }
            ]"
          >
            <template v-slot:append>
              <div name="access_time" class="cursor-pointer q-pl-0">
                <q-popup-proxy
                  ref="qTimeEndProxy"
                  transition-show="scale"
                  transition-hide="scale"
                  :offset="[-20, 20]"
                >
                  <q-card class="time-card">
                    <q-card-section>
                      <div class="flex items-center justify-center q-gutter-x-sm" style="width: 150px">
                        <q-select class="hours-select" v-model="hourEnd" :options="HOURS_LIST" borderless>
                        </q-select>
                        <q-select class="hours-select" v-model="minuteEnd" :options="MINUTES_LIST" borderless>
                        </q-select>
                        <div class="flex column items-center justify-center am-pm">
                          <div
                            @click="timeEndFormat = 'AM'"
                            class="cursor-pointer"
                            :class="[{ 'am-pm--active': timeEndFormat === 'PM' }]"
                          >
                            AM
                          </div>
                          <div
                            @click="timeEndFormat = 'PM'"
                            class="cursor-pointer"
                            :class="[{ 'am-pm--active': timeEndFormat === 'AM' }]"
                          >
                            PM
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-popup-proxy>
              </div>
            </template>
          </q-input>

          <q-icon
            name="mdi-close-circle-outline"
            size="sm"
            class="cursor-pointer"
            @click="clearValue"
            style="margin-bottom: 20px; opacity: 0.6"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { convertTime12to24, convertTime24to12, convertTime24to12Items } from 'src/utils/function';
import { HOURS_LIST, MINUTES_LIST } from 'src/constants/jobs';

export default {
  data() {
    return {
      timeStart: null,
      minuteStart: '00',
      hourStart: '12',
      timeStartFormat: 'AM',
      timeEnd: null,
      timeEndFormat: 'AM',
      hourEnd: '12',
      minuteEnd: '00',
      HOURS_LIST,
      MINUTES_LIST
    };
  },
  watch: {
    timeStart(val) {
      this.updateValue();
    },
    timeEnd(val) {
      this.updateValue();
    },
    hourStart(val) {
      this.timeStartCombine();
    },
    minuteStart(val) {
      this.timeStartCombine();
    },
    timeStartFormat(val) {
      this.timeStartCombine();
    },
    hourEnd(val) {
      this.timeEndCombine();
    },
    minuteEnd(val) {
      this.timeEndCombine();
    },
    timeEndFormat() {
      this.timeEndCombine();
    }
  },
  methods: {
    convertTime12to24,
    convertTime24to12,
    convertTime24to12Items,
    openTimeStartPopup() {
      this.$refs.qTimeStartProxy.show();
      this.isAutoUpdateTime = true;
    },
    openTimeEndPopup() {
      this.$refs.qTimeEndProxy.show();
      this.isAutoUpdateTime = true;
    },
    timeStartCombine() {
      if (!this.isAutoUpdateTime) return;
      this.timeStart = this.hourStart + ':' + this.minuteStart + ' ' + this.timeStartFormat;
    },
    timeEndCombine() {
      if (!this.isAutoUpdateTime) return;
      this.timeEnd = this.hourEnd + ':' + this.minuteEnd + ' ' + this.timeEndFormat;
    },
    onSelectStartTime() {
      if (this.timeEnd) {
        this.$refs.refEndTime.validate();
      }
    },
    updateValue() {
      if (!!this.timeStart && !!this.timeEnd) {
        this.$emit('updateData', this.timeStart, this.timeEnd);
      }
    },
    clearValue() {
      this.timeStart = null;
      this.timeEnd = null;
    }
  }
};
</script>

<style scoped lang="scss">
.q-field--outlined.q-field--readonly .q-field__control:before {
  border-style: solid !important;
}

.q-menu.q-position-engine.scroll {
  top: 73px;
  left: 24px !important;
}
</style>
