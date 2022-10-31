<template>
    <div class="form-input">
        <slot></slot>
    </div>
</template>
<style lang="scss">
.form-input{
    input, select, textarea{
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        border: 1px solid #b3b4b8;
        background-color: white;
        border-radius: 4px;
    }
}
</style>