<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ length }})</div>
    </nav-bar>
    <!-- 商品的列表 -->
    <cart-list></cart-list>
    <!-- 底部汇总 -->
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>

import NavBar from 'components/common/navbar/NavBar'
import CartList from './childComps/CartList'
import CartBottomBar from './childComps/CartBottomBar'

import {mapGetters} from 'vuex'

export default {
    name:'Cart',
    components:{
      NavBar,
      CartList,
      CartBottomBar
    },
    computed:{
      // 两种语法
      //...mapGetters(['cartLength','cartList'])
      ...mapGetters({
        length:'cartLength'
      })
    },

}
</script>

<style scoped>
  .cart{
    height: calc(100% - 44px - 49px);
    height:100vh;
    width: 100%;
    overflow: hidden;
  }
  .nav-bar{
    background-color: var(--color-tint);
    color: #fff;
  }
</style>