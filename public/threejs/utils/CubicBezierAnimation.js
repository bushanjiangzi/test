import * as THREE from '../js/build/three.module.js';

/**
 * 三维三次贝塞尔曲线动画构造函数
 * camera - 相机
 * end - 终点位置（三维向量）
 * target - 相机的朝向（三维向量）
 * frameNum - 帧数
*/
var CubicBezierAnimation = function (camera, end, target, frameNum) {
  //获取当前camera位置
  this.startPosition = camera.position; // 获取摄像机当前位置
  this.endPosition = end; // 设置终点位置
  this.curve = addLines(this.startPosition, this.endPosition).curve;
  this.lineMesh = addLines(this.startPosition, this.endPosition).lineMesh;
  //获取curve的n个点(一个点一帧)
  let points = this.curve.getPoints(frameNum);
  let index = 0;
  let times = null

  // 添加线条
  function addLines(v0, vt) {
    // 计算v0,vt向量夹角（弧度）
    let angle = v0.angleTo(vt) * 1800 / Math.PI / 10;
    let aLen = angle * 50,
        hLen = angle * angle * 120;
    let p0 = new THREE.Vector3(0, 0, 0);
    // console.log(angle, aLen, hLen)
    // Ray( origin : Vector3, direction : Vector3 ) 由一个原点向一个确定的方向发射
    let rayLine = new THREE.Ray(p0, getVCenter(v0.clone(), vt.clone()));
    // 顶点坐标
    let vtop = rayLine.at(hLen / rayLine.at(1).distanceTo(p0));
    // 控制点坐标
    let v1 = getLenVcetor(v0.clone(), vtop, aLen);
    let v2 = getLenVcetor(vt.clone(), vtop, aLen);

    /**
     * 绘制贝塞尔曲线
     * 创建一条平滑的三维 三次贝塞尔曲线， 由起点、终点和两个控制点所定义。
     * CubicBezierCurve3( v0 : Vector3, v1 : Vector3, v2 : Vector3, v3 : Vector3 )
    */
    let curve = new THREE.CubicBezierCurve3(v0, v1, v2, vt);
    let geo = new THREE.Geometry();
    geo.vertices = curve.getPoints(frameNum);
    let material  = new THREE.LineBasicMaterial({color: 0xff0000});
    return {
      curve: curve,
      lineMesh: new THREE.Line(geo, material)
    };
  }
  
  // 计算两点的中点
  function getVCenter(v1, v2) {
    let v = v1.add(v2);
    return v.divideScalar(2);
  }

  // 计算V1，V2向量固定长度的点
  // lerp ( v : Vector3, alpha : Float )在该向量与传入的向量v之间的线性插值，alpha是沿着线的长度的百分比 —— alpha = 0 时表示的是当前向量，alpha = 1 时表示的是所传入的向量v。
  function getLenVcetor(v1, v2, len) {
    let LenV12 = v1.distanceTo(v2);
    console.log('LenV12:', LenV12, len / LenV12)
    return v1.lerp(v2, len / LenV12);
  }

  //摄像机每50毫秒移动一个点的位置
  this.animation = function()  {
    times = setInterval (function () {
      camera.position.set(points[index].x,points[index].y,points[index].z);
      // console.log(index);
      camera.lookAt(target)
      index++;
      if (index > frameNum) {
        clearInterval(times);
      }
    }, 50);
  }
  // 暂停动画
  this.stop = function() {
    clearInterval(times);
  }
  // 继续动画
  this.continune = function() {
    this.animation()
  }
}

export default CubicBezierAnimation
