<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">添加管理员</el-button>

    <el-table :data="usersList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="id" width="220">
        <template slot-scope="scope">
          {{ scope.row._id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="注册时间">
        <template slot-scope="scope">
          {{ scope.row.meta.createdAt | parseTime }}
        </template>
      </el-table-column>
			<el-table-column align="header-center" label="登录次数">
        <template slot-scope="scope">
          {{ scope.row.loginAttempts }}
        </template>
      </el-table-column>
			<el-table-column align="header-center" label="所属用户组">
        <template slot-scope="scope">
					<el-tag style="margin-right:5px;margin-bottom:5px;" v-for="(item,index) in getGroupTexts(scope.row.group_id)" :key="index">{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>


		<pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑管理员':'添加管理员'">
      <el-form :rules="userRules"  ref="form" :model="user"  label-position="left" class="handleForm" label-width="120px">
        <el-form-item label="账号"  prop="username" >
          <el-input autocomplete="off"v-model="user.username" placeholder="账号" />
        </el-form-item>
				<el-form-item label="密码"  prop="password" v-if="dialogType!='edit'">
					<el-input  ref="password" autocomplete='new-password' :type="passwordType" v-model="user.password" placeholder="密码" />
					<span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
				</el-form-item>
				<el-form-item label="所属用户组"  prop="group_id" >
            <el-select v-model="user.group_id" multiple filterable placeholder="请选择">
							<el-option
								v-for="item in groups"
								:key="item._id"
								:label="item.title"
								:value="item._id">
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
import { getUser, addUser, editUser } from "@/api/user";
import { getGroup } from "@/api/group";

import Pagination from "@/components/Pagination";
import * as R from 'ramda'

const defaultUser = {
  username: "",
  password: "",
  group_id: null
};
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位数"));
      } else {
        callback();
      }
    };
    return {
      user: Object.assign({}, defaultUser),
      userRules: {
        username: [
          { required: true, trigger: "blur", message: "账号不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      usersList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      passwordType: "password",
      dialogVisible: false,
      dialogType: "new",
      groups: []
    };
  },
  components: {
    Pagination
  },
  created() {
    this.getList();
    this.getGroups();
	},
	computed: {
		groupsById(){
			return R.indexBy(R.prop('_id'),this.groups)
		}
	},
  watch: {
    dialogVisible(bool) {
      if (bool == false) {
        this.user = Object.assign({}, defaultUser);
        this.$refs.form.clearValidate();
      }
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    async getList() {
      const res = await getUser(this.listQuery);
      this.usersList = res.data.items;
      this.total = res.data.total;
    },
    async getGroups() {
      const res = await getGroup({
        page: 0,
        limit: 9999
      });
      console.log("res=", res);
      this.groups = res.data.items;
		},
		getGroupTexts(group_ids){
			return group_ids.reduce((text,group_id)=>{
				if(this.groupsById[group_id]){
					text.push(this.groupsById[group_id].title)
					return text
				}
			},[])
		},
    handleAddRole() {
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.user = Object.assign({}, scope.row);
			this.currentUser = scope.row;
    },

    async confirmRole() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.dialogType == "new") {
            const res = await addUser(this.user);
            console.log("res=", res);
            if (res.code == 20000) {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              if (this.listQuery.page == 1) {
                this.usersList.unshift(res.data.user);
                this.usersList.splice(this.listQuery.limit, 1);
                this.total += 1;
              } else {
                this.getList();
              }

              this.dialogVisible = false;
            } else {
              this.$message.error(res.data.message);
            }
          } else {
            if (this.currentUser.username === this.user.username && R.equals(this.currentUser.group_id, this.user.group_id)) {
              return (this.dialogVisible = false);
            }
            const res = await editUser({
              username: this.user.username,
							id: this.currentUser._id,
							group_id:this.user.group_id
            });
            if (res.code == 20000) {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.currentUser.username = this.user.username;
							this.currentUser.group_id = this.user.group_id;
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
  .el-select {
    width: 90%;
  }
  .el-input {
    width: 90%;
    margin-right: 20px;
  }
}
</style>
