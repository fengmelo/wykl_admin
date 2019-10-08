<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">添加用户组</el-button>

    <el-table :data="groupsList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="id" width="220">
        <template slot-scope="scope">
          {{ scope.row._id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="组名" width="220">
        <template slot-scope="scope">
          {{ scope.row.title }}
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户组':'添加用户组'">
      <el-form :rules="groupRules"  ref="handleForm" :model="group" label-width="80px" label-position="left" class="handleForm">
        <el-form-item label="账号"  prop="title" >
          <el-input autocomplete="off"v-model="group.title" placeholder="名称" />
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
						class="permission-tree"
					/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>



		<el-dialog :visible.sync="dialogVisibleGroup" title="添加用户组">
      <el-form  label-width="80px" label-position="left" class="handleForm">
        <el-form-item label="账号"  prop="username" >
            <el-select v-model="user_id" filterable placeholder="请选择">
							<el-option
								v-for="item in users"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
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
import { getGroup, addGroup, editGroup } from "@/api/group";
import {getNodeTree} from "@/api/node";
import Pagination from "@/components/Pagination";

const  defaultGroup = {
	title: "",
	node_ids:null
};
export default {
  data() {
    return {
      group: Object.assign({}, defaultGroup),
      groupRules: {
        title: [
          { required: true, trigger: "blur", message: "名称不能为空" }
        ]
      },
      groupsList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      passwordType: "password",
      dialogVisible: false,
      dialogType: "new",
			dialogVisibleGroup:false,
			users:[],
			user_id:null,
			checkStrictly:false,
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
        this.group = Object.assign({}, defaultGroup);
				this.$refs.handleForm.clearValidate();
				this.$refs.tree.setCheckedKeys([]);
      }
    }
  },
  methods: {
    async getList() {
      const res = await getGroup(this.listQuery);
      this.groupsList = res.data.items;
      this.total = res.data.total;
    },

    async getRoutesData() {
      const res = await getNodeTree();
      this.routesData = res.data.items;
    },
    handleAddRole() {
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleEdit(scope) {
			
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.group = Object.assign({}, scope.row);
			this.currentGroup = scope.row;
			this.$nextTick(()=>{
				this.$refs.tree.setCheckedKeys(scope.row.node_ids);
			})
    },

    confirmRole() {
			 this.$refs.handleForm.validate(async valid => {
        if (valid) {
					const checkedKeys = this.$refs.tree.getCheckedKeys();
					this.group.node_ids=checkedKeys
					if (this.dialogType == "new") {
						const res = await addGroup(this.group);
						if (res.code == 20000) {
							this.$message({
								message: "操作成功",
								type: "success"
							});
							if (this.listQuery.page == 1) {
								this.groupsList.unshift(res.data.group);
								this.groupsList.splice(this.listQuery.limit, 1);
								this.total += 1;
							} else {
								this.getList();
							}

							this.dialogVisible = false;
						} else {
							this.$message.error(res.message);
						}
					} else {
						const res = await editGroup({
							node_ids:this.group.node_ids,
							title: this.group.title,
							id: this.currentGroup._id
						});
						if (res.code == 20000) {
							this.$message({
								message: "操作成功",
								type: "success"
							});
							this.currentGroup.title = this.group.title;
							this.currentGroup.node_ids = this.group.node_ids;
							this.dialogVisible = false;
						} else {
							this.$message.error(res.message);
						}
					} 
        } else {
          return false
        }
			})
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
