<template>
  <div class="category">
    <nav-bar class="nav-bar"><div slot="center">商品分类</div></nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @selectItem="selectItem"></tab-menu>
      <scroll id="tab-content" :data="[categoryData]"></scroll>
      <div>
        <tab-content-category :subcategories="showSubcategory"></tab-content-category>
        <tab-control :titles="['综合','新品','销量']" ></tab-control>
        <tab-content-detail></tab-content-detail>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import Scroll from 'components/common/scroll/Scroll'
import TabControl from 'components/content/tabControl/TabControl'

import TabMenu from './childComps/TabMenu'
import TabContentCategory from './childComps/TabContentCategory'
import TabContentDetail from './childComps/TabContentDetail'

import { getCategory, getSubcategory, getCategoryDetail } from 'network/category'

export default {
  components: { 
    NavBar,
    TabMenu,
    Scroll,
    TabContentCategory,
    TabControl,
    TabContentDetail
  },
  name:'Category',
  data(){
    return {
      categories:[],
      categoryData:{

      },
      currentIndex:-1
    }
  },
  computed:{
    showSubcategory(){
      if(this.currentIndex === -1) return {}
      return this.categoryData[this.currentIndex].subcategories
    }
  },
  methods:{
    _getCategory(){
      getCategory().then(res => {
        // 1. 获取分类数据
        this.categories = res.data.category.list
        // 2. 初始化每个类别的子数据
        for(let i = 0; i<this.categories.length; i++){
          this.categoryData[i] = {
            subcategories:{},
            categoryDetail:{
              'pop':[],
              'new':[],
              'sell':[]
            }
          }
        }
        // 3. 请求第一个分类数据
        this._getSubCategories(0)
      })
    },
    _getSubCategories(index){
      this.currentIndex = index
      const mailkey = this.categories[index].maitkey
      getSubcategory(mailkey).then(res => {
        this.categoryData[index].subcategories = res.data
        this.categoryData = {...res.categoryData}
        this._getCategoryDetail('pop')
        this._getCategoryDetail('sell')
        this._getCategoryDetail('new')

      })
    },

    _getCategoryDetail(type){
      // 1. 获取请求的miniwallkey
      const miniWallKey = this.categories[this.currentIndex].miniWallKey
      // 2. 发送请求，传入miniWallKey和type
      getCategoryDetail(miniWallKey,type).then(res => {
        // 3.将获取的数据保存下来
        this.categoryData[this.currentIndex].categoryDetail[type] = res
        this.categoryData = {...this.categoryData}
      })
    },
    // 事件响应相关的方法
    selectItem(index){
      this._getSubCategories(index)
    }
    
  },
}
</script>

<style scoped>
  #category {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;

    display: flex;
  }

  #tab-content {
    height: 100%;
    flex: 1;
  }
</style>