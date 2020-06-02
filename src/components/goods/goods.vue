<template>
  <div>
    <div class="goods">
      <div
        class="menu-wrapper"
        ref="menuWrapper"
      >
        <ul>
          <li
            class="menu-item"
            v-for="(item, index) in goods"
            :class="{current: currentIndex===index}"
            :key="index"
            @click="clickMenuItem(index, $event)"
          >
            <span class="text border-1px">
              <span
                class="icon"
                v-if="item.type>=0"
                :class="classMap[item.type]"
              ></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div
        class="foods-wrapper"
        ref="foodsWrapper"
      >
        <ul>
          <li
            class="food-list food-list-hook"
            v-for="item in goods"
          >
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li
                class="food-item border-1px"
                v-for="food in item.foods"
                @click="clickFood(food,$event)"
              >
                <div class="icon">
                  <img
                    width="57"
                    height="57"
                    :src="food.icon"
                  >
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span
                      class="old"
                      v-show="food.oldPrice"
                    >￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol
                      :food="food"
                      :update-food-count="updateFoodCount"
                    ></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart
                :food-list="foodList"
                :delivery-price="seller.deliveryPrice"
                :min-price="seller.minPrice"
                @clear="clear"
                :update-food-count="updateFoodCount"
                ref="shopcart"
                ></shopcart>
    </div>
    <food :food="selectFood" :update-food-count="updateFoodCount" ref="food"></food>
  </div>
</template>

<script>
import axios from "axios";
import BScroll from "better-scroll";
import Vue from "vue";

import cartcontrol from "../cartcontrol/cartcontrol.vue";
import shopcart from "../shopcart/shopcart.vue";
import food from "../food/food.vue";

export default {
  props: ["seller"],
  data() {
    return {
        goods: [],
        tops: [],
        scrollY: 0,
        selectFood: {}
    };
  },

  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
    axios.get("/api2/goods").then(response => {
      const result = response.data;
      console.log('axios4',result)
      if (result.code === 0) {
        this.goods = result.data;
        //在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
        Vue.nextTick(() => {
          //初始化滚动条
          this._initScroll();
          // 读取右侧所有分类的top值
          this._initTops();
        });
      }
    });
  },
  computed: {
    currentIndex() {
      return this.tops.findIndex((top, index) => {
        return this.scrollY >= top && this.scrollY < this.tops[index + 1];
      });
    },
    foodList() {
      const foods = [];
      this.goods.forEach(good => {
        good.foods.forEach(food => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
  methods: {
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      });
      //监视foods的滚动
      this.foodsScroll.on("scroll", pos => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _initTops() {
      const foodList = this.$refs.foodsWrapper.getElementsByClassName(
        "food-list-hook"
      );
      let top = 0;
      this.tops.push(top);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        top += item.clientHeight;
        this.tops.push(top);
      }
      console.log(this.tops);
    },
    clickMenuItem(index, event) {
      console.log(index, event);
      if (!event._constructed) {
        return;
      }
      const foodList = this.$refs.foodsWrapper.getElementsByClassName(
        "food-list-hook"
      );
      const el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300);
    },
    updateFoodCount(food, isAdd, event) {
      if (!event._constructed) {
        return;
      }

      if (isAdd) {
        // 增加
        if (!food.count) {
          // 第一次
          console.log("updateFoodCount() 第一次");
          // 新增count属性
          // food.count = 1  // 没有监视-->没有数据绑定, 界面不会更新
          Vue.set(food, "count", 1);
        } else {
          food.count++;
        }
        // 通知shopcart组件对象启动一个小球的显示动画
        // this.$refs.shopcart.drop(event.target);
      } else {
        // 减少
        if (food.count) {
          food.count--;
        }
      }
    },
    clear() {
      this.foodList.forEach(food => {
        food.count = 0;
      });
    },
    clickFood(food,event){
      if(!event._constructed){
        return
      }
      //更新food
      this.selectFood = food
      this.$refs.food.show(true)
    }
  },

  components: {
    cartcontrol,
    shopcart,
    food
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixins.styl';

.goods {
  display: flex;
  position: absolute;
  top: 174px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;

  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;

    .menu-item {
      display: table;
      height: 54px;
      width: 56px;
      padding: 0 12px;
      line-height: 14px;

      &.current {
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background: #fff;
        font-weight: 700;

        .text {
          border-none();
        }
      }

      .icon {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;

        &.decrease {
          bg-image('decrease_3');
        }

        &.discount {
          bg-image('discount_3');
        }

        &.guarantee {
          bg-image('guarantee_3');
        }

        &.invoice {
          bg-image('invoice_3');
        }

        &.special {
          bg-image('special_3');
        }
      }

      .text {
        display: table-cell;
        width: 56px;
        vertical-align: middle;
        border-1px(rgba(7, 17, 27, 0.1));
        font-size: 12px;
      }
    }
  }

  .foods-wrapper {
    flex: 1;

    .title {
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background: #f3f5f7;
    }

    .food-item {
      display: flex;
      margin: 18px;
      padding-bottom: 18px;
      border-1px(rgba(7, 17, 27, 0.1));

      &:last-child {
        border-none();
        margin-bottom: 0;
      }

      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }

      .content {
        flex: 1;

        .name {
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .desc, .extra {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .desc {
          line-height: 12px;
          margin-bottom: 8px;
        }

        .extra {
          .count {
            margin-right: 12px;
          }
        }

        .price {
          font-weight: 700;
          line-height: 24px;

          .now {
            margin-right: 8px;
            font-size: 14px;
            color: rgb(240, 20, 20);
          }

          .old {
            text-decoration: line-through;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 12px;
        }
      }
    }
  }
}
</style>