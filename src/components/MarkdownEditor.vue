<template>
    <div class="markdown-editor">
        <div class="container-commands">
            <ul v-if="mode === 'edit'">
                <li class="fa-solid fa-bold"
                    @click="wrap('**')"
                ></li>
                <li class="fa-solid fa-italic"
                    @click="wrap('*')"
                ></li>
                <li class="fa-solid fa-list-ul"
                    @click="wrap('<br/>', '')"
                ></li>
            </ul>
            <ul>
                <li @click.stop="mode = 'edit'"
                    :class="{active: mode === 'edit'}"
                >Mode Edition</li>
                <li @click.stop="mode = 'preview'"
                    :class="{active: mode === 'preview'}"
                >Mode Visualisation</li>
            </ul>
        </div>
        <div class="container-edit"
             v-if="mode === 'edit'"
        >
            <textarea @input="$emit('update:modelValue', $event.target.value)"
                      :rows="rows"
                      :value="modelValue"
                      :placeholder="placeholder"
                      ref="input"
                      @keydown.ctrl="triggerShortcut"
                      :required="required"
            ></textarea>
        </div>
        <div class="container-preview"
             v-if="mode === 'preview'"
             v-html="compiled"
        ></div>
    </div>
</template>

<script>
    import {marked} from "marked";

    export default {
        computed: {
            compiled() {
                return this.modelValue ? marked(this.modelValue) : ""
            }
        },
        data: () => {
            return {
                mode: "edit"
            };
        },
        methods: {
            /**
             * @param {Event} evt
             */
            triggerShortcut(evt) {
                switch (evt.key) {
                    case "b":
                        this.wrap("**");
                        break;
                    case "i":
                        this.wrap("*");
                        break;
                    case "e":
                        this.wrap("`");
                        break;
                    case "k":
                        this.wrap("[", "]()");
                        break;
                }
            },
            /**
             * Wraps current selection (if any) between given markup in component main input. If no selection is found,
             * markup is just added and cursor is placed between them.
             *
             * @param {String} before
             * @param {String} [after=before]
             */
            wrap(before, after) {
                console.log(this.compiled)
                console.log(this.modelValue)
                if (before === undefined) {
                    throw new Error("MarkdownEditor.wrap() requires parameter 1");
                }

                if (after === undefined) {
                    after = before;
                }

                const input = this.$refs.input;
                input.focus();

                const start = input.selectionStart;
                const end = input.selectionEnd;
                const selected = input.value.substring(start, end);
                let cursorPosition = 0;

                input.value = [
                    input.value.substr(0, start),
                    before,
                    selected,
                    after,
                    input.value.substr(end)
                ].join("");

                cursorPosition = (selected.length === 0)
                    ? start + before.length // No text was selected, cursor is placed between markup
                    : start + before.length + selected.length + after.length; // Text was selected, cursor is placed after closing markup

                input.selectionStart = cursorPosition;
                input.selectionEnd = cursorPosition;
                this.$emit("update:modelValue", input.value);
            }
        },
        name: "MarkdownEditor",
        emits: ['update:modelValue'],
        props: {
            required: {
                type: Boolean,
                default: false
            },
            rows: {
                type: Number,
                default: 8
            },
            modelValue: {
                type: String,
                default: ""
            },
            placeholder: {
                type: String,
                default: ""
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/colors";

    .markdown-editor {
        .container-commands {
            ul {
                margin: 0;
                padding: 0;
                list-style: none;
                font-size: 0;
            }

            li {
                //@include transition(color);
                display: inline-block;
                font-size: 12px;
                padding: 0 8px;
                cursor: pointer;
                line-height: 24px;

                &:hover {
                    color: $green;
                }
            }

            ul:first-child {
                float: left;
            }

            ul:only-child,
            ul:last-child {
                float: right;

                li.active {
                    color: $green;
                }
            }
        }

        .container-edit {
            clear: both;

            textarea {
                box-sizing: border-box;
                width: 100%;
                border-radius: 4px 4px 0 4px;
                border: none;
                line-height: 24px;
                padding: 12px 16px;
                background-color: transparent;
                resize: vertical;
                font-size: 12px;
                border: 1px solid $grey;
                height: 100%;

                &:focus {
                    outline: none;
                }
            }
        }

        .container-preview {
            white-space: pre-wrap;
            clear: both;
            background-color: white;
            border: 1px solid $grey;
            padding: 0 16px;
            min-height: 30px;
            border-radius: 4px;
        }
    }
</style>
