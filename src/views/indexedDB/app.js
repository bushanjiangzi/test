import Worker from './my.worker';
// import Worker from 'worker-loader!./worker'

const myWorker = {
  worker() {
    console.log('创建 worker 实例')
    // 创建 worker 实例
    var worker = new Worker('work.worker.js'); // 传入 worker 脚本文件的路径即可
    // worker.postMessage({ a: 1 });
    // worker.onmessage = function (event) {
    //     console.log(event.data)
    // };
    // worker.addEventListener("message", function (event) {});
    return worker
  }
}

export default myWorker