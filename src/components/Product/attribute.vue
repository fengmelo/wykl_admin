<template>
	<div>
		<el-form ref="form"  label-width="120px">

			<div v-for="(item,index) in attrs" :key="index">
				<el-form-item :label="item.name">
					<el-input
									class="input-new-tag"
									v-model="attrInputValues[index].value"
									ref="saveTagInput"
									size="small"
									@keyup.enter.native="handleInputConfirm(index)"
									@blur="handleInputConfirm(index)"
									placeholder="确定请按enter"
								>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-tag closable  @close="handleClose(index,item)"  v-for="(item,childIndex) in attrs[index].tags" :key="childIndex">{{item}}</el-tag>
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
let arrs = [];
export default {
  name: "ProductAttribute",
  props: {
    attrs: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
			attrInputValues:[]
    };
  },
	watch: {
		attrs(attrs){
			 this.attrInputValues=attrs.map(attr => {
        return {
					value: ""
        };
      });
		}
	},

  methods: {
		handleClose(index,item){
			const dIndex=this.attrs[index].tags.indexOf(item)
			this.attrs[index].tags.splice(dIndex,1)
		},
		handleInputConfirm(index){
			const value=this.attrInputValues[index].value
			this.attrs[index].tags=this.attrs[index].tags || []
			if(value&&!this.attrs[index].tags.includes(value)){
				this.attrs[index].tags.push(value)
				this.attrInputValues[index].value=''
			}
		},
    pre() {
      this.$emit("pre");
    },
    next() {
      this.$emit("next",{
				attrs:this.attrs
			});
    }
  }
};
</script>
<style lang="scss" scoped>
.el-tag{
	margin-right:20px;
}
</style>
