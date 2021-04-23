<template>
  <van-row justify="center" class="common-card">
    <van-col span="24">
      <div class="common-card_content">
        <van-button plain type="primary" size="small" @click.prevent="initDB"
          >创建数据库</van-button
        >
        <van-button
          plain
          type="primary"
          size="small"
          @click.prevent="doSqlBatch"
          >新增表</van-button
        >
        <van-button
          plain
          type="primary"
          size="small"
          @click.prevent="doSqlInsert"
          >插入数据</van-button
        >
        <van-button
          plain
          type="primary"
          size="small"
          @click.prevent="doSearchDB"
          >查询数据</van-button
        >
        <van-button plain type="primary" size="small" @click.prevent="doDropDB"
          >删库跑路</van-button
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
            <li v-for="item in dbList" :key="item">
              <p>{{ item.id }}---{{ item.name }}</p>
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
import {
  openDB,
  sqlBatch,
  executeSql,
  deleteFile,
  sqlQuery,
} from "/@/utils/cordovaUtil";
import { buildUUID } from "/@/utils/uuid";

export default defineComponent({
  name: "sqllite",
  setup() {
    const data: any = reactive({
      db: null,
      isPopupVisible: false,
      dbList: [],
    });
    const initDB = () => {
      openDB("cordovaInit").then(
        (result: any) => {
          data.db = result;
          Toast({
            message: "创建/打开数据库成功",
            duration: 4000,
            position: "bottom",
          });
        },
        (err) => {
          console.log(err);
          Toast({
            message: "创建/打开数据库异常",
            duration: 4000,
            position: "bottom",
          });
        }
      );
    };
    const doSqlBatch = () => {
      const CREATE_TABLE1 =
        "CREATE TABLE IF NOT EXISTS table1 (id varchar(50) primary key, name varchar(15))";
      const CREATE_TABLE2 =
        "CREATE TABLE IF NOT EXISTS table2 (id varchar(50) primary key, table1Id varchar(50), name varchar(15))";
      let _sqlBatch = [];
      _sqlBatch.push(CREATE_TABLE1, CREATE_TABLE2);
      sqlBatch(data.db, _sqlBatch).then(
        () => {
          Toast({
            message: "创建表成功",
            duration: 4000,
            position: "bottom",
          });
        },
        (err) => {
          console.log(err);
          Toast({
            message: "创建表异常",
            duration: 4000,
            position: "bottom",
          });
        }
      );
    };
    const doSqlInsert = () => {
      const result = [buildUUID(), `Name_${buildUUID().slice(0, 7)}`];
      const _EXECUTEINSERT = "INSERT INTO table1(id, name) VALUES (?,?)";
      // 插入数据
      executeSql(data.db, result, _EXECUTEINSERT).then(
        () => {
          Toast({
            message: "插入数据成功",
            duration: 4000,
            position: "bottom",
          });
        },
        (err) => {
          console.log(err);
          Toast({
            message: "插入数据异常",
            duration: 4000,
            position: "bottom",
          });
        }
      );
    };
    const doDropDB = () => {
      // sqllite中无语句删除，直接物理删除
      let path = `${cordova.file.applicationStorageDirectory}databases/`;
      let file = ["cordovaInit.db", "cordovaInit.db-journal"];
      file.forEach((item: string) => {
        deleteFile(item, path).then(
          () => {
            Toast({
              message: "删除成功，赶紧提桶跑路",
              duration: 4000,
              position: "bottom",
            });
          },
          (err) => {
            Toast({
              message: `删除失败, 文件不存在或其他原因\n在跑路的边缘疯狂试探\n${JSON.stringify(
                err
              )}`,
              duration: 4000,
              position: "bottom",
            });
          }
        );
      });
    };
    const closeDBList = () => {
      data.isPopupVisible = false;
    };
    const doSearchDB = () => {
      // 查询数据
      const _sql = "SELECT * from table1";
      sqlQuery(data.db, _sql).then(
        (result: any) => {
          data.isPopupVisible = true;
          data.dbList = result;
        },
        (err) => {
          Toast({
            message: `${JSON.stringify(err)}`,
            duration: 4000,
            position: "bottom",
          });
        }
      );
    };
    return {
      ...toRefs(data),
      initDB,
      doSqlBatch,
      doSqlInsert,
      doDropDB,
      closeDBList,
      doSearchDB,
    };
  },
});
</script>
<style scoped>
.common-popup_content ul li {
  padding-bottom: 7px;
}
</style>
