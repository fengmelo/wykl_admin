<template>
  <div class="dashboard-editor-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      {{username}},欢迎来到考拉后台管理系统
    </el-row>
  </div>
</template>
<script>
export default {
	computed: {
		username(){
			return this.$store.getters.name
		}
	},
}
</script>

