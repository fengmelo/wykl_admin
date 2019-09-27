<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;margin-right:20px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.isKl" placeholder="是否自营" clearable style="width: 120px;margin-right:20px;" class="filter-item">
        <el-option v-for="(item,index) in isKlOptions" :key="index" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.tag" placeholder="标签" clearable class="filter-item" style="width: 130px;margin-right:20px;">
        <el-option v-for="(item,index) in tagOptions" :key="index" :label="item.label" :value="item.value" />
      </el-select>
      <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="$router.push({
				name:'ProductAdd'
			})">
        添加商品
      </el-button>
      <el-button  :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

		<product-table ref="table" :listQuery="listQuery"  @sortChange="sortChange" :activityPositions="activityPositions" :tagOptions="tagOptions"></product-table>


  </div>
</template>

<script>
import { fetchList } from "@/api/config";
import { fetchProductList, handleProduct } from "@/api/product";
import { parseTime } from "@/utils";
import * as R from "ramda";
import ProductTable from  "@/components/Product/table";

export default {
  name: "ProductList",
  components: { ProductTable },
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
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        isKl: undefined,
        tag: undefined,
        isExport: 0,
        sort: "",
        prop: ""
      },
      isKlOptions: [
        {
          value: 1,
          label: "自营"
        },
        {
          value: 2,
          label: "非自营"
        }
      ],
      tagOptions: [],
      activityPositions: [],
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published"
      },
      downloadLoading: false
    };
	},

  mounted() {
    this.getConfig();
  },
  methods: {
		sortChange(data) {
      const { prop, order } = data;
      this.listQuery.prop = prop;
      this.listQuery.sort = order;
      this.handleFilter();
    },
    getConfig() {
      fetchList({ type: "activityPosition,tagOptions" }).then(res => {
        this.activityPositions = res.data.activityPosition;
        this.tagOptions = res.data.tagOptions;
      });
    },
    
    handleFilter() {
      this.listQuery.page = 1;
      this.$refs.table.getList();
    },


    handleDownload() {
      this.downloadLoading = true;
      this.listQuery.isExport = 1;
      fetchProductList(this.listQuery).then(res => {
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = [
            "标题",
            "新人价",
            "会员价",
            "折扣",
            "原价",
            "自营",
            "权重",
            "标签",
            "活动板块"
          ];
          const filterVal = [
            "title",
            "newPrice",
            "vipPrice",
            "discount",
            "price",
            "isKl",
            "weight",
            "tags",
            "showPlanes"
          ];

          const data = this.formatJson(filterVal, res.data.items);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "商品数据"
          });
          this.downloadLoading = false;
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "isKl") {
            return v[j] ? "是" : "否";
          } else if (j === "tags") {
            return v[j]
              .map(tagId => {
                return this.tagOptionsIndexBy[tagId].label;
              })
              .join(",");
          } else if (j === "showPlanes") {
            return v[j]
              .map(plane => {
                return this.positionIndexBy[plane]
                  ? this.positionIndexBy[plane].text
                  : "";
              })
              .join(",");
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
