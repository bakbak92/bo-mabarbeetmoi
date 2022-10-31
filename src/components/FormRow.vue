<template>
    <div class="form-row">
        <slot></slot>
    </div>
</template>
<style lang="scss">
.form-row{
    display: flex;
    gap: 20px;
    & > div {
        flex: 1 1 auto;
    }
}
</style>