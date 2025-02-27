<template>
  <div>
    <div id="mycanves"></div>
  </div>
</template>
<script>
import * as THREE from './js/build/three.module.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
export default {
  name: "vue-three",
  data() {
    return {

    };
  },
  mounted() {
    var scene, camera, dirLight, stats;
    var renderer, controls;

    // 该对象用于跟踪时间。如果performance.now可用，则 Clock 对象通过该方法实现，否则回落到使用略欠精准的Date.now来实现
    var clock = new THREE.Clock();
    var container = document.getElementById( 'mycanves' );

    // 希望知道实时的FPS信息，从而更好地监测动画效果（见页面左上角）
    // stats = new Stats();
    // container.appendChild( stats.dom );

    /**
     * 创建渲染器
     * antialias - 是否执行抗锯齿。默认为false.
     * setPixelRatio - 设置设备像素比。通常用于避免HiDPI设备上绘图模糊
     * setSize - 将输出canvas的大小调整为(width, height)并考虑设备像素比
     * outputEncoding - Defines the output encoding of the renderer. Default is THREE.LinearEncoding.
     * threejs 需要在线性颜色空间 (linear colorspace) 里渲染模型的材质, 而从一般软件中导出的模型中包含颜色信息的贴图
     * 一般都是 sRGB 颜色空间(sRGB colorspace), 故需要先将 sRGB 转换为 Linear.
    */
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );

    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xbfe3dd );

    /**
     * 创建透视相机
     * PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
     * fov — 摄像机视锥体垂直视野角度
     * aspect — 摄像机视锥体长宽比
     * near — 摄像机视锥体近端面
     * far — 摄像机视锥体远端面
    */
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 2000, 2000, 0 );

    /**
     * Orbit controls（轨道控制器）可以使得相机围绕目标进行轨道运动。
     * target - 控制器的焦点，.object的轨道围绕它运行。 它可以在任何时候被手动更新，以更改控制器的焦点。
     * 更新控制器。必须在摄像机的变换发生任何手动改变后调用， 或如果.autoRotate或.enableDamping被设置时，在update循环里调用。
     * enablePan - 启用或禁用摄像机平移，默认为true。
     * enableDamping - 将其设置为true以启用阻尼（惯性），这将给控制器带来重量感。默认值为false。请注意，
     * 如果该值被启用，你将必须在你的动画循环里调用.update()。
     * minDistance - 能够将相机向内移动多少（仅适用于PerspectiveCamera），其默认值为0。
     * maxDistance - 能够将相机向外移动多少（仅适用于PerspectiveCamera），其默认值为Infinity。
    */
    // controls = new OrbitControls( camera, renderer.domElement );
    // controls.target.set( 0, 100, 0 );
    // // controls.update();
    // controls.enablePan = true;
    // controls.enableDamping = true;
    // controls.maxPolarAngle = Math.PI * 0.5;
    // controls.dampingFactor = 0.05;
    // controls.minDistance = 50;
    // controls.maxDistance = 8000;
    
    /**
     * FirstPersonControls( object : Camera, domElement : HTMLDOMElement )
     * movementSpeed - The movement speed. Default is 1.
     * lookSpeed - The look around speed. Default is 0.005.
     * lookVertical - Whether or not it's possible to vertically look around. Default is true.
    */
    var firstPersonControl = new FirstPersonControls( camera, renderer.domElement );
    firstPersonControl.movementSpeed = 500;
    firstPersonControl.lookSpeed = 0.05;
    firstPersonControl.lookVertical = true;
    firstPersonControl.verticalMax = Math.PI * 0.5;
    firstPersonControl.lookAt( 0, 100, 0 );
    // firstPersonControl.heightMax = 10;
    // firstPersonControl.heightMin = 10;

    // 添加环境光
    var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 ); // soft white light
    scene.add( ambientLight );
    /**
     * 设置平行光
     * DirectionalLight( color : Integer, intensity : Float )
     * color - (可选参数) 16进制表示光的颜色。 缺省值为 0xffffff (白色)。
     * intensity - (可选参数) 光照的强度。缺省值为1。
     * position.set() - 设置平行光的方向
     * 
    */
    dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.position.set( 1, 1, 1 );
    scene.add( dirLight );

      // 辅助轴:红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
    var axesHelper = new THREE.AxesHelper( 2000 );
    scene.add( axesHelper );

    /**
     * .load ( url : String, onLoad : Function, onProgress : Function, onError : Function ) : null
     * url — 包含有.gltf/.glb文件路径/URL的字符串。
     * onLoad — 加载成功完成后将会被调用的函数。该函数接收parse所返回的已加载的JSON响应。
     * onProgress — （可选）加载正在进行过程中会被调用的函数。其参数将会是XMLHttpRequest实例，包含有总字节数.total与已加载的字节数.loaded。
     * onError — （可选）若在加载过程发生错误，将被调用的函数。该函数接收error来作为参数。
     * 开始从url加载，并使用解析过的响应内容调用回调函数。
    */
    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( 'threejs/js/draco/' );
    var loader = new GLTFLoader();
    loader.setDRACOLoader( dracoLoader );
    loader.load( 'threejs/models/bgs2.gltf', function ( gltf ) {
      var model = gltf.scene;
      model.position.set( 0, 0, 0 );
      model.scale.set( 0.5, 0.5, 0.5 );
      // 遍历模型节点
      model.traverse( function ( child ) {
        if ( child.isMesh ) {
          model.castShadow = true;
          model.receiveShadow = true;
        } 
      } );
      scene.add( model );

      animate();
    }, onProgress, function ( e ) {
      console.error( e );
    } );
        
    // 加载进度回调
    var onProgress = function(xhr) {
      if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
      }
    };

    // 浏览器窗口大小改变时触发
    window.onresize = function () {
      // console.log('window.onresize')
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
      firstPersonControl.handleResize();
    };

    /**
     * html5 还提供一个专门用于请求动画的API，那就是 requestAnimationFrame，顾名思义就是请求动画帧。
     * 获取自 oldTime 设置后到当前的秒数。 同时将 oldTime 设置为当前时间。
     * 如果 autoStart 设置为 true 且时钟并未运行，则该方法同时启动时钟。
    */
    function animate() {
      // console.log('animate')
      requestAnimationFrame( animate );
      var delta = clock.getDelta();
      firstPersonControl.update( delta );
      // controls.update();
      // stats.update();
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFShadowMap
      renderer.render( scene, camera );
    }
  },
  methods:{

  }
};
</script>

<style>

</style>