import Vue from "vue";
import Vuex from 'vuex'

import getters from './getters'
import actions from './actions'

// 1.安装插件
Vue.use(Vuex)

// 2.创建store对象
const state = {
    cartList: []
}
const store = new Vuex.Store({
    state,
    mutations:{
        // mutations唯一的目的就是修改state中的状态
        // mutations中的每个方法尽可能完成的事件比较单一一点
        addCart(state,payload){
            // payload新添加的商品
            // let oldProduct = null
            // for(let item of state.cartList){
            //     if(item.iid === payload.iid){
            //         oldProduct = item
            //     }
            // }


            // 1. 查找之前数组中是否有该商品
            let oldProduct = state.cartList.find(item => item.iid === payload.iid)
            // 2. 判断oldProduct
            if(oldProduct){
                oldProduct.count += 1
            }else{
                payload.count = 1
                payload.checked = true
                state.cartList.push(payload)
            }
            
        }
    },
    getters,
    actions
})

// 3. 挂载Vue实例上
export default store