import * as THREE from './js/build/three.module.js';
import Stats from './js/build/stats.module.js';
import { PointerLockControls } from './js/controls/PointerLockControls.js';
import { GLTFLoader } from './js/loaders/GLTFLoader.js';
import { DRACOLoader } from './js/loaders/DRACOLoader.js';
import CubicBezierAnimation from './animate/CubicBezierAnimation.js'
import CreateIndexDB from './utils/CreateIndexDB'
import AddClickEvent from './utils/AddClickEvent'
import ImportModels from './utils/ImportModels'
import { WEBGL } from './js/WebGL'

// import CreateModel from './utils/CreateModel.js'

var mainFunction = function () {
  if (!WEBGL.isWebGLAvailable()){
    alert('你的浏览器不支持WEBGL')
    return
  }
  var scene, camera, dirLight, stats;
  var renderer, controls;
  var objects = [];
  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;
  var canJump = false;
  var isNeedLock = true

  var prevTime = performance.now();
  var velocity = new THREE.Vector3();
  var direction = new THREE.Vector3();

  var upDir = new THREE.Vector3(0, 1, 0)
  var downDir = new THREE.Vector3(0, -1, 0)

  // 该对象用于跟踪时间。如果performance.now可用，则 Clock 对象通过该方法实现，否则回落到使用略欠精准的Date.now来实现
  var clock = new THREE.Clock();
  var container = document.getElementById('container');

  // 希望知道实时的FPS信息，从而更好地监测动画效果（见页面左上角）
  stats = new Stats();
  container.appendChild(stats.dom);

  /**
   * 创建渲染器
   * antialias - 是否执行抗锯齿。默认为false.
   * setPixelRatio - 设置设备像素比。通常用于避免HiDPI设备上绘图模糊
   * setSize - 将输出canvas的大小调整为(width, height)并考虑设备像素比
   * outputEncoding - Defines the output encoding of the renderer. Default is THREE.LinearEncoding.
   * threejs 需要在线性颜色空间 (linear colorspace) 里渲染模型的材质, 而从一般软件中导出的模型中包含颜色信息的贴图
   * 一般都是 sRGB 颜色空间(sRGB colorspace), 故需要先将 sRGB 转换为 Linear.
  */
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfe3dd);

  /**
   * 创建透视相机
   * PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
   * fov — 摄像机视锥体垂直视野角度
   * aspect — 摄像机视锥体长宽比
   * near — 摄像机视锥体近端面
   * far — 摄像机视锥体远端面
  */
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(2000, 2000, 0);
  camera.lookAt(new THREE.Vector3(0, 100, 0))
  // camera.position.set( 0, 60, -1000 );

  /**
   * PointerLockControls( camera : Camera, domElement : HTMLDOMElement )
   * lock - Fires when the pointer lock status is "locked" (in other words: the mouse is captured).
   * unlock - Fires when the pointer lock status is "unlocked" (in other words: the mouse is not captured anymore).
  */
  controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  // 添加环境光
  var ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // soft white light
  scene.add(ambientLight);
  /**
   * 设置平行光
   * DirectionalLight( color : Integer, intensity : Float )
   * 平行光的方向是从它的位置到目标位置。默认的目标位置为原点 (0,0,0)。
   * color - (可选参数) 16进制表示光的颜色。 缺省值为 0xffffff (白色)。
   * intensity - (可选参数) 光照的强度。缺省值为1。
   * position.set() - 设置平行光的方向
   * 
  */
  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 1, 0);
  scene.add(dirLight);

  // 辅助轴:红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
  var axesHelper = new THREE.AxesHelper(2000);
  scene.add(axesHelper);

  /**
   * Raycaster( origin : Vector3, direction : Vector3, near : Float, far : Float )
   * origin —— 光线投射的原点向量。
   * direction —— 向射线提供方向的方向向量，应当被标准化。
   * near —— 返回的所有结果比near远。near不能为负值，其默认值为0。
   * far —— 返回的所有结果都比far近。far不能小于near，其默认值为Infinity（正无穷。）
  */
  // var raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
  var raycaster

  /**
   * 创建浏览器数据库
  */
  var indexDB = new CreateIndexDB(scene)
  indexDB.createDB().then(res => {
    indexDB.getModel().then((res) => {
      loadSuccess()
      objects.push(res)
    }).catch((err) => {
      console.log(err)
    })
  }).catch((err) => {
    console.log(err)
    loadModel()
  })

  /**
   * .load ( url : String, onLoad : Function, onProgress : Function, onError : Function ) : null
   * url — 包含有.gltf/.glb文件路径/URL的字符串。
   * onLoad — 加载成功完成后将会被调用的函数。该函数接收parse所返回的已加载的JSON响应。
   * onProgress — （可选）加载正在进行过程中会被调用的函数。其参数将会是XMLHttpRequest实例，包含有总字节数.total与已加载的字节数.loaded。
   * onError — （可选）若在加载过程发生错误，将被调用的函数。该函数接收error来作为参数。
   * 开始从url加载，并使用解析过的响应内容调用回调函数。
  */
  var loadModel = function () {
    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('../../threejs/js/draco/');
    var loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load('../../threejs/models/bgs2.gltf', function (gltf) {
      var model = gltf.scene;
      model.position.set(0, 0, 0);
      model.scale.set(0.5, 0.5, 0.5);
      // 遍历模型节点
      model.traverse(function (child) {
        if (child.isMesh) {
          model.castShadow = true;
          model.receiveShadow = true;
        }
      });
      scene.add(model);
      objects.push(model)
      indexDB.writeInBD(JSON.stringify(model))

      loadSuccess()
    }, onProgress, function (e) {
      console.error(e);
    });
  }

  // 加载进度回调
  var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };

  // 添加自定义模型
  // var createModels = new CreateModel(scene)
  // createModels.createSky()

  var loadSuccess = function () {
    // 模型加载完的入场动画
    setTimeout(() => {
      var flyInto = new CubicBezierAnimation(camera, new THREE.Vector3(-100, 50, -960), new THREE.Vector3(0, 0, 0), new THREE.Vector3(100, 60, -960), 100);
      flyInto.animation()
    }, 1000)
    setTimeout(() => {
      addListner();
    }, 6000)
    animate();
    new ImportModels(scene, objects)
  }

  // 事件监听函数
  var onKeyDown = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        if (crashTest(1, upDir)) {
          console.log('你撞墙了')
          moveForward = false;
        } else {
          moveForward = true;
        }
        break;
      case 37: // left
      case 65: // a
        if (crashTest(0, upDir)) {
          console.log('你撞墙了')
          moveLeft = false;
        } else {
          moveLeft = true;
        }
        break;
      case 40: // down
      case 83: // s
        if (crashTest(1, downDir)) {
          console.log('你撞墙了')
          moveBackward = false;
        } else {
          moveBackward = true;
        }
        break;
      case 39: // right
      case 68: // d
        if (crashTest(0, downDir)) {
          console.log('你撞墙了')
          moveRight = false;
        } else {
          moveRight = true;
        }
        break;
      case 32: // space
        if (canJump === true) {
          velocity.y += 350;
          canJump = false;
          console.log('canJump');
        }
        break;
    }
  }

  var onKeyUp = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;
      case 37: // left
      case 65: // a
        moveLeft = false;
        break;
      case 40: // down
      case 83: // s
        moveBackward = false;
        break;
      case 39: // right
      case 68: // d
        moveRight = false;
        break;
    }

  }

  var onMouseDown = function (event) {
    event.preventDefault();
    event.stopPropagation();
    switch (event.button) {
      case 0: moveForward = true; break;
    }
  }

  var onMouseUp = function (event) {
    event.preventDefault();
    event.stopPropagation();
    switch (event.button) {
      case 0: moveForward = false; break;
      case 2:
        moveBackward = false
        moveForward = false
        moveLeft = false
        moveRight = false
        if (isNeedLock) {
          controls.lock();
          isNeedLock = false
        } else {
          controls.unlock();
          isNeedLock = true
        }
        break;
    }
  }

  var onWheel = function (event) {
    if (event.deltaY < 0) {
      moveBackward = false
      moveForward = true;
    } else {
      moveForward = false;
      moveBackward = true;
    }
    setTimeout(() => {
      moveForward = false;
      moveBackward = false;
    }, 100)
  }

  // 添加事件监听
  var addListner = function() {
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
    document.addEventListener( 'mousedown', onMouseDown, false );
    document.addEventListener( 'mouseup', onMouseUp, false );
    document.addEventListener( 'wheel', onWheel, false );
    let addClickEvent = new AddClickEvent(camera, controls, objects)
    addClickEvent.init()
  }

  // 浏览器窗口大小改变时触发
  window.onresize = function () {
    // console.log('window.onresize')
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  /**
   * html5 还提供一个专门用于请求动画的API，那就是 requestAnimationFrame，顾名思义就是请求动画帧。
   * 获取自 oldTime 设置后到当前的秒数。 同时将 oldTime 设置为当前时间。
   * 如果 autoStart 设置为 true 且时钟并未运行，则该方法同时启动时钟。
  */
  function animate() {
    requestAnimationFrame(animate);
    stats.update();
    if (controls.isLocked === true) {
      // raycaster.ray.origin.copy( controls.getObject().position );
      // raycaster.ray.origin.y -= 10;
      // var intersections = raycaster.intersectObjects( objects );
      // var onObject = intersections.length > 0;
      // var onObject = false;
      var time = performance.now();
      var delta = (time - prevTime) / 1000;
      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;
      velocity.y -= 9.8 * 100 * delta; // 100.0 = mass
      // console.log('delta:', delta)
      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveRight) - Number(moveLeft);
      direction.normalize(); // this ensures consistent movements in all directions
      if (moveForward || moveBackward) velocity.z -= direction.z * 1000.0 * delta;
      if (moveLeft || moveRight) velocity.x -= direction.x * 1000.0 * delta;
      // if (onObject === true) {
      //   velocity.y = Math.max(0, velocity.y);
      //   canJump = true;
      // }
      controls.moveRight(- velocity.x * delta);
      controls.moveForward(- velocity.z * delta);
      controls.getObject().position.y += (velocity.y * delta); // new behavior
      if (controls.getObject().position.y < 54) {
        velocity.y = 0;
        controls.getObject().position.y = 50;
        canJump = true;
      }
      prevTime = time;
    }
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.render(scene, camera);
  }

  function crashTest(flag, dir) {

    var vec = new THREE.Vector3()

    if (flag == 1) {//前进 or 后退
      vec.setFromMatrixColumn(camera.matrix, 0);
    } else {//左移 or 右移
      camera.getWorldDirection(vec) // 获取摄像机正视的方向并赋值给vec
    }

    vec.crossVectors(dir, vec);

    var clone_camera = camera.position.clone()
    var clone_vec = vec.clone()

    raycaster = new THREE.Raycaster(clone_camera, clone_vec.normalize(), 0, 10);

    var intersections = raycaster.intersectObjects(objects, true);

    if (intersections.length > 0) return true

    return false

  }
}

export default mainFunction
