<template>
	<div>
		<el-form ref="form" :model="form" label-width="120px">
			<div v-if="models" v-for="(item,index) in form.models" :key="index">
				<el-form-item :label="item.name+'-价格'" :prop="'models.' + index + '.price'"  :rules="[{
      required: true, message: '价格不能为空', trigger: 'blur'
    }, floatRule]">
					<el-input v-model="item.price"></el-input>
				</el-form-item>
				<el-form-item :label="item.name+'-图片'">
					<upload :url="item.url"  :on-success="onSuccess" :index="index" ref="upload" ></upload>
				</el-form-item>	
			</div>
		
			<el-form-item style="float:right;margin-top:40px;margin-right:150px;">
				<el-button type="primary" plain @click="pre">上一步</el-button>
				<el-button  type="primary" @click="next">下一步</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import Upload from "@/components/Upload";
import {floatRule} from '@/utils/validate'

export default {
  name: "ProductDesign",
  components: {
    Upload
  },
  props: {
    models: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
			form:{
				models:[]
			},
			floatRule
    };
	},
	watch:{
		models(models){
			console.log('models=',models)
			this.form.models=models
		}
	},
  methods: {
    onSuccess(res, index) {
      this.models[index].url = res.url;
    },
    pre() {
      this.$emit("pre");
    },
    next() {
      this.$emit("next", {
        models: this.form.models
      });
    }
  }
};
</script>
<style lang="scss">
.avatar{
	width: 300px;
	height:300px;
}		
</style>