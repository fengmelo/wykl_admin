<template>
	<div>
		<div class="upload-top">
			<el-upload
			class="upload-demo"
			action="http://localhost:3000/api/upload/index"
			:on-preview="handlePreview"
			:on-remove="handleRemove"
			:before-remove="beforeRemove"
			multiple
			:on-success="onSuccess">
			<el-button size="small" type="primary" style="float:left">点击上传</el-button>
			<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
			<el-button type="primary" plain class="pre"  style="float:right" @click="pre">上一步</el-button>
			<el-button  type="primary"  class="next" style="float:right" @click="next">下一步</el-button>
		</div>
		<div class="carousel">
			<el-carousel  style="width:400px;" v-show="fileList.length">
      <el-carousel-item v-for="(item,index) in fileList" :key="index">
        <img style="width:400px" :src="item.url"/>
      </el-carousel-item>
    </el-carousel>
		</div>
		
	</div>
</template>
<script>
export default {
	props:{
		fatherFileList:{
			type:Array
		}
	},
	watch:{
		fatherFileList(arr){
			this.fileList=arr.slice()
		}
	},
  data() {
    return {
      fileList:[]
    };
  },
  methods: {
		onSuccess(res,file){
			this.fileList.push({
				url:res.data.url,
				uid:file.uid
			})
		},
    handleRemove(file, fileList) {
			this.fileList.splice(this.fileList.findIndex(item=>{
				return file.uid==item.uid
			}),1)
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
		},
		pre() {
      this.$emit("pre");
    },
    next() {
      this.$emit("next",{
				carousel:this.fileList
			});
    }
  }
};
</script>

<style lang="scss">
.el-carousel__container{
	height:400px;
}
.upload-top{
	position:relative;
	.pre{
		position:absolute;
		top:0;
		right:100px;
	}
	.next{
		position:absolute;
		top:0;
		right:0;
	}
}
</style>
