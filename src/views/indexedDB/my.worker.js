// onmessage = function(ev){    // 也可以是self.onmessage
//   // 工作线程收到主线程的ev.data
// };
// let msg = '工作线程向主线程发送消息'
// postMessage(msg);     // 也可以是self.postMessage, msg可以直接是对象

import _ from 'lodash'

const obj = { foo: 'foo' }

_.has(obj, 'foo')

// Post data to parent thread
self.postMessage({ foo: 'foo' })

// Respond to message from parent thread
self.addEventListener('message', (event) => {
  console.log(event)
  // Worker 线程
  // self.close();
})