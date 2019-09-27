<template>
	<el-upload
		class="avatar-uploader"
		action="http://localhost:3000/api/upload/index"
		:show-file-list="false"
		:on-success="handleSuccess"
		:before-upload="beforeUpload">
		<img v-if="imageUrl" :src="imageUrl" class="avatar">
		<i v-else class="el-icon-plus avatar-uploader-icon"></i>
	</el-upload>
</template>

<script>
export default {
  props: {
    onSuccess: {
      type: Function,
      default() {
        return {};
      }
    },
    index: {
      type: Number,
      default: 0
    },
    url: {
      type: String,
      default: ""
    }
  },
  created() {
    this.imageUrl = this.url ? this.url : "";
  },
  data() {
    return {
      imageUrl: ""
    };
  },
  methods: {
    handleSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      const { filename, url } = res.data;
      this.onSuccess(
        {
          name: filename,
          url
        },
        this.index
      );
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
			}
			return isLt2M;

    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 300px;
  height: 178px;
  display: block;
}
</style>
