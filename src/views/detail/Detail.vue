<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick"></detail-nav-bar>
    <scroll class="cont" ref="scroll" @scroll="contentscroll" :probe-type="3">
        <!-- 属性：topImages 传入值：top-images -->
        <ul>
            <li v-for="item in $store.state.cartList">
                {{ item }}
            </li>
        </ul>
        <detail-swiper :top-images="topImages"></detail-swiper>
        <detail-base-info :goods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
        <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
        <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
        <goods-list ref="recommend" :goods="recommends"></goods-list>
        
    </scroll>
    <detail-bottom-bar @addToCart="addcart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowbacktop"></back-top>
  </div>
</template>

<script>

import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/content/backTop/BackTop'

import {getDetail, Goods, Shop, GoodsParam, getRecommend } from 'network/detail'
import { debounce } from '@/common/utils'


export default {
    name:'Detail',
    components:{
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        GoodsList,
        DetailBottomBar,
        Scroll,
        BackTop
    },
    // mixins:[itemListenerMixin],
    data(){
        return {
            iid:null,
            topImages:[],
            goods:{},
            shop:{},
            detailInfo:{},
            paramInfo:{},
            commentInfo:{},
            recommends:[],
            themeTopYs:[],
            getThemeTopY:null,
            currentIndex:0,
            isShowbacktop: false
        }
    },
    created(){
        // 1. 保存传入的iid
        this.iid = this.$route.params.iid

        // 2. 根据iid请求详情数据
        getDetail(this.iid).then(res => {
            // 1. 获取顶部的图片的轮播数据
            //console.log(res);
            const data = res.result
            
            this.topImages = data.itemInfo.topImages

            // 2. 获取商品信息
            this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

            // 3.创建店铺信息的对象
            this.shop = new Shop(data.shopInfo)

            // 4. 保存商品的详情数据
            this.detailInfo = data.detailInfo

            // 5. 获取参数的信息
            this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

            // 6.取出评论信息
            if(data.rate.cRate !== 0){
                this.commentInfo = data.rate.list[0]
            }

            // this.$nextTick(() => {
            //     // 2. 第二次获取，值不对，不对的原因：图片没有计算在内
            //     // 根据最新的数据，对应的DOM是已经被渲染出来，但是图片依然是没有加载完（目前获取到offsetTop不包含其中的图片）
            //     // offsetTop值不对的时候，都是因为图片的问题
            //     this.themeTopYs = []
            //     this.themeTopYs.push(0)
            //     this.themeTopYs.push(this.$refs.params.$el.offsetTop)
            //     this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
            //     this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

            //     console.log(this.themeTopYs);
            // })

        })

        // 3. 请求推荐数据
        getRecommend().then(res => {
            // console.log(res);
            this.recommends = res.data.list
        })
    },
    // mounted(){
    //     // let refresh = debounce(this.$refs.scroll.refresh,100)
    //     // this.itemImgListener = () => {
    //     //     refresh()
    //     // }
    //     // this.$bus.$on('itemImgLoad', this.itemImgListener)
    // },
    // destroyed(){
    //     this.$bus.$off('itemImgLoad', this.itemImgListener)
    // },
    updated(){
        
            this.themeTopYs = []
            this.themeTopYs.push(0)
            this.themeTopYs.push(this.$refs.params.$el.offsetTop)
            this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
            this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

            //console.log(this.themeTopYs);
        
    },
    methods:{
        imageLoad(){
            this.$refs.scroll.refresh()

            // this.themeTopYs = []
            // this.themeTopYs.push(0)
            // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
            // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
            // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

            // console.log(this.themeTopYs);
        },
        titleClick(index){
            //console.log(index);
            this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],100)
        },
        contentscroll(position){
            //console.log(position);
            // 1. 获取y值
            const positionY = -position.positionY

            // 2.positionY和主题中值进行对比
            let length = this.themeTopYs.length
            for (let i in this.themeTopYs){
                // if(positionY > this.themeTopYs[parseInt(i)] && positionY < this.themeTopYs[parseInt(i+1)]){
                //     console.log(i);
                // }
                if((i < length-1 && positionY > this.themeTopYs[i]) && positionY < this.themeTopYs[i + 1] 
                    || (i === length - 1 && positionY > this.themeTopYs[i])){
                        this.currentIndex = i 
                        console.log(this.currentIndex);
                }
            }

            // 3.是否显示回到顶部
             this.isShowbacktop = (-position.y) > 1000
        },
        // 回到顶部
        backClick() {
            this.$refs.scroll.scrollTo(0, 0, 500)
        },
        addcart(){
            // 1. 获取购物车需要展示的信息
            const product = {}
            product.image = this.topImages[0]
            product.title = this.goods.title
            product.desc = this.goods.desc
            product.price = this.goods.realPrice
            product.iid = this.iid

            // 2. 将商品添加到购物车
            this.$store.commit('addCart',product)
            // this.$store.dispatch('addCart', product).then(res => {
            //     console.log(res);
            // })
        }
    }
}
</script>

<style scoped>
    #detail{
        position: relative;
        z-index: 9;
        background-color: #fff;
    }
    .detail-nav{
        position: relative;
        z-index: 9;
        background-color: #fff;
    }
    .cont{
        height: calc(100% - 44px - 49px);
        height:100vh;
        width: 100%;
        overflow: hidden;
    }
</style>