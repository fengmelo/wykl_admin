<template>
	<div class="app-container">
		<div class="header">
			<el-steps :active="stepActive" align-center>
				<el-step title="基本信息" description=""></el-step>
				<el-step title="款式" description=""></el-step>
				<el-step title="属性" description=""></el-step>
				<el-step title="图片" description=""></el-step>
				<el-step title="详情" description=""></el-step>
			</el-steps>
		</div>
		<div class="content">
			<product-base ref="base" v-show="stepActive==1"  @next="next" :fatherForm="form"></product-base>
			<product-design v-show="stepActive==2"   @next="next" @pre="pre" :models="form.models"></product-design>
			<product-attribute v-show="stepActive==3"  @next="next" @pre="pre" :attrs="form.attrs"></product-attribute>
			<product-slider v-show="stepActive==4"  @next="next" @pre="pre" :fatherFileList="form.carousel || []"></product-slider>
			<product-detail v-show="stepActive==5"  @submit="submit" @pre="pre" :fContent="form.content"></product-detail>
		</div>		
	</div>
</template>
<script>
import ProductBase from "@/components/Product/base";
import ProductDesign from "@/components/Product/design";
import ProductSlider from "@/components/Product/slider";
import ProductAttribute from "@/components/Product/attribute";
import ProductDetail from "@/components/Product/detail";
import { createProduct, editProduct, fetchProductDetail } from "@/api/product";
import * as R from "ramda";

export default {
  data() {
    return {
      stepActive: 1,
      form: {
				title: "",
				recommend:"",
        desc: "",
        newPrice: "",
        vipPrice: "",
        discount: "",
        beginTime: "",
        endTime: "",
        price: "",
        weight: 0,
        isKl: false, //非自营
        tags: [],
        models: [],
        attrs: [],
        showPlanes: [],
        carousel: [],
        content: ""
      }
    };
  },
  components: {
    ProductBase,
    ProductDesign,
    ProductSlider,
    ProductAttribute,
    ProductDetail
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      this.action = "edit";
      this.detail();
    } else {
      this.action = "add";
    }
  },
  methods: {
    detail() {
      fetchProductDetail({ id: this.id }).then(res => {
        this.form = R.pick(R.keys(this.form))(res.data.product)
      });
    },
    pre() {
      this.stepActive--;
    },
    next(item) {
      this.form = Object.assign(this.form, item);
      if (this.stepActive == 1) {
        if (!this.form.models || !this.form.models.length) {
          this.$message.error("请先添加款式");
          return;
        }
      }
      if (this.stepActive == 2) {
        if (!this.form.attrs || !this.form.attrs.length) {
          this.$message.error("请先添加属性");
          return;
        }
      }
      this.stepActive++;
    },
    submit(item,fn) {
      setTimeout(() => {
        const data = Object.assign({}, this.form, item);
        data.beginTime = +data.beginTime / 1000;
				data.endTime = +data.endTime / 1000;
        if (this.action == "add") {
          createProduct(data).then(res => {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            setTimeout(() => {
							fn()
              this.$router.push({
                name: "ProductList"
              });
            }, 1000);
          });
        } else {
          data.id = this.id;
          editProduct(data).then(res => {
            this.$message({
              message: "编辑成功",
              type: "success"
            });
            setTimeout(() => {
							fn()
              this.$router.push({
                name: "ProductList"
              });
            }, 1000);
          });
        }
      }, 2000);
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .header {
    margin-top: 40px;
  }
  .content {
    margin-top: 40px;
    padding: 0 130px;
  }
}
</style>

