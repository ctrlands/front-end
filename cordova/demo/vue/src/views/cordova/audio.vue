<template>
  <van-row justify="center" class="common-card">
    <van-col span="24">
      <div class="common-card_content">
        <van-button plain type="primary" size="small" @click.prevent="doAudio"
          >开始录音</van-button
        >
      </div>
      <van-popup
        v-model:show="isPopupVisible"
        closeable
        position="bottom"
        class="common-popup"
        :style="{ height: '30%' }"
        :close-on-click-overlay="false"
        :safe-area-inset-bottom="safeArea"
        click-close-icon="doClosePopup"
      >
        <div class="common-popup_content">
          <van-row
            justify="center"
            align="bottom"
            style="height: 100%; padding-bottom: 23px"
          >
            <van-col span="24">
              <p v-show="audioStatus === 1">录音中<dot>...</dot></p>
            </van-col>
            <van-col span="24">
              <van-button
                plain
                type="primary"
                size="small"
                v-longtap="longtap"
                v-longtapEnd="longtapEnd"
                v-longtapCancel="longtapCancel"
                >长按录音, 松开结束</van-button
              >
              <van-button
                plain
                type="primary"
                size="small"
                @click.prevent="doPlayAudio"
                >播放</van-button
              >
            </van-col>
          </van-row>
        </div>
      </van-popup>
    </van-col>
  </van-row>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { Toast } from "vant";
import { takeAudio, stopAudio, playAudio } from "/@/utils/cordovaUtil";

export default defineComponent({
  name: "audio",
  setup() {
    const data = reactive({
      safeArea: true,
      isPopupVisible: false,
      audioStatus: 0, // 0 未录音, 1: 录音中, 2: 录音结束, 3: 录音异常, 4: 取消录音
      audioStartTime: 0, // 录音开始时间
      audioEndTime: 0, // 录音结束时间
      audioTime: 0, // 录音总时长
      maxAutioTime: 5, // 录音最大时长
      audioFilePath: "", // 录音文件地址
    });

    const doAudio = () => {
      data.isPopupVisible = true;
    };
    const doPlayAudio = () => {
      // file:///storage/emulated/0/indusec/user/cache/audio/1617174693404.mp3
      if (data.audioFilePath !== "") {
        playAudio(data.audioFilePath).then(
          () => {
            console.log("play audio success");
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        Toast({
          message: "暂未发现录音文件",
          position: "bottom",
          duration: 2000,
        });
      }
    };
    const longtap = () => {
      data.audioStartTime = new Date().getTime();
      console.log("开始：" + data.audioStartTime);
      data.audioStatus = 1;
      takeAudio().then(
        (filePath) => {
          if (data.audioStatus === 2) {
            console.log("录音文件保存地址：" + filePath);
            data.audioFilePath = filePath as string;
          }
        },
        (err) => {
          Toast({
            message: `${JSON.stringify(err)}`,
            position: "bottom",
            duration: 2000,
          });
        }
      );
    };
    const longtapEnd = () => {
      //e.preventDefault();
      data.audioEndTime = new Date().getTime();
      let total = data.audioEndTime - data.audioStartTime;
      // 计算分钟数后剩余的毫秒数
      let gap = total % (60 * 1000);
      data.audioTime = Math.round(gap / 1000);
      console.log("audioTime: " + data.audioTime);
      if (data.audioTime < 1) {
        Toast({
          message: "录音时间低于1s",
          position: "bottom",
          duration: 2000,
        });
        longtapCancel();
      } else if (data.audioTime >= 1) {
        stopAudio();
        data.audioStatus = 2;
        data.audioStartTime = 0;
        data.audioEndTime = 0;
        data.audioTime = 0;
      }
    };
    const longtapCancel = () => {
      console.log("longtapCancel");
      data.audioStatus = 4;
      stopAudio();
      data.audioStartTime = 0;
      data.audioEndTime = 0;
      data.audioTime = 0;
    };

    return {
      ...toRefs(data),
      doAudio,
      doPlayAudio,
      longtap,
      longtapEnd,
      longtapCancel,
    };
  },
});
</script>
<style scoped>
.common-popup_content {
  width: 100%;
  padding-top: 32px;
}
.row-item {
  display: inline-block;
  height: 23px;
  line-height: 23px;
}
dot {
  display: inline-block;
  height: 1em;
  line-height: 1;
  text-align: left;
  vertical-align: -0.25em;
  overflow: hidden;
}
dot::before {
  display: block;
  content: "...\A..\A.";
  white-space: pre-wrap;
  animation: dot 3s infinite step-start both;
}
@keyframes dot {
  33% {
    transform: translateY(-2em);
  }
  66% {
    transform: translateY(-1em);
  }
}
</style>
