<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">添加结点</el-button>

    <el-table :data="nodesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="id" width="220">
        <template slot-scope="scope">
          {{ scope.row._id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
			<el-table-column align="center" label="标示" width="220">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
			<el-table-column align="center" label="上级结点" width="220">
        <template slot-scope="scope">
          {{ scope.row.pid }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="添加时间">
        <template slot-scope="scope">
          {{ scope.row.meta.createdAt | parseTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>


		<pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑结点':'添加结点'">
      <el-form :rules="nodeRules"  ref="handleForm" :model="node" label-width="80px" label-position="left" class="handleForm">
        <el-form-item label="名称"  prop="title" >
          <el-input autocomplete="off" v-model="node.title" placeholder="名称" />
        </el-form-item>
				<el-form-item  label="标示" prop="code">
					<el-input autocomplete="off" v-model="node.code" placeholder="标示" />
				</el-form-item>
				<el-form-item label="结点树" v-if="routesData.length">
					<el-tree 
						ref="tree"
						:check-strictly="checkStrictly"
						:data="routesData"
						:props="defaultProps"
						show-checkbox
						node-key="_id"
						default-expand-all	
						:check-on-click-node=true
						@check-change="handleClick" 	
						class="permission-tree"
					/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import path from "path";
import { deepClone, parseTime } from "@/utils";
import { getNode, addNode, editNode, getNodeTree } from "@/api/node";
import Pagination from "@/components/Pagination";

const defaultNode = {
  title: "",
  code: "",
  pid: ""
};
export default {
  data() {
    return {
      node: Object.assign({}, defaultNode),
      nodeRules: {
        title: [{ required: true, trigger: "blur", message: "名称不能为空" }],
        code: [{ required: true, trigger: "blur", message: "标示不能为空" }]
      },
      nodesList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      dialogVisible: false,
      dialogType: "new",
      checkStrictly: true,
      routesData: [],
      defaultProps: {
        children: "children",
        label: "title"
      }
    };
  },
  components: {
    Pagination
  },
  created() {
    this.getList();
    this.getRoutesData();
  },
  watch: {
    dialogVisible(bool) {
      if (bool == false) {
        this.node = Object.assign({}, defaultNode);
				this.$refs.handleForm.clearValidate();
				this.$refs.tree.setCheckedKeys([]);
      }
    }
  },
  methods: {
    async getList() {
      const res = await getNode(this.listQuery);
      this.nodesList = res.data.items;
      this.total = res.data.total;
    },
    async getRoutesData() {
      const res = await getNodeTree();
      this.routesData = res.data.items;
    },
    handleClick(data, checked, node) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([data]);
      }
    },
    handleAddRole() {
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.node = Object.assign({}, scope.row);
			this.currentNode = scope.row;
			this.$nextTick(()=>{
				this.$refs.tree.setCheckedKeys([scope.row.pid]);
			})
    },

    confirmRole() {
      this.$refs.handleForm.validate(async valid => {
        if (valid) {
          const checkedKeys = this.$refs.tree.getCheckedKeys();
          if (checkedKeys.length > 1) {
            this.$message.error("请勿多选");
            return false;
          }
          this.node.pid = checkedKeys[0] || "";

          if (this.dialogType == "new") {
            const res = await addNode(this.node);
            if (res.code == 20000) {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              if (this.listQuery.page == 1) {
                this.nodesList.unshift(res.data.node);
                this.nodesList.splice(this.listQuery.limit, 1);
                this.total += 1;
              } else {
                this.getList();
              }
              this.getRoutesData();
              this.dialogVisible = false;
            } else {
              this.$message.error(res.message);
            }
          } else {
            const res = await editNode({
              pid: this.node.pid,
              code: this.node.code,
              title: this.node.title,
              id: this.currentNode._id
            });
            if (res.code == 20000) {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.currentNode.title = this.node.title;
              this.currentNode.code = this.node.code;
              this.dialogVisible = false;
            } else {
              this.$message.error(res.message);
            }
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
.handleForm {
  .el-input {
    width: 90%;
    margin-right: 20px;
  }
}
</style>
