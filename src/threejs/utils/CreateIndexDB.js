import * as THREE from '../js/build/three.module.js';

/**
 * CreateIndexDB 创建浏览器数据库
 * scene - 场景（必传）
*/
export default class CreateIndexDB {
  constructor(scene) {
    this.db = '',
    this.dbname = 'jiangzi',
    this.scene = scene
  }
  // 创建数据库
  createDB () {
    return new Promise((resolve, reject) => {
      let vm = this
      let indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
      let request = indexedDB.open(this.dbname, "1");
      request.onerror = function(e) {
        console.log(e.currentTarget.error.message);
        reject(e.currentTarget.error.message)
      };
      request.onsuccess = function(e) {
        vm.db = e.target.result;
        let store = vm.db.transaction(vm.dbname, 'readwrite').objectStore(vm.dbname)
        let req = store.get(1)
        req.onsuccess = function(event) {
          if (req.result == null) {
            console.log('没有数据，请加载模型。。。');
            reject('load')
          } else {
            console.log('not need webwork');
            resolve()
          };
        }
        req.onerror = function(event) {
          console.log(event)
          reject(event)
        }
      }
      request.onupgradeneeded = function(e) {
        vm.db = e.target.result;
        var objectStore = vm.db.createObjectStore(vm.dbname, {
          keyPath: "id"
        });
      }
    })
  }

  // 写入数据库
  writeInBD (str) {
    let store = this.db.transaction(this.dbname, 'readwrite').objectStore(this.dbname)
    const data = {
      "id": 1,
      "content": JSON.parse(str)
    }
    store.put(data)
    console.log('model store success');
  }

  // 读取模型添加到场景中
  getModel () {
    return new Promise((resolve, reject) => {
      let vm = this
      let store = this.db.transaction(this.dbname, 'readwrite').objectStore(this.dbname)
      let req = store.get(1)
      req.onsuccess = function(event) {
        if (req.result) {
          new THREE.ObjectLoader().parse(req.result["content"], function(object ) {
            // console.log(object )
            vm.scene.add(object)
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

/**
 * CreateIndexDB 创建浏览器数据库
*/
// var CreateIndexDB = function() {
//   let db, dbname = "qxznModel";
//   // 创建数据库
//   this.createDB = function () {
//     return new Promise((resolve, reject) => {
//       let indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
//       let request = indexedDB.open(dbname, "1");
//       request.onerror = function(e) {
//         console.log(e.currentTarget.error.message);
//         reject(e.currentTarget.error.message)
//       };
//       request.onsuccess = function(e) {
//         db = e.target.result;
//         let store = db.transaction(dbname, 'readwrite').objectStore(dbname)
//         let req = store.get(1)
//         req.onsuccess = function(event) {
//           if (req.result == null) {
//             console.log('没有数据，请加载模型。。。');
//             reject('load')
//           } else {
//             console.log('not need webwork');
//             resolve()
//           };
//         }
//         req.onerror = function(event) {
//           console.log(event)
//           reject(event)
//         }
//       }
//       request.onupgradeneeded = function(e) {
//         db = e.target.result;
//         var objectStore = db.createObjectStore(dbname, {
//           keyPath: "id"
//         });
//       }
//     })
//   }

//   // 写入数据库
//   this.writeInBD = function(str) {
//     let store = db.transaction(dbname, 'readwrite').objectStore(dbname)
//     const data = {
//       "id": 1,
//       "content": JSON.parse(str)
//     }
//     store.put(data)
//     console.log('model store success');
//   }

//   // 读取模型添加到场景中
//   this.getModel = function (scene) {
//     return new Promise((resolve, reject) => {
//       let store = db.transaction(dbname, 'readwrite').objectStore(dbname)
//       let req = store.get(1)
//       req.onsuccess = function(event) {
//         if (req.result) {
//           new THREE.ObjectLoader().parse(req.result["content"], function(object ) {
//             // console.log(object )
//             scene.add(object)
//             object.scale.set(0.5, 0.5, 0.5);
//             object.position.set( 0, 0, 0 );
//             resolve(object)
//           });
//         } else {
//           console.log("no data")
//           reject("no data")
//         }
//       }
//       req.onerror = function(event) {
//         console.log(event)
//         reject(event)
//       }
//     })
//   }
// }

// export default CreateIndexDB