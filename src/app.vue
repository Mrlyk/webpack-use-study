<template>
    <div id="app">
        <div class="head">
            <h2>
                App template!
            </h2>
        </div>
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
    div.head{
        width: 100px;
        height: 100px;
        background: url("./assets/IMG_1044.JPG") no-repeat center/100%;
        h2{
            color: $color;
            transform: rotate(-10deg);
        }
    }
</style>
