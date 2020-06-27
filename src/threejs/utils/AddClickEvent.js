
import * as THREE from '../js/build/three.module.js'

/**
 * AddClickEvent 添加点击事件，用于确定模型中某个点在世界坐标系中位置和给设备绑定点击事件
 * camera - 相机（必须）
 * controls - 控制器（必须）
 * objects - 模型对象（必须）
 * far - 射线长度，不传则默认为1000
*/
export default class AddClickEvent {
  constructor(camera, controls, objects, far) {
    this.camera = camera,
    this.objects = objects,
    this.controls = controls,
    this.far = far ? far : 1000,
    this.noticeDiv = '',
    this.objectsMeshArr = []
  }
  init () {
    this.noticeDiv = document.getElementById('noticeBox')
    let findPosition = new THREE.Raycaster()
    findPosition.far = this.far
    this.objects.forEach(element => {
      if (element.children) {
        // console.log(element, element.children)
        this.objectsMeshArr = this.objectsMeshArr.concat(element.children)
      }
    });
    document.addEventListener( 'click', (event) => {
      this.noticeDiv.style.display = 'none'
      if (this.controls.isLocked === true) {
        return
      }
      let mouse = {}
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
      // 通过摄像机和鼠标位置更新射线
      findPosition.setFromCamera( mouse, this.camera )
      console.log(this.objectsMeshArr)
      let positionArr = findPosition.intersectObjects( this.objects, true)
      if(positionArr.length > 0) {
        let material = new THREE.MeshLambertMaterial({
          color: 0xff0000,
          transparent: positionArr[0].object.material.transparent ? false : true,
          opacity: 1
        })
        positionArr[0].object.material = material
        console.log('name:', positionArr[0].object.name, ';id:', positionArr[0].object.id)
        this.renderDiv(positionArr[0].object, event)
        console.log('click position:', positionArr[0].point)
      }
      // console.log('positionArr:', positionArr)
    }, false )
  }
  // 更新div的位置
  renderDiv (object, event) {
    // 逆转相机求出二维坐标
    // let vector = object.position.clone().project(this.camera)
    let newLeft, newTop
    // 显示模型信息
    this.noticeDiv.innerText = "name:" + object.name + ';id:' + object.id
    this.noticeDiv.style.display = 'block'
    if (event.clientX + this.noticeDiv.clientWidth + 5 > window.innerWidth ) {
      newLeft = event.clientX - this.noticeDiv.clientWidth - 5
    } else {
      newLeft = event.clientX + 10
    }
    if (event.clientY + this.noticeDiv.clientHeight + 5  > window.innerHeight) {
      newTop = event.clientY - this.noticeDiv.clientHeight - 5
    } else {
      newTop = event.clientY + 10
    }
    // 修改 div 的位置
    this.noticeDiv.style.left = newLeft + 'px'
    this.noticeDiv.style.top = newTop + 'px'
  }
}