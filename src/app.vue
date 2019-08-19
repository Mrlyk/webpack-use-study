<template>
    <div id="app">
        <div class="=head">
            <img src="assets/IMG_1044.JPG"/>
            <h2>
                App template!
            </h2>
        </div>
    </div>

</template>

<script>
    export default {
        name: "App"
    }
</script>

<style lang="scss">
    $color: lightblue;
    div{
        h2{
            color: $color;
            transform: rotate(-10deg);
        }
    }
</style>
