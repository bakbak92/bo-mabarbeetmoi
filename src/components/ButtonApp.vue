<template>
    <button :class="role" :type="type" :disabled="disabled">
        <slot></slot>
    </button>
</template>
<script>
export default {
    props: {
        role: {
            type: String,
            default: null
        },
        type: {
            type: String,
            default: () => 'button'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    }
}
</script>
<style lang="scss">
@import "../assets/colors";
button{
    padding: 10px 20px;
    border: 1px solid;
    border-radius: 4px;
    margin-left: 20px;
    cursor: pointer;
    &:disabled{
        cursor: not-allowed;
    }
    &.save{
        background-color: $green;
        border-color: $green;
        color: white;
        &:hover{
            background-color: white;
            color: $green;
        }
    }
    &.remove{
        background-color: $red;
        border-color: $red;
        color: white;
        &:hover{
            background-color: white;
            color: $red;
        }
    }
    &.cancel{
        background-color: $grey;
        border-color: $grey;
        &:hover{
            background-color: white;
            color: grey;
            border-color: grey;
        }
    }
    &.add{
        background-color: $gold;
        border-color: $gold;
        color: white;
        &:hover{
            color: $gold;
            background-color: white;
        }
    }
}
</style>