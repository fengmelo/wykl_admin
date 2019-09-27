<template>
	<div>
		  <el-table
		v-loading="listLoading"
		:data="list"
		border
		fit
		highlight-current-row
		@sort-change="sortChange"
		>
		<el-table-column label="标题" min-width="150px" align="center">
			<template slot-scope="scope">
				<span>{{ scope.row.title}}</span>
			</template>
		</el-table-column>
		<el-table-column label="新人价" width="70px">
			<template slot-scope="{row}">
				<span>{{ row.newPrice }}</span>
			</template>
		</el-table-column>
		<el-table-column label="会员价" width="70px" align="center">
			<template slot-scope="scope">
				<span>{{ scope.row.vipPrice }}</span>
			</template>
		</el-table-column>
		<el-table-column  label="折扣"  width="70px" align="center">
			<template slot-scope="{row}" >
				<el-tooltip v-if="row.discount" class="item" effect="dark" :content="getDisaccount(row)" placement="top">
					<el-tag>{{row.discount}}折</el-tag>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column label="原价" prop="price" sortable  width="80px">
			<template slot-scope="scope">
				<span>{{ scope.row.price }}</span>
			</template>
		</el-table-column>
		<el-table-column label="自营" align="center" width="60">
			<template slot-scope="{row}">
				<span>{{row.isKl?'是':'否'}}</span>
			</template>
		</el-table-column>
		<el-table-column label="权重" prop="weight" sortable class-name="status-col" width="80">
			<template slot-scope="{row}">
				<span>{{row.weight}}</span>
			</template>
		</el-table-column>
		<el-table-column label="状态" class-name="status-col" width="100">
			<template slot-scope="{row}">
				<el-tag :type="row.status==1?'success':'danger'">{{row.status==1?'正常':'删除'}}</el-tag>
			</template>
		</el-table-column>
		<el-table-column label="标签" class-name="status-col" width="120">
			<template slot-scope="{row}">
				<div v-for="(item,index) in row.tags">
					<el-tag style="margin-bottom:5px;">{{tagOptionsIndexBy[item]?tagOptionsIndexBy[item].label:''}}</el-tag>
				</div>
			</template>
		</el-table-column>
		<el-table-column label="活动板块" class-name="status-col" width="200">
			<template slot-scope="{row}">
				<span v-for="(item,index) in row.showPlanes">
					<el-tag v-if="positionIndexBy[item]" style="margin-bottom:5px;margin-right:5px;">{{positionIndexBy[item].text}}</el-tag>
				</span>
			</template>
		</el-table-column>
		<el-table-column fixed="right" label="操作" align="center" width="300" class-name="small-padding fixed-width">
			<template slot-scope="{row}">
				<el-button type="primary" size="mini" @click="$router.push({
					path:`/product/edit/${row._id}`
				})">
					编辑
				</el-button>
				<el-button v-if="row.status==1" type="danger" size="mini" @click="showHandle(row)">
					删除
				</el-button>
				<el-button v-if="row.status==2" type="primary" size="mini" @click="showHandle(row)">
					正常
				</el-button>
				<el-button  size="mini" type="warning" @click="showModel(row)">
					款式
				</el-button>
				<el-button size="mini" type="info" @click="showAttr(row)">
					属性
				</el-button>
			</template>
		</el-table-column>
	</el-table>

	<pagination v-if="total>0 && showPage" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />



		<el-dialog title="款式" :visible.sync="dialogModelVisible">
			<el-table :data="modelData">
				<el-table-column property="name" label="名称" width="150"></el-table-column>
				<el-table-column property="price" label="价格" width="200"></el-table-column>
				<el-table-column label="图片">
					<template slot-scope="{row}">
						<img style="width:100px" :src="row.url" />
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>

		<el-dialog title="属性" :visible.sync="dialogAttrVisible">
			<el-table :data="attrData">
				<el-table-column property="name" label="名称" ></el-table-column>
				<el-table-column property="tag" label="属性值" >
					<template slot-scope="{row}">
						<span v-for="(item,index) in row.tags">
							<el-tag  style="margin-right:5px;">{{item}}</el-tag>
						</span>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>


		<el-dialog
			:title="currentRow.status==1?'删除商品':'恢复商品'"
			:visible.sync="dialogDeleteVisible"
			width="30%">
			<span>{{currentRow.status==1?'确定删除商品吗':'确定恢复商品吗'}}</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogDeleteVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleSetProduct">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { fetchProductList, handleProduct } from "@/api/product";
import * as R from "ramda";
import { format } from "date-fns";
import Pagination from "@/components/Pagination"; 

export default {
  name: "ProductTable",
  props: {
		type:{
			type:Number,
			default:0
		},
    listQuery: {
      type: Object
    },
    showPage: {
      type: Boolean,
      default: true
    },
    tagOptions: {
      type: Array
    },
    activityPositions: {
      type: Array
    }
	},
	components:{Pagination},
  computed: {
    tagOptionsIndexBy() {
      return R.indexBy(R.prop("value"), this.tagOptions);
    },
    positionIndexBy() {
      return R.indexBy(R.prop("id"), this.activityPositions);
    }
  },
  data() {
    return {
      listLoading: true,
      list: [],
      total: 0,
      currentRow: {},
      dialogModelVisible: false,
      dialogAttrVisible: false,
      dialogDeleteVisible: false,
      modelData: [],
      attrData: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchProductList(Object.assign({},this.listQuery,{type:this.type})).then(response => {
        this.list = response.data.items;
        this.total = parseInt(response.data.total);
        this.listLoading = false;
      });
    },
    sortChange(data) {
      this.$emit("sortChange", data);
    },
    showHandle(row) {
      this.dialogDeleteVisible = true;
      this.currentRow = row;
    },
    showModel(row) {
      this.dialogModelVisible = true;
      this.modelData = R.is(Array, row.models) ? row.models : [];
    },
    showAttr(row) {
      this.dialogAttrVisible = true;
      this.attrData = row.attrs;
    },
    handleSetProduct() {
      handleProduct({ id: this.currentRow._id }).then(res => {
        this.dialogDeleteVisible = false;
        if (res.code == 20000) {
          const index = this.list.findIndex(row => {
            return row._id == this.currentRow._id;
          });
          const status = this.currentRow.status == 1 ? 2 : 1;
          this.list.splice(
            index,
            1,
            Object.assign({}, this.currentRow, { status })
          );
          this.$message({
            message: "操作成功",
            type: "success"
          });
        }
      });
    },
    getDisaccount(row) {
      return (
        "有效期：" +
        (row.beginTime
          ? format(row.beginTime * 1000, "yyyy/MM/dd HH:mm:ss")
          : "") +
        "-" +
        (row.endTime ? format(row.endTime * 1000, "yyyy/MM/dd HH:mm:ss") : "") +
        ")"
      );
    }
  }
};
</script>

