<template>
  <van-row justify="center" class="common-card">
    <van-col span="24">
      <div class="common-card_content">
        <p>读写权限{{ rwPermission }}</p>
        <p>{{ fileStatus }}</p>
        <p>{{ rootFilePath }}</p>
        <van-button
          plain
          type="primary"
          size="small"
          @click="getAndroidPermission"
          >文件读写权限申请</van-button
        >
        <van-button plain type="primary" size="small" @click="doCreateFile"
          >创建文件夹</van-button
        >
        <van-button plain type="primary" size="small" @click="rwFileFullPath"
          >创建文件夹</van-button
        >
        <van-button
          plain
          type="primary"
          size="small"
          @click="doDowlnload('', '文件下载测试', '')"
          >下载文件</van-button
        >
      </div>
    </van-col>
  </van-row>
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
        <van-col span="16" offset="4">
          <p class="saveFilePath">下载存放位置:</p></van-col
        >
      </van-row>
      <van-row class="common-row">
        <van-col span="16" offset="4">
          <p class="saveFilePath">{{ savedFileUrl }}</p></van-col
        >
      </van-row>
    </div>
  </van-popup>
</template>

<script lang="ts">
import { Toast } from "vant";
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  name: "file",
  setup() {
    const data: any = reactive({
      percentage: 0,
      isPopupVisible: false,
      savedFileUrl: "",
      rwPermission: "",
      fileStatus: "",
      rootFilePath: "",
    });

    const doClosePopup = () => {
      data.isPopupVisible = false;
      data.savedFileUrl = "";
    };

    // android权限检测
    const getAndroidPermission = () => {
      // https://github.com/NeoLSN/cordova-plugin-android-permissions/issues/72
      // 好像有一个bug, 即使赋予权限status.hasPermission也返回false, 修复了?
      let permission = cordova.plugins.permissions;
      // 需要检测的权限
      let list = [
        permission.READ_EXTERNAL_STORAGE,
        permission.WRITE_EXTERNAL_STORAGE,
      ];
      // 成功
      let success = (status: any) => {
        // let val = window.localStorage.getItem("hasCreatedFile");
        // if (!val) {
        //   createFile();
        // }
        // if (status.hasPermission) {
        // }
        data.rwPermission = status;
      };
      // 失败
      let error = (error: any) => {
        console.log(error);
        data.rwPermission = error;
      };
      permission.requestPermissions(list, success, error);
    };

    const rwFile = (
      fileName: string,
      secondFile: string,
      thirdFile: string
    ) => {
      let rootFilePath = cordova.file.externalRootDirectory; // sd卡根目录
      window.resolveLocalFileSystemURL(
        rootFilePath,
        function (entry: any) {
          entry.getDirectory(
            fileName,
            { create: true },
            function (dirEntry: any) {
              dirEntry.getDirectory(
                secondFile,
                { create: true },
                function (subDirEntry: any) {
                  subDirEntry.getDirectory(
                    thirdFile,
                    { create: true },
                    function (thirdDirEntry: any) {
                      console.log("创建成功");
                      data.rootFilePath = `${rootFilePath}/${fileName}/${secondFile}/${thirdFile}`;
                      // window.localStorage.setItem("hasCreatedFile", "true");
                    },
                    onErrorGetDir
                  );
                },
                onErrorGetDir
              );
            },
            onErrorGetDir
          );
        },
        errorCallback
      );
      function onErrorGetDir(err: any) {
        console.log(err);
        console.log("文件夹创建失败！");
      }
      function errorCallback(e: any) {
        console.log(e);
        console.log("文件夹创建失败！");
      }
    };
    // 根据fullPath创建文件夹
    /**
     * 根据fullPath创建文件夹
     * @param: path{string}, eg: 'file1/file2/file3'
     */
    const createFile = (path: string, entry: DirectoryEntry) => {
      if (path.indexOf("/") < 0) {
        entry.getDirectory(
          path,
          { create: true },
          (prevEntry: any) => {
            console.log("创建成功");
            return;
          },
          (err) => {
            console.log(err);
            console.log("文件夹创建失败！");
          }
        );
      }
      let arr = path.split("/");
      let remove = arr.shift();
      let result = arr.filter((item) => item !== remove);
      let nextArrPath = result.toString().replace(/,/g, "/");
      if (nextArrPath !== "") {
        entry.getDirectory(
          remove as string,
          { create: true },
          (prevEntry: any) => {
            return createFile(nextArrPath, prevEntry);
          },
          (err) => {
            console.log(err);
            console.log("文件夹创建失败！");
          }
        );
      }
    };
    const rwFileFullPath = () => {
      let rootFilePath = cordova.file.externalRootDirectory; // sd卡根目录
      window.resolveLocalFileSystemURL(
        rootFilePath,
        function (entry: any) {
          createFile("test1/test2/test3/test4", entry);
          // entry.getDirectory(
          //   "indusec/user/cache/audio",
          //   { create: true },
          //   function (dirEntry: any) {
          //     dirEntry.getDirectory(
          //       "indusec/user/cache/audio",
          //       { create: true },
          //       function (xx: any) {
          //         console.log(xx);
          //         console.log("create full path");
          //       },
          //       onErrorGetDir
          //     );
          //   },
          //   onErrorGetDir
          // );
        },
        errorCallback
      );
      // function onErrorGetDir(err: any) {
      //   console.log(err);
      //   console.log("文件夹创建失败！");
      // }
      function errorCallback(e: any) {
        console.log(e);
        console.log("文件夹创建失败！");
      }
    };
    const doCreateFile = () => {
      var permissions = cordova.plugins.permissions;
      //校验app是否有安卓写入权限
      permissions.checkPermission(
        permissions.WRITE_EXTERNAL_STORAGE,
        function (permission: any) {
          //hasPermission 验证是否成功
          if (!permission.hasPermission) {
            //没有权限
            let errorCallback = function () {
              console.log("没有存储权限！");
              // alert('Storage permission is not turned on');
            };
            //app申请写入权限
            permissions.requestPermission(
              permissions.WRITE_EXTERNAL_STORAGE,
              function (permission: any) {
                if (permission.hasPermission) {
                  //申请成功后
                  // coding here
                  rwFile("indusec", "user", "cache");
                } else {
                  //申请失败，给予提示
                  errorCallback();
                  console.log("请求写入权限失败");
                }
              },
              function (error: any) {
                errorCallback();
                console.log(error);
                console.log("请求写入权限失败");
              }
            );
          } else {
            //拥有权限 coding
            rwFile("indusec", "user", "cache");
          }
        },
        function (error: any) {
          console.log(error);
          console.log("请求写入权限失败");
        }
      );
    };

    const doDowlnload = () => {
      data.percentage = 0;
      data.isPopupVisible = true;
      let url = encodeURI("http://192.168.191.1:3000/default/file.zip");
      let index = url.lastIndexOf("/");
      let filename = url.substring(index + 1, url.length); // 文件名
      //APP下载存放的路径，可以使用cordova file插件进行相关配置
      let targetPath = `${cordova.file.externalRootDirectory}indusec/user/cache/${filename}`;
      let fileTransfer = new FileTransfer();
      fileTransfer.onprogress = function (e: any) {
        if (e.lengthComputable) {
          let datas = e.loaded / e.total;
          // 显示下载进度
          data.percentage = parseFloat((datas * 100).toFixed(2));
        }
      };
      fileTransfer.download(
        url,
        targetPath,
        (entry: any) => {
          data.savedFileUrl = entry.toURL();
        },
        (error: any) => {
          console.log(error);
          Toast({
            message: "下载网络异常或文件不存在",
            position: "bottom",
            duration: 2000,
          });
        }
      );
    };

    return {
      ...toRefs(data),
      doCreateFile,
      doDowlnload,
      getAndroidPermission,
      doClosePopup,
      rwFileFullPath,
    };
  },
});
</script>
<style scoped>
::v-deep(.van-progress) {
  margin-top: 1px;
}
.percentage {
  height: 25px;
  line-height: 25px;
  display: inline-block;
}
.common-row {
  width: 100%;
  padding-top: 7px;
}
.text-align__right {
  text-align: right;
  padding-right: 3px;
}
.text-align__left {
  text-align: left;
  padding-left: 3px;
}
.saveFilePath {
  text-align: left;
}
</style>
