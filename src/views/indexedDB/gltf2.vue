<template>
  <div>
    <div id="container"></div>
    <div id="noticeBox">我是一个弹出框</div>
  </div>
</template>
<script>
import mainFunction from '@/threejs/main.js'
export default {
  name: "gltf2",
  data() {
    return {

    };
  },
  mounted() {
    mainFunction()
  },
  methods:{

}
};
</script>

<style>
#noticeBox {
  position: fixed;
  padding: 15px;
  background: rgba(255, 255, 255, 0.8);
  line-height: 1;
  border-radius: 5px;
  color: blue;
}
</style>