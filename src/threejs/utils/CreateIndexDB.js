import * as THREE from '../js/build/three.module.js';

// export default class CreateIndexDB {
//   constructor() {
//     this.db = '',
//     this.dbname = 'qxznModel',
//     this.indexedDB = '',
//     this.store = ''
//   }
//   // 创建数据库
//   createDB () {
//     let vm = this
//     this.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
//     // 打开已有数据库时，默认为当前版本；新建数据库时，默认为1
//     let request = this.indexedDB.open(this.dbname, "1");
//     request.onerror = function(e) {
//       console.log(e.currentTarget.error.message);
//     };
//     // 新建时必须指定表格名称和操作模式（"只读"或"读写"）
//     request.onsuccess = function(e) {
//       vm.db = e.target.result;
//       this.store = vm.db.transaction(vm.dbname, 'readwrite').objectStore(vm.dbname)
//       // store.get()方法用于读取数据，参数是主键的值。
//       let req = this.store.get(1)
//       req.onsuccess = function(event) {
//         if (req.result) {
//           console.log('not need webwork');
//         } else {
//           console.log('没有数据，请加载模型。。。');
//         };
//       }
//     }
//     // 如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件upgradeneeded。
//     request.onupgradeneeded = function(e) {
//       vm.db = e.target.result;
//       var objectStore = vm.db.createObjectStore(vm.dbname, {
//         keyPath: "id"
//       });
//     }
//   }
//   // 写入数据库
//   writeInBD (str) {
//     // this.createDB()
//     // this.store = this.db.transaction(this.dbname, 'readwrite').objectStore(this.dbname)
//     const data = {
//       "id": 1,
//       "content": JSON.parse(str)
//     }
//     this.store.put(data)
//     // worker.terminate()
//     console.log('model store success');
//     console.log((new Date().getTime() / 1000) - a + " s")
//   }
// }

var CreateIndexDB = function() {
  let db, dbname = "qxznModel";
  let timer;

  // 创建数据库
  this.createDB = function () {
    return new Promise((resolve, reject) => {
      let indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
      let request = indexedDB.open(dbname, "1");
      request.onerror = function(e) {
        console.log(e.currentTarget.error.message);
        reject(e.currentTarget.error.message)
      };
      request.onsuccess = function(e) {
        db = e.target.result;
        let store = db.transaction(dbname, 'readwrite').objectStore(dbname)
        let req = store.get(1)
        req.onsuccess = function(event) {
          if (req.result == null) {
            console.log('没有数据，请加载模型。。。');
            reject('load')
          } else {
            console.log('模型加载中。。。');
            resolve()
          };
        }
        req.onerror = function(event) {
          console.log(event)
          reject(event)
        }
      }
      request.onupgradeneeded = function(e) {
        db = e.target.result;
        var objectStore = db.createObjectStore(dbname, {
          keyPath: "id"
        });
      }
    })
  }

  // 写入数据库
  this.writeInBD = function(str) {
    let store = db.transaction(dbname, 'readwrite').objectStore(dbname)
    const data = {
      "id": 1,
      "content": JSON.parse(str)
    }
    store.put(data)
    console.log('model store success');
  }

  // 读取模型添加到场景中
  this.getModel = function (scene) {
    return new Promise((resolve, reject) => {
      let store = db.transaction(dbname, 'readwrite').objectStore(dbname)
      let req = store.get(1)
      req.onsuccess = function(event) {
        if (req.result) {
          new THREE.ObjectLoader().parse(req.result["content"], function(object ) {
            // console.log(object )
            scene.add(object)
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set( 0, 0, 0 );
            resolve(object)
          });
        } else {
          console.log("no data")
          reject("no data")
        }
      }
      req.onerror = function(event) {
        console.log(event)
        reject(event)
      }
    })
  }
}

export default CreateIndexDB