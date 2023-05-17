<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl1" class="tabcontrol" v-show="isTabFixed">
    </tab-control>
    <scroll 
        class="content" 
        ref="scroll" 
        :probe-type="3" 
        @scroll="contentScroll" 
        :pull-up-load="true" 
        @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl2">
      </tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowbacktop"></back-top>
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView.vue'
import FeatureView from './childComps/FeatureView.vue'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'

import {getHomeMultidata,getHomeGoods} from 'network/home'
import {debounce} from 'common/utils'
import { itemListenerMixin } from 'common/mixin'

import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

export default {
    name:'Home',
    components:{
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    //mixins:[itemListenerMixin],
    data(){
      return{
        banners:[],
        recommends:[],
        goods: {
        'pop': { page: 0, list: [] },
        'new': { page: 0, list: [] },
        'sell': { page: 0, list: [] },
        },
        currentType:'pop',
        isShowbacktop:false,
        tabOffsetTop:0,
        isTabFixed:false,
        saveY:0, 
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    activated(){
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated(){
      // 1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()
    },
    created(){
      // 1.请求多个数据
      this.getHomeMultidata()

      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted(){
      // 1.图片加载完成的事件监听
      let refresh = debounce(this.$refs.scroll.refresh,100)
      // 1. 
      // 2.
      // 3.
      // 30次

      // 对监听事件进行保存
      //this.itemImgListener = () => {
      // console.log('--------');
      // this.$refs.scroll.refresh()
      //refresh()

      // 3.监听item中的图片加载完成
      this.$bus.$on('itemImageLoad', () => {
        refresh()
      })
    },

    methods:{
      /* 事件监听相关的方法 */
      tabClick(index){
        switch(index){
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },

      // 回到顶部
      backClick(){
        this.$refs.scroll.scrollTo(0,0,500)
      },

      // 监听滚动，拿到滚动的位置
      contentScroll(position){
        // 1. 判断Backtop是否显示
        // position.y < 1000 
        this.isShowbacktop = (-position.y) > 1000

        // 2.决定tabControl是否吸顶（position：fixed）
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },

      loadMore(){
        // console.log('上拉加载更多');
        this.getHomeGoods(this.currentType)
        this.$refs.scroll.refresh()
      },

      // 必须知道滚动到多少，开始有吸顶效果，这个时候就需要获取tabControl的offsetTop，但是直接在mounted中获取tabControl的offsetTop的值是不正确的
      // 监听HomeSwiper中的img的加载完成
      swiperImageLoad(){
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },

      /* 网络请求相关的方法 */
      getHomeMultidata(){
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          //完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }
}
</script>

<style scoped>
  #home{
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav{
    background-color: var(--color-tint);
    color:#fff;
    /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }

   .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tabcontrol{
    position: relative;
    z-index: 9;
  }

  /* .content{
    height: cacl(100% - 93px);
    overflow: hidden;
  } */
</style>