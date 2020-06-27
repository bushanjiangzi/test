
const baseUrl = '../../../threejs/models' // 基本路径
const scale = [0.5, 0.5, 0.5]
const rotationY = 0

/**
 * url - 模型的路径
 * name - 模型名称
 * position: [x, y, z] - 模型的三维坐标
 * scale[x, y, z] - 模型的缩放比例
 * parent - 复制对象的键值
 * rotationY - 绕Y轴旋转的角度
*/
const emerald = [
  {
    url: baseUrl + '/emerald.gltf',
    name: '宝石1',
    position: [100, 10, -960],
    scale,
    parent: 'emerald',
    rotationY,
    children: [
      {
        name: '宝石2',
        position: [100, 20, -900],
        scale,
        parent: 'emerald',
        rotationY
      },
      {
        name: '宝石3',
        position: [100, 30, -1020],
        scale,
        parent: 'emerald',
        rotationY
      }
    ]
  }
  // {
  //   url: '',
  //   name: '宝石2',
  //   position: [100, 60, -900],
  //   scale: scale,
  //   parent: 'emerald',
  //   copy: true
  // },
  // {
  //   url: '',
  //   name: '宝石3',
  //   position: [100, 60, -1020],
  //   scale: scale,
  //   parent: 'emerald',
  //   copy: true
  // }
]

export default emerald