<template>
  <div class="dashboard-container">
    <adminDashboard></adminDashboard>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'

export default {
  name: 'Dashboard',
	components: { adminDashboard },
}
</script>