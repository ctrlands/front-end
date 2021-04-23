<template>
  <van-row justify="center" class="common-card">
    <van-col span="24">
      <div class="common-card_content">
        <van-button
          plain
          type="primary"
          size="small"
          @click.prevent="getDeviceInfo"
          >设备信息</van-button
        >
      </div>
      <van-popup
        v-model:show="isPopupVisible"
        closeable
        position="bottom"
        class="common-popup"
        :style="{ height: '30%' }"
        :close-on-click-overlay="false"
        click-close-icon="doClosePopup"
      >
        <div class="common-popup_content">
          <ul>
            <li v-for="item in deviceInfo" :key="item">
              <p v-if="item.type !== 'available'">
                <van-row span="24">
                  <van-col span="12" class="row-item text-align__right"
                    >{{ item.desc }}:</van-col
                  >
                  <van-col span="12" class="row-item text-align__left">{{
                    item.value
                  }}</van-col>
                </van-row>
              </p>
            </li>
          </ul>
        </div>
      </van-popup>
    </van-col>
  </van-row>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { Toast } from "vant";

export default defineComponent({
  name: "deviceInfo",
  setup() {
    const data: any = reactive({
      isPopupVisible: false,
      deviceInfo: [],
    });

    // 获取设备信息
    const getDeviceInfo = () => {
      if (device) {
        data.isPopupVisible = true;
        const DATAS = new Map([
          ["available", "设备是否可用"],
          ["cordova", "设备cordova版本"],
          ["model", "设备型号"],
          ["platform", "设备操作系统名称"],
          ["uuid", "设备通用唯一标识符"],
          ["version", "设备操作系统版本"],
          ["manufacturer", "设备制造商"],
          ["isVirtual", "设备是否在模拟器上运行"],
          ["serial", "设备硬件序列号（串行）"],
        ]);
        let array = Object.keys(device).map(function (key) {
          return { type: key, value: device[key], desc: DATAS.get(key) };
        });
        data.deviceInfo = array;
      } else {
        Toast({
          message: "获取设备数据异常",
          duration: 2000,
          position: "bottom",
        });
      }
    };
    const doClosePopup = () => {
      data.isPopupVisible = false;
      data.deviceInfo = [];
    };

    return {
      ...toRefs(data),
      getDeviceInfo,
      doClosePopup,
    };
  },
});
</script>
<style scoped>
.common-popup_content {
  width: 100%;
  padding-top: 23px;
}
.common-popup_content ul {
  width: 100%;
}
.common-popup_content ul li {
  width: 100%;
}
.row-item {
  display: inline-block;
  height: 23px;
  line-height: 23px;
}
.text-align__right {
  text-align: right;
  padding-right: 3px;
}
.text-align__left {
  text-align: left;
  padding-left: 3px;
}
</style>
