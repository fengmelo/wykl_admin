<template>
	<div class="product-base">
		<el-form ref="form" :model="form" :rules="rules" label-width="120px">
			<el-form-item label="标题" prop="title">
				<el-input v-model="form.title"></el-input>
			</el-form-item>
			<el-form-item label="推荐说明" prop="recommend">
				<el-input v-model="form.recommend"></el-input>
			</el-form-item>
			<el-form-item label="简介" prop="desc">
				<el-input type="textarea" v-model="form.desc"></el-input>
			</el-form-item>
			<el-form-item label="新人价" prop="newPrice">
				<el-input  v-model="form.newPrice"></el-input>
			</el-form-item>
			<el-form-item label="会员价" prop="vipPrice">
				<el-input v-model="form.vipPrice"></el-input>
			</el-form-item>
			<el-form-item label="折扣" prop="discount">
				<el-input v-model="form.discount"></el-input>
			</el-form-item>
			<el-form-item label="折扣开始时间">
				<el-date-picker
					v-model="form.beginTime"
					type="datetime"
					placeholder="选择日期时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="折扣截止时间">
				<el-date-picker
					v-model="form.endTime"
					type="datetime"
					placeholder="选择日期时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="原价"  prop="price">
				<el-input v-model="form.price"></el-input>
			</el-form-item>
			<el-form-item label="自营">
				<el-switch v-model="form.isKl"></el-switch>
			</el-form-item>
			<el-form-item label="权重" prop="weight">
				<el-input v-model.number="form.weight"></el-input>
			</el-form-item>
			<el-form-item label="标签">
				<el-drag-select v-model="form.tags" style="width:500px;" multiple placeholder="请选择">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
				</el-drag-select>

			</el-form-item>
			
			<el-form-item label="款式">
				<el-input
								class="input-new-tag"
								v-model="inputModel"
								ref="saveTagInput"
								size="small"
								@keyup.enter.native="handleInputConfirm('model')"
								@blur="handleInputConfirm('model')"
								placeholder="确定请按enter"
							>
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-tag closable @close="handleClose('model',item)" v-for="(item,index) in form.models" :key="index">{{item.name}}</el-tag>
			</el-form-item>


			<el-form-item label="属性">
				<el-input
								class="input-new-tag"
								v-model="inputAttr"
								ref="saveTagInput"
								size="small"
								@keyup.enter.native="handleInputConfirm('attr')"
								@blur="handleInputConfirm('attr')"
								placeholder="确定请按enter"
							>
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-tag closable  @close="handleClose('attr',item)"  v-for="(item,index) in form.attrs" :key="index">{{item.name}}</el-tag>
			</el-form-item>
			
			<el-form-item label="活动板块">
				<el-checkbox-group v-model="form.showPlanes">
					<el-checkbox :label="item.id" name="type" v-for="(item,index) in positions"  :key="index">{{item.text}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
		
			<el-form-item style="float:right;margin-top:40px;margin-right:150px;">
				<el-button type="primary" @click="next">下一步</el-button>
				<el-button>取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import ElDragSelect from "@/components/DragSelect"; // base on element-ui
import { fetchList } from "@/api/config";
import * as R from "ramda";
import {floatRule} from '@/utils/validate'

export default {
  name: "ProductBase",
  components: { ElDragSelect },
  props: {
    fatherForm: {
      type: Object
    }
  },
  data() {
    return {
      form: {
				title: "",
				recommend:"",
        desc: "",
        newPrice: null,
        vipPrice: null,
        discount: null,
        beginTime: 0,
        endTime: 0,
        price: null,
        weight: 0,
        isKl: false, //非自营
        tags: [],
        models: [],
        attrs: [],
        showPlanes: []
      },
      inputModel: "",
      inputAttr: "",
      options: [],
      positions: [],
      rules: {
        title: [
          { required: true, message: "请输入商品标题", trigger: "blur" },
          { min: 3, max: 50, message: "长度在 3 到 50 个字符", trigger: "blur" }
				],
				recommend: [
          { required: true, message: "请输入商品标题", trigger: "blur" },
          { min: 3, max: 50, message: "长度在 5 到 50 个字符", trigger: "blur" }
        ],
        desc: [
          { required: true, message: "请输入商品简介", trigger: "blur" },
          {
            min: 10,
            max: 200,
            message: "长度在 10 到 200 个字符",
            trigger: "blur"
          }
        ],
        newPrice: [floatRule],
        vipPrice: [floatRule],
        discount: [floatRule],
        price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          floatRule
        ],
        weight: [{ type: "integer", message: "请输入数字", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getConfig();
  },
  watch: {
    fatherForm(obj) {
      this.assginForm(obj, this.positions);
    },
    positions(positions) {
      this.assginForm(this.fatherForm, positions);
    }
  },
  methods: {
    assginForm(form, positions) {
      if (form && positions.length) {
        form.showPlanes = form.showPlanes.map(plane => {
          return parseInt(plane);
        });
        form.beginTime = form.beginTime * 1000;
				form.endTime = form.endTime * 1000;
				form.tags=form.tags ||[]
        this.form = Object.assign({}, form);
      }
    },
    next() {
      this.$emit("next", this.form);
    },
    handleClose(type, tag) {
      const column = "input" + type.charAt(0).toUpperCase() + type.slice(1);
      const arrs = this.form[type + "s"];
      arrs.splice(
        arrs.findIndex(arr => {
          return tag.name == arr.name;
        }),
        1
      );
    },
    handleInputConfirm(type) {
      const column = "input" + type.charAt(0).toUpperCase() + type.slice(1);
      const inputValue = this[column];
      const arrs = this.form[type + "s"];
      if (inputValue && !R.pluck("name")(arrs).includes(inputValue)) {
        if (type == "model") {
          arrs.push({
            name: inputValue,
            price: "",
            url: ""
          });
        }
        if (type == "attr") {
          arrs.push({
            name: inputValue,
            tags: ""
          });
        }
        this[column] = "";
      }
    },
    getConfig() {
      fetchList({ type: "activityPosition,tagOptions" }).then(res => {
        this.positions = res.data.activityPosition;
        this.options = res.data.tagOptions;
      });
    },
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>
<style lang="scss" scoped>
.el-tag {
  margin-right: 20px;
}
</style>


