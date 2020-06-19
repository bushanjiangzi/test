import * as THREE from '../js/build/three.module.js';

var CreateModel = function(scene) {
  // 天空
  this.createSky = function() {  
    var skyMaterial = new THREE.MeshLambertMaterial();
    var skyObj = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), skyMaterial );
    skyObj.position.y = 500;
    skyObj.rotation.x = Math.PI / 2;
    // skyObj.receiveShadow = true;
    scene.add( skyObj );
  }
}

export default CreateModel