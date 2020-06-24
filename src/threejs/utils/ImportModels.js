import { GLTFLoader } from '../js/loaders/GLTFLoader.js'
import { DRACOLoader } from '../js/loaders/DRACOLoader.js'
import modelsArr from '../config/models/index'

/**
 * ImportModels 导入模型的封装方法
 * scene - 场景
 * objects - 放置模型的数组
*/
var ImportModels = function(scene, objects) {
  let dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath( '../../../threejs/js/draco/' )
  let loader = new GLTFLoader()
  loader.setDRACOLoader( dracoLoader )

  for (let item of modelsArr) {
    // 网络请求下载
    loader.load( item.url, function ( gltf ) {
      let model = gltf.scene
      model.position.set( item.position[0], item.position[1], item.position[2] )
      model.scale.set( item.scale[0], item.scale[1], item.scale[2] )
      model.rotation.y = item.rotationY
      // 遍历模型节点
      model.traverse( function ( child ) {
        if ( child.isMesh ) {
          model.castShadow = true
          model.receiveShadow = true
        } 
      })
      scene.add( model )
      objects.push( model )
      if (item.children.length > 0) {
        for (let cloneItem of item.children) {
          // 克隆父模型
          let childModel = model.clone()
          childModel.position.set( cloneItem.position[0], cloneItem.position[1], cloneItem.position[2] )
          childModel.scale.set( cloneItem.scale[0], cloneItem.scale[1], cloneItem.scale[2] )
          childModel.rotation.y = cloneItem.rotationY
          // 遍历模型节点
          childModel.traverse( function ( child ) {
            if ( child.isMesh ) {
              childModel.castShadow = true
              childModel.receiveShadow = true
            } 
          })
          scene.add( childModel )
          objects.push( childModel )
        }
      }
    }, undefined, function ( e ) {
      console.error( e )
    })
  }
}

export default ImportModels

// var ImportModels = function(scene, objects) {
//   let dracoLoader = new DRACOLoader()
//   dracoLoader.setDecoderPath( '../../../threejs/js/draco/' )
//   let loader = new GLTFLoader()
//   loader.setDRACOLoader( dracoLoader )
//   loader.load( '../../../threejs/models/emerald.gltf', function ( gltf ) {
//     let model = gltf.scene
//     model.position.set( 100, 60, -960 )
//     model.scale.set( 0.5, 0.5, 0.5 )
//     // 遍历模型节点
//     model.traverse( function ( child ) {
//       if ( child.isMesh ) {
//         model.castShadow = true
//         model.receiveShadow = true
//       } 
//     } )
//     scene.add( model )
//     objects.push( model )
//   }, undefined, function ( e ) {
//     console.error( e )
//   } )
// }