<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="210">
        <template slot-scope="scope">
          <span>{{ scope.row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.meta.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="200px" >
        <template slot-scope="scope">
         <img v-if="scope.row.url"  :src="scope.row.url" style="height:100px;" />
        </template>
      </el-table-column>
      <el-table-column label="上传人" width="210px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权重" width="110px" align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag :type="statusIndex[scope.row.status].type">
            {{ statusIndex[scope.row.status].label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status==2" size="mini" :loading="row.loading" @click="handleModifyStatus(row,1)">
            显示
          </el-button>
          <el-button v-if="row.status==1" size="mini" :loading="row.loading" type="danger" @click="handleModifyStatus(row,2)">
            隐藏
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="权重" prop="weight">
          <el-input v-model="temp.weight" placeholder="数字越大越靠前"  />
        </el-form-item>
        <el-form-item label="状态" v-if="dialogStatus ==='update' "><!--  ==='update' -->
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="(item,index) in statusOptions" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
				</el-form-item>
				<el-form-item label="上传">
          <upload :on-success="onSuccess" ref="upload"></upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createSlider, editSlider } from "@/api/slider";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
import Upload from "@/components/Upload";
import { positiveInteger } from "@/utils/validate";
import * as R from "ramda";
const statusOptions = [
  {
    value: 1,
    label: "正常",
    type: "success"
  },
  {
    value: 2,
    label: "删除",
    type: "danger"
  }
];

const resetTemp = {
  _id: undefined,
  name: "",
  url: "",
  user: undefined,
  product: undefined,
  status: 1,
  weight: null
};
export default {
  name: "SliderTable",
  components: { Pagination, Upload },
  computed: {
    statusIndex() {
      return R.indexBy(R.prop("value"), this.statusOptions);
    }
  },
  data() {
    return {
      product: null,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      statusOptions,
      temp: Object.assign({}, resetTemp),
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑轮播图",
        create: "新增轮播图"
      },
      rules: {
        weight: [{ trigger: "blur", validator: positiveInteger }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    onSuccess(item) {
      this.temp = Object.assign(this.temp, item);
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;

        setTimeout(() => {
          this.listLoading = false;
        }, 1500);
      });
    },
    handleModifyStatus(row, status) {
			row.loading = true
			this.temp = Object.assign({}, R.pick(R.keys(this.temp), row));
      this.temp.status = status;
      setTimeout(() => {
        editSlider(this.temp).then(res => {
          this.list.splice(
            this.list.findIndex(item => {
              return (item._id == this.temp._id);
            }),
            1,
            res.data
					);
        });
      }, 1500);
    },
    resetTemp() {
      this.temp = Object.assign({}, resetTemp);
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.upload.imageUrl = "";
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (!this.temp.name || !this.temp.url) {
            this.$notify({
              title: "错误",
              message: "请上传图片",
              type: "error",
              duration: 2000
            });
            return;
          }
          createSlider(this.temp).then(res => {
            this.dialogFormVisible = false;
            this.list.unshift(res.data);
            this.total += 1;
            this.$notify({
              title: "成功",
              message: "添加成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, R.pick(R.keys(this.temp), row));
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.upload.imageUrl = this.temp.url;
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          editSlider(this.temp).then(res => {
            this.list.splice(
              this.list.findIndex(item => {
                return (item._id == this.temp._id);
              }),
              1,
              res.data
            );
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "编辑成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    }
  }
};
</script>
