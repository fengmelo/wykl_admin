<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in activityPositions" :key="item.id" :label="item.text" :name="''+item.id">
        <keep-alive>
					<product-table v-if="activeName==item.id" :type="item.id" :showPage="false" :activityPositions="activityPositions" :tagOptions="tagOptions"></product-table>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ProductTable from '@/components/Product/table'
import { fetchProductList } from "@/api/product";
import { fetchList } from "@/api/config";

export default {
  name: 'ProductTab',
  components: { ProductTable },
  data() {
    return {
			activityPositions:[],
			tagOptions:[],
			activeName:'1'
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
		}
		this.getConfig()
  },
  methods: {
		getConfig(){
			fetchList({ type: "activityPosition,tagOptions" }).then(res => {
        this.activityPositions = res.data.activityPosition;
        this.tagOptions = res.data.tagOptions;
      });
		}
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
