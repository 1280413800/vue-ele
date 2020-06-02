<template>
  <div>
    <ele-header :seller="seller"></ele-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>

  </div>

</template>

<script>
import axios from "axios";
import header from "./components/header/header";
const OK = 0;
export default {
  data() {
    return {
      seller: {}
    };
  },
  created() {
    setTimeout(() => {
      axios
        .get("/api2/seller")
        .then(response => {
          const result = response.data;
          if (result.code === OK) {
            this.seller = result.data;
            this.seller.score = 3.6;
            console.log("axios3", this.seller);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, 1000);
  },
  components: {
    "ele-header": header
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import 'common/stylus/mixins';

.tab {
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-1px(rgba(7, 17, 27, 0.1));

  .tab-item {
    flex: 1;
    text-align: center;

    & > a {
      display: block;
      font-size: 14px;
      color: rgb(77, 85, 93);

      &.active {
        color: rgb(240, 20, 20);
      }
    }
  }
}
</style> 
