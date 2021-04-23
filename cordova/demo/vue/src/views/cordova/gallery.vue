<template>
  <van-row justify="center" class="common-card">
    <van-col span="24">
      <div class="common-card_content">
        <van-button
          plain
          type="primary"
          size="small"
          @click.prevent="doOpenCamera"
          >打开相机</van-button
        >
        <van-button
          plain
          type="primary"
          size="small"
          @click.prevent="doOpenGallery"
          >选取图片并上传</van-button
        >
        <!-- <van-image width="100" height="100" :src="cameraSrc" /> -->
      </div>
      <van-popup
        v-model:show="isPopupVisible"
        closeable
        position="bottom"
        :style="{ height: '30%' }"
        :close-on-click-overlay="false"
        click-close-icon="doClosePopup"
      >
        <van-row class="common-row gallery" justify="center" align="center">
          <van-col span="12">
            <!-- <van-image :src="cameraSrc" width="100" height="100" radius="8" /> -->
            <img id="imageFile" style="width: 100px; height: 100px" />
          </van-col>
        </van-row>
        <van-row class="common-row progress" justify="center" align="center">
          <van-col span="12">
            <van-progress
              :percentage="percentage"
              stroke-width="23"
              :show-pivot="false"
            />
          </van-col>
          <van-col span="4">
            <span class="percentage">{{ percentage }}%</span>
          </van-col>
        </van-row>
      </van-popup>
    </van-col>
  </van-row>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { Toast } from "vant";
import { openCamera, openGallery } from "/@/utils/cordovaUtil";

export default defineComponent({
  name: "gallery",
  components: {},
  setup() {
    const data = reactive({
      cameraSrc: "",
      isPopupVisible: false,
      percentage: 0,
    });

    const doOpenCamera = () => {
      openCamera("", "base64", 1).then((result: any) => {
        console.log(result);
        data.cameraSrc = result.base64;
      });
    };
    const doClosePopup = () => {
      data.isPopupVisible = false;
      data.percentage = 0;
      data.cameraSrc = "";
    };
    const doOpenGallery = () => {
      setTimeout(() => {
        data.isPopupVisible = true;
      }, 300);
      openGallery(2).then((result: any) => {
        let elem: any = document.getElementById("imageFile");
        elem.src = result;
        console.log(result);

        let options = new FileUploadOptions(); // 上传参数
        options.fileKey = "uploadedfile"; // 文件key值
        options.fileName = result.substr(result.lastIndexOf("/") + 1);
        options.mimeType = "image/jpeg";

        let params: any = {};
        params.themeName = "upload";
        params.nowid = "10003";

        options.params = params; // 上传额外参数

        let url = encodeURI("http://192.168.191.1:3000/upload"); // 上传服务器地址
        let fileTransfer = new FileTransfer();
        let progress = 0;
        fileTransfer.onprogress = function (e: any) {
          if (e.lengthComputable) {
            let datas = e.loaded / e.total;
            // 显示上传进度
            progress = parseFloat((datas * 100).toFixed(2));
            data.percentage = progress;
          }
        };
        fileTransfer.upload(
          result, // 上传文件的url
          url,
          (entry: any) => {
            console.log(entry);
            Toast({
              message: "上传完成",
              duration: 2000,
              position: "bottom",
            });
          },
          (error: any) => {
            console.log(error);
            Toast({
              message: "上传异常！",
              duration: 2000,
              position: "bottom",
            });
          },
          options
        );
      });
    };

    return {
      ...toRefs(data),
      // onDeviceReady,
      doOpenCamera,
      doOpenGallery,
      doClosePopup,
    };
  },
});
</script>
<style scoped>
.common-row {
  width: 100%;
  height: 50%;
}
.progress {
  height: calc(50% - 40px);
}
.progress .percentage {
  line-height: 23px;
}
.gallery {
  padding: 18px 0;
}
</style>
