<template>
  <van-row justify="center" align="center" class="common-card">
    <van-col span="24">
      <div class="common-card_content">
        <van-button
          plain
          type="primary"
          size="small"
          @click.prevent="doIsAppInstall"
          >检测是否安装淘宝</van-button
        >
        <van-button plain type="primary" size="small" @click.prevent="doInstall"
          >下载并安装</van-button
        >
      </div>
      <van-popup
        v-model:show="isPopupVisible"
        closeable
        position="bottom"
        :style="{ height: '30%' }"
        :close-on-click-overlay="false"
        click-close-icon="doClosePopup"
      >
        <van-row class="common-row">
          <van-col span="16" offset="4">
            <p>开始下载: {{ packageName }}</p></van-col
          >
        </van-row>
        <van-row class="common-row" justify="center">
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
        <van-row class="common-row">
          <van-col span="16" offset="4"> <p>下载存放位置:</p></van-col>
        </van-row>
        <van-row class="common-row">
          <van-col span="16" offset="4">
            <p>{{ savedFileUrl }}</p></van-col
          >
        </van-row>
      </van-popup>
    </van-col>
  </van-row>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { Toast } from "vant";
import { isAppInstalled, checkFileExists } from "/@/utils/cordovaUtil";

export default defineComponent({
  name: "application",
  setup() {
    const data: any = reactive({
      percentage: 0,
      savedFileUrl: "xxx",
      isPopupVisible: false,
      packageName: "",
    });
    const doIsAppInstall = () => {
      isAppInstalled("com.taobao.taobao").then(
        () => {
          Toast({
            message: "淘宝已安装",
            duration: 2000,
            position: "bottom",
          });
          // 设置闹钟
          // {
          //     // "application": "com.taobao.taobao"
          //     action: "android.intent.action.SET_ALARM",
          //     noParse: true,
          //   },
          //   {
          //     "android.intent.extra.alarm.MESSAGE": "New Alarm",
          //     "android.intent.extra.alarm.HOUR": 17,
          //     "android.intent.extra.alarm.MINUTES": 30,
          //   }
          let sApp = startApp.set({
            application: "com.taobao.taobao",
          });
          sApp.start(
            function () {
              console.log("open success");
            },
            function (e: any) {
              console.log("------" + e);
              console.log("open error");
            }
          );
        },
        () => {
          Toast({
            message: "淘宝未安装",
            duration: 2000,
            position: "bottom",
          });
        }
      );
    };
    const doInstall = () => {
      let url = encodeURI(
        "https://fga1.market.xiaomi.com/download/AppStore/0b936227b8dba4fa9bae60fe8a624ad2454bcbadc/com.quark.browser.apk"
      );
      let index = url.lastIndexOf("/");
      let filename = url.substring(index + 1, url.length); // 文件名
      data.packageName = filename;
      //APP下载存放的路径，可以使用cordova file插件进行相关配置
      let targetPath = `${cordova.file.externalRootDirectory}indusec/user/cache/${filename}`;
      checkFileExists(targetPath).then(
        (result) => {
          console.log(result);
          Toast({
            message: `${filename}已存在, 即将进行安装`,
            duration: 2000,
            position: "bottom",
          });
          setTimeout(() => {
            // 文件存在，安装
            cordova.plugins.fileOpener2.open(
              targetPath,
              "application/vnd.android.package-archive",
              {
                error: function (e: any) {
                  console.log(
                    "Error status: " +
                      e.status +
                      " - Error message: " +
                      e.message
                  );
                },
                success: function () {
                  console.log("file opened successfully");
                },
              }
            );
          }, 2000);
        },
        (err) => {
          // 文件不存在，下载
          data.isPopupVisible = true;
          let fileTransfer = new FileTransfer();
          let progress = 0;
          fileTransfer.onprogress = function (e: any) {
            if (e.lengthComputable) {
              let datas = e.loaded / e.total;
              // 显示下载进度
              progress = parseFloat((datas * 100).toFixed(2));
              data.percentage = progress;
            }
          };
          fileTransfer.download(
            url,
            targetPath,
            (entry: any) => {
              data.savedFileUrl = entry.toURL();
              cordova.plugins.fileOpener2.open(
                targetPath,
                "application/vnd.android.package-archive",
                {
                  error: function (e: any) {
                    console.log(
                      "Error status: " +
                        e.status +
                        " - Error message: " +
                        e.message
                    );
                  },
                  success: function () {
                    console.log("file opened successfully");
                  },
                }
              );
            },
            (error: any) => {
              console.log(error);
              Toast({
                message: "下载异常！",
                duration: 2000,
                position: "bottom",
              });
            }
          );
        }
      );
    };
    const doClosePopup = () => {
      data.packageName = "";
      data.percentage = "";
      data.isPopupVisible = false;
    };
    return {
      ...toRefs(data),
      doIsAppInstall,
      doInstall,
      doClosePopup,
    };
  },
});
</script>
<style scoped>
.common-row {
  width: 100%;
  padding: 0 0 7px 0;
  text-align: left;
}
.common-row:nth-child(2) {
  text-align: center;
}
.common-row:first-child {
  padding-top: 14%;
}
.percentage {
  display: inline-block;
  height: 25px;
  line-height: 25px;
}
</style>
