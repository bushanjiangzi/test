<template>
  <div id="container">yyy</div>
</template>
<script>
import * as THREE from "three";
import dat from 'dat.gui'
// import GLTFLoader from 'GLTFLoader'
// import DRACOLoader from 'DRACOLoader'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  name: "vue-three",
  data() {
    return {

    };
  },
  mounted() {
    var container, stats;
    var camera, scene, renderer, controls, pointLight, obj;
    init();
    animate();

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(150, 150, 150)

        scene = new THREE.Scene();
        var axes = new THREE.AxisHelper(100);
        scene.add(axes);
        var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        scene.add(ambientLight);

        pointLight = new THREE.PointLight(0xffffff, 0.8);
        scene.add(pointLight);
        camera.add(pointLight);
        scene.add(camera);
        camera.lookAt(scene.position);
        loadGltf()

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(new THREE.Color(0xcccccc));
        container.appendChild(renderer.domElement);
    }

    var onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    function loadObj() {
        var a = new Date().getTime() / 1000
            //如果有mtl文件 安装下面方法加载
            // new THREE.MTLLoader()
            //     .load('../assets/luyu.mtl', function(materials) {
            //         materials.preload();
            //         new THREE.OBJLoader()
            //             .setMaterials(materials)
            //             .load('../assets/luyu.obj', function(object) {
            //                 obj = object
            //                 obj.rotation.set(5, 0, 3)
            //                 obj.scale.set(0.5, 0.5, 0.5)
            //                 scene.add(object);
            //                 console.log((new Date().getTime() / 1000) - a + " s")
            //             }, onProgress);
            //     });
        // new THREE.OBJLoader()
        //     .load('luyu.obj', function(object) {
        //         obj = object
        //         obj.rotation.set(5, 0, 3)
        //         obj.scale.set(0.5, 0.5, 0.5)
        //         scene.add(object);
        //         console.log((new Date().getTime() / 1000) - a + " s")
        //     }, onProgress);
    }

    function loadGltf() {
        var a = new Date().getTime() / 1000
        var gltfloader = new GLTFLoader()
        gltfloader.setDRACOLoader(new DRACOLoader());
        gltfloader.load('luyu.gltf', function(gltf) {
            var object = gltf.scene
            var objBbox = new THREE.Box3().setFromObject(gltf.scene);
            var bboxCenter = objBbox.getCenter().clone();
            bboxCenter.multiplyScalar(-1);
            object.traverse(function(child) { //转换成threejs对象
                if (child instanceof THREE.Mesh) {
                    child.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);
                }
            });
            objBbox.setFromObject(object); // Update the bounding box
            obj = object
            obj.rotation.set(5, 0, 3)
            obj.scale.set(0.5, 0.5, 0.5)
            scene.add(object);
            // self.postMessage(JSON.stringify(scene.toJSON()))
            console.log(scene)
            console.log('webwork send scene')
            console.log((new Date().getTime() / 1000) - a + " s")
        }, onProgress);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {

        renderer.render(scene, camera);
    }
  },
  methods:{

}
};
</script>

<style>
body {
    font-family: Monospace;
    background-color: #000;
    color: #fff;
    margin: 0px;
    overflow: hidden;
}

#info {
    color: #fff;
    position: absolute;
    top: 10px;
    width: 100%;
    text-align: center;
    z-index: 100;
    display: block;
}

#info a,
.button {
    color: #f00;
    font-weight: bold;
    text-decoration: underline;
    cursor: pointer
}
</style>