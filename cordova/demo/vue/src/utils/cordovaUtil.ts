// 拍照时设置相机参数
const setOptions = (srcType: number) => {
  let options = {
    quality: 100, // 图片质量 0- 100, some common settings are 20, 50, and 100
    destinationType: 1, // 图片结果数据 0: base64 / 1: url
    sourceType: srcType, // 0: 从图库选取图片, 1: 使用相机拍照, 2: 从相册选取图片
    encodingType: 1, // 拍照后图片成相类型 0: jpeg / 1: png
    mediaType: 0, // 0: 图片, 1: 视频, 2: 多媒体
    allowEdit: false,
    cameraDirection: 0, // 0: 后置相机, 1: 前置相机
    correctOrientation: true, // Corrects Android orientation quirks
  };
  return options;
};

export const openCamera = (
  selection: string,
  Datatype: string,
  sourceType: number
) => {
  let options: any = setOptions(sourceType);
  // 生成缩略图
  if (selection === "camera-thmb") {
    options.targetHeight = 400;
    options.targetWidth = 400;
  }
  return new Promise((resolve, reject) => {
    navigator.camera.getPicture(
      function cameraSuccess(imageUri) {
        if (Datatype === "base64") {
          window.resolveLocalFileSystemURL(imageUri, function (entry: any) {
            entry.file(
              function (file: any) {
                const reader = new FileReader();
                reader.onloadend = function () {
                  // readAsDataURL函数执行成功返回result
                  let base64 = reader.result;
                  let datas = {
                    base64: base64,
                    url: imageUri,
                  };
                  resolve(datas);
                };
                reader.readAsDataURL(file); //此函数把文件读取为Base64二进制流
              },
              function () {
                const err = "读取文件异常";
                reject(err);
              }
            );
          });
        } else {
          resolve(imageUri);
        }
      },
      function cameraError(error: any) {
        reject(error);
        console.log("Unable to obtain picture: " + error, "app");
      },
      options
    );
  });
};

// 选取图片后，在cache空间复制了一份，所以文件越大返回速度越慢？
export const openGallery = (
  sourceType: number,
  selection?: string,
  Datatype?: string
) => {
  let options: any = setOptions(sourceType);
  // 生成缩略图
  if (selection === "camera-thmb") {
    options.targetHeight = 400;
    options.targetWidth = 400;
  }
  return new Promise((resolve, reject) => {
    navigator.camera.getPicture(
      function cameraSuccess(imageUri) {
        resolve(imageUri);
      },
      function cameraError(error: any) {
        reject(error);
        console.log("Unable to obtain picture: " + error, "app");
      },
      options
    );
  });
};

/**
 * @description: 创建数据库
 * @param dbname:string 数据库名
 * @return:
 */
export function openDB(dbname: string) {
  return new Promise((resolve, reject) => {
    window.sqlitePlugin.openDatabase(
      {
        name: dbname + ".db",
        location: "default",
        androidDatabaseProvider: "system",
      },
      (db: SQLitePlugin.Database) => {
        db.transaction(
          (tx: SQLitePlugin.Transaction) => {
            resolve(db);
          },
          (err: Error) => {
            reject(err);
          }
        );
      }
    );
  });
}

/**
 * @description: 数据库操作
 * @param {type} db 数据库对象 sql sql语句, liker 'CREATE TABLE IF NOT EXISTS tabletest (id integer primary key, title text, desc text)'
 * @param obj: [表字段1的值, 表字段2的值, ......] <==>  (?,?,...)
 * @return:
 */
export function executeSql(
  db: SQLitePlugin.Database,
  obj: string[] = [],
  sql: string
) {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction(
        (transaction: SQLitePlugin.Transaction) => {
          transaction.executeSql(
            sql,
            obj,
            (tx, result) => {
              console.log(tx);
              console.log(result);
              resolve();
            },
            (err) => {
              console.log("db executeSql err: ");
              console.log(err);
              reject(err);
            }
          );
        },
        (_err) => {
          console.log("db connection err: ");
          console.log(_err);
          // db.close()
        },
        () => {
          // db.close()
        }
      );
    } else {
      reject({
        name: "error",
        message: "数据库不存在",
      });
    }
  });
}

/**
 * @description: sql多语句处理
 * @param {type}
 * @return:
 */
export function sqlBatch(db: SQLitePlugin.Database, batchs: string[] = []) {
  return new Promise((resolve, reject) => {
    if (db) {
      db.sqlBatch(
        batchs,
        () => {
          resolve();
        },
        (error: Error) => {
          reject(error);
        }
      );
    } else {
      reject({
        name: "err",
        message: "数据库不存在",
      });
    }
  });
}

