
import * as THREE from '../js/build/three.module.js'

export default class AddClickEvent {
  constructor(camera, controls, objects, far) {
    this.camera = camera,
    this.objects = objects,
    this.controls = controls,
    this.far = far ? far : 1000
  }
  init() {
    let findPosition = new THREE.Raycaster()
    findPosition.far = this.far
    document.addEventListener( 'click', (event) => {
      if (this.controls.isLocked === true) {
        return
      }
      let mouse = {}
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
      // 通过摄像机和鼠标位置更新射线
      findPosition.setFromCamera( mouse, this.camera )
      let positionArr = findPosition.intersectObjects( this.objects[0].children )
      if(positionArr.length > 0) {
        let material = new THREE.MeshLambertMaterial({
          color: 0xff0000,
          transparent: positionArr[0].object.material.transparent ? false : true,
          opacity: 0.8
        })
        positionArr[0].object.material = material
        console.log('name:', positionArr[0].object.name, 'id:', positionArr[0].object.id)
        this.renderDiv(positionArr[0].object, event)
        console.log('click position:', positionArr[0].point)
      }
      // console.log('positionArr:', positionArr)
    }, false )
  }
  // 更新div的位置
  renderDiv(object, event) {
    // 获取窗口的一半高度和宽度
    let noticeDiv = document.getElementById('noticeBox')
    // 逆转相机求出二维坐标
    // let vector = object.position.clone().project(this.camera)
    let newLeft, newTop
    if (event.clientX + noticeDiv.clientWidth + 5 > window.innerWidth ) {
      newLeft = event.clientX - noticeDiv.clientWidth - 5
    } else {
      newLeft = event.clientX + 10
    }
    if (event.clientY + noticeDiv.clientHeight + 5  > window.innerHeight) {
      newTop = event.clientY - noticeDiv.clientHeight - 5
    } else {
      newTop = event.clientY + 10
    }
    // 修改 div 的位置
    noticeDiv.style.left = newLeft + 'px'
    noticeDiv.style.top = newTop + 'px'
    // 显示模型信息
    noticeDiv.innerText = "name:" + object.name + ";id:" + object.id
  }
}