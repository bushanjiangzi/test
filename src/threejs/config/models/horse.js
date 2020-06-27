
const baseUrl = '../../../threejs/models' // 基本路径
const scale = [0.3, 0.3, 0.3] // 缩放比例
const rotationY = Math.PI / 2 // 旋转角度

/**
 * url - 模型的路径
 * name - 模型名称
 * position: [x, y, z] - 模型的三维坐标
 * scale[x, y, z] - 模型的缩放比例
 * parent - 键
 * children - 需要克隆的数组配置，克隆的对象是其父模型
 * rotationY - 绕Y轴旋转的角度
*/
const horse = [
  {
    url: baseUrl + '/horse.glb',
    name: '宝马',
    position: [0, 20, -960],
    scale,
    parent: 'horse',
    rotationY,
    children: [
      {
        name: '宝马1',
        position: [0, 10, -900],
        scale,
        parent: 'horse',
        rotationY
      },
      {
        name: '宝马2',
        position: [0, 30, -1020],
        scale,
        parent: 'horse',
        rotationY
      }
    ]
  }
]

export default horse