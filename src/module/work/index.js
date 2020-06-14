// import * as THREE from 'three'

self.addEventListener('message', function(e) {
  importScripts('./loaders/GLTFLoader.js', './loaders/DRACOLoader.js');
  console.log("webwork")
  var dbname = "module"
  loadgltf(new THREE.Scene())
}, false);

function loadgltf(scene) {
  var onProgress = function(xhr) {
      if (xhr.lengthComputable) {
          var percentComplete = xhr.loaded / xhr.total * 100;
          console.log(Math.round(percentComplete, 2) + '% downloaded');
      }
  };
  var gltfloader = new THREE.GLTFLoader()
  gltfloader.setDRACOLoader(new THREE.DRACOLoader());
  gltfloader.load('luyu2.gltf', function(gltf) {
      console.log('webwork gltfloader')
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
      scene.add(object);
      console.log(scene)
      console.log('webwork send scene')
      self.postMessage(JSON.stringify(scene.toJSON()))
  }, onProgress);
}