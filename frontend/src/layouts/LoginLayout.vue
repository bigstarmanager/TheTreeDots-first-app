<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer :width="500" show-if-above bordered>
      <q-img class="absolute-top" src="~assets/side-bannger.png" style="height: 100%">
        <div class="absolute-top bg-transparent">
          <div class="row">
            <div class="col-6" style="margin-left: 75px">
              <img src="~assets/treelog-logo.png" />
            </div>
          </div>

          <div class="row" style="margin-top: 20vh">
            <div class="col-7" style="margin-left: 75px">
              <div class="col" style="font-size: 32px">
                Try our trusted and flexible cold-chain logistic services, suited to your needs.
              </div>
            </div>
          </div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLoginLayout',
  data() {
    return {};
  }
};
</script>
