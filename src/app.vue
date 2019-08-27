<template>
    <div id="app">
        <div class="head">
            <h2>
                App template!
            </h2>
        </div>
        <p>还在更新吗????</p>
        <button @click="$router.push('/hello')">To Hello</button>
        <button @click="$router.push('/about')">To About</button>
        <router-view></router-view>
    </div>

</template>

<script>
  export default {
    name: "App"
  }
</script>

<style lang="scss">
    $color: lightblue;
    * {
        margin: 0;
        padding: 0;
    }

    div.head {
        width: 100px;
        height: 100px;
        background: url("./assets/IMG_1044.JPG") no-repeat center/100%;
        h2 {
            color: $color;
            transform: rotate(-10deg);
        }
    }
</style>
