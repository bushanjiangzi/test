<template>
  <div>
    <button @click="login">登录</button>
  </div>
</template>

<script>
// import work from '@/views/indexedDB/work.js'
import Worker from './work12.worker.js';
export default {
  name: 'Login',
  data() {
    return {

    }
  },
  mounted() {

  },
  methods:{
    login () {
      console.log('login...')
      // window.location.href = '/module'
      // var worker = myWorker.worker()
      var worker = new Worker(); // 传入 worker 脚本文件的路径即可
      // 关闭
      // worker.terminate();
      // var worker = new Worker('@/module/work/index.js');
      // var worker = new Worker('work.js');
      var db, dbname = "module"
      var a = new Date().getTime() / 1000
      createDb()

      // 指定监听函数，接收子线程发回来的消息
      worker.onmessage = function(event) {
        if (event.data.foo) {
          console.log(event.data.foo)
          return
        }
        var store = db.transaction(dbname, 'readwrite').objectStore(dbname)
        var data = {
          "id": 1,
          "content": JSON.parse(event.data)
        }
        store.put(data)
        // worker.terminate()
        console.log('model store success');
        console.log((new Date().getTime() / 1000) - a + " s")
        // 关闭
        worker.terminate();
      }

      // 第一个参数是字符串，表示数据库的名字。如果指定的数据库不存在，就会新建数据库。第二个参数是整数，表示数据库的版本。
      // 如果省略，打开已有数据库时，默认为当前版本；新建数据库时，默认为1。
      function createDb() {
        var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
        var request = indexedDB.open(dbname, '1');
        request.onerror = function(e) {
          console.log(e.currentTarget.error.message);
        };

        // 事件表示成功打开数据库
        request.onsuccess = function(e) {
          db = e.target.result;
          // 新增数据指的是向对象仓库写入数据记录。这需要通过事务完成。
          var store = db.transaction(dbname, 'readwrite').objectStore(dbname)
          var req = store.get(1)
          req.onsuccess = function(event) {
            if (req.result == null) {
              // 向 Worker 发消息
              worker.postMessage("1")
            } else {
              console.log('not need webwork');
            };
          }
        }
        // 如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件upgradeneeded
        request.onupgradeneeded = function(e) {
          // 通过事件对象的target.result属性，拿到数据库实例
          db = e.target.result;
          // 新建对象仓库（即新建表
          var objectStore = db.createObjectStore(dbname, {
            keyPath: "id"
          });
        }
      }
    }
  }
}
</script>

<style>

</style>