/**
 * @description: sql查询
 * @param {type} db 数据库 osql 查询语句
 * @return:
 */
export function sqlQuery(db: SQLitePlugin.Database, osql: string) {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction(
        function (transaction) {
          transaction.executeSql(
            osql,
            [],
            (tx, results) => {
              let _result = [];
              let _len = results.rows.length;
              for (let x = 0; x < _len; x++) {
                _result.push(results.rows.item(x));
              }
              resolve(_result);
            },
            (_err) => {
              reject(_err);
            }
          );
        },
        (_err) => {
          // db.close()
          console.log(_err);
        },
        () => {
          // db.close()
          console.log("success");
        }
      );
    } else {
      reject({
        name: "err",
        message: "数据库不存在",
      });
    }
  });
}

/**
 * @description: table表添加列(sqlite不支持添加多列)
 * @param {obj} db: 数据库对象
 * @param {string} tbname: 表名
 * @param {string} column: 需要添加的列名及类型
 * input: extraTableColumn(db, 'tableName', 'disabled varchar(1)')
 * result: ALTER TABLE tableName ADD COLUMN disabled varchar(1)
 * @return:
 */
export function extraTableColumn(
  db: SQLitePlugin.Database,
  tbname: string,
  column: string
) {
  const _sql = `ALTER TABLE ${tbname} ADD COLUMN ${column}`;
  return new Promise((resolve, reject) => {
    executeSql(db, [], _sql).then(
      (data) => {
        // console.log("insert column success")
        resolve(data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

export function deleteFile(fileName: string, filePath: string) {
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(
      filePath,
      function (dir: any) {
        dir.getFile(
          fileName,
          { create: false },
          function (fileEntry: any) {
            fileEntry.remove(
              function () {
                resolve();
              },
              function (error: FileError) {
                reject(error);
              }
            );
          },
          (err: FileError) => {
            reject(err);
          }
        );
      },
      function (err: FileError) {
        reject(err);
      }
    );
  });
}

// 判断文件/文件加是否存在
export const localFileToBase64 = (path: string, fileName: string) => {
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(
      path,
      function (root: any) {
        root.getFile(
          fileName,
          {
            create: false,
          },
          function (fileEntry: any) {
            fileEntry.file(
              function (file: any) {
                var reader = new FileReader();
                reader.onloadend = function (e: any) {
                  resolve(e.target.result);
                };
                reader.readAsDataURL(file);
              },
              function (err: any) {
                console.log("读取出错");
              }
            );
          },
          function (err: any) {
            console.log("找不到文件");
            reject(err);
          }
        );
      },
      function (err) {
        reject(err);
      }
    );
  });
};

// 判断文件/文件加是否存在
export const checkFileExists = (path: string) => {
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(
      path,
      (entry) => {
        if (entry.name) {
          let data = {
            opath: entry.nativeURL.replace("/" + entry.name, ""),
            oname: entry.name,
          };
          resolve(data);
        }
      },
      (evt) => {
        reject(evt);
      }
    );
  });
};

// 检测app是否安装
export const isAppInstalled = (packageName: string) => {
  return new Promise((resolve, reject) => {
    appAvailability.check(
      packageName,
      () => {
        console.log("success");
        resolve();
      },
      (err: any) => {
        console.log("err");
        console.log(err);
        reject();
      }
    );
  });
};

let media: any,
  playAudioMedia: {
    stop: () => void;
    release: () => void;
    play: () => void;
  } | null = null;

// 开始录音
export const takeAudio = () => {
  return new Promise((resolve, reject) => {
    // 录音文件名 cordova.file.externalRootDirectory
    let recordFile = new Date().getTime() + ".mp3";
    let filePath = `${cordova.file.externalRootDirectory}indusec/user/cache/${recordFile}`;
    media = new Media(filePath, onSuccess, onFail);
    function onSuccess() {
      resolve(filePath);
    }
    function onFail(message: any) {
      reject(message);
    }
    media.startRecord();
  });
};

// 暂停录音内容播放
export const pauseAudio = () => {
  if (playAudioMedia) {
    playAudioMedia.stop();
    playAudioMedia.release();
  } else {
    console.log("no media");
  }
};

// 结束录音
export const stopAudio = () => {
  media.stopRecord();
  media.release();
  media = null
};

// 播放录音
export const playAudio = (audioFlilePath: string) => {
  if (playAudioMedia) {
    playAudioMedia.stop();
    playAudioMedia.release();
  }
  return new Promise((resolve, reject) => {
    playAudioMedia = new Media(audioFlilePath, onSuccess, onFail);
    function onSuccess() {
      resolve();
    }
    function onFail(message: any) {
      reject(message);
    }
    playAudioMedia.play();
  });
};
