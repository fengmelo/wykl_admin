<template>
	<div>
		<editor v-model="content" ></editor>
		<div style="margin-top:50px;">
			<el-button type="primary"  plain @click="pre">上一步</el-button>
			<el-button  type="primary" @click="submit" :disabled="disabled">提交</el-button>
		</div>
	</div>
</template>
<script>

import Editor from "@/components/Editor";
export default {
  components: {
    Editor
  },
  props: {
    fContent: {
      type: String
    }
  },
  data() {
    return {
      content: "",
      disabled: false
    };
	},
  watch: {
    fContent(content) {
      this.content = content;
    }
  },
  methods: {
    pre() {
      this.$emit("pre");
    },
    submit() {
      this.disabled = true;
       this.$emit(
          "submit",
          {
            content: this.content
          },
          () => {
            this.disabled = false;
          }
        );
    }
  }
};
</script>
<style>
.ql-editor {
  min-height: 300px;
}
</style>