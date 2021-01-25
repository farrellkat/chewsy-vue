<template lang="pug">
  #app
    .chewsy.left CHEWSY
    layout-default
    .chewsy.right CHEWSY
</template>

<style>
#app {
  height: inherit;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 30rem;
  margin: auto;
}
.chewsy {
  color: pink;
}
.left {
  transform: rotate(270deg);
  position: absolute;
  top: 35%;
  left: -10rem;
  font-size: 11rem;
  z-index: -1;
  background: linear-gradient(145deg, #f0f0f0, pink);
  text-shadow: 20px 20px 60px pink, -20px -20px 60px #ffffff;
  /* text-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.12), 0 4px 4px rgba(0, 0, 0, 0.12),
    0 8px 8px rgba(0, 0, 0, 0.12), 0 16px 16px rgba(0, 0, 0, 0.12); */
}
.right {
  transform: rotate(90deg);
  position: absolute;
  top: 35%;
  right: -10rem;
  font-size: 11rem;
  z-index: -1;
  /* text-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.12), 0 4px 4px rgba(0, 0, 0, 0.12),
    0 8px 8px rgba(0, 0, 0, 0.12), 0 16px 16px rgba(0, 0, 0, 0.12); */
  background: linear-gradient(145deg, #f0f0f0, pink);
  text-shadow: 20px 20px 60px pink, -20px -20px 60px #ffffff;
}
</style>
