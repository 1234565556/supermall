export default{
    [ADD_COUNTER](state,payload){
        payload.count++
    },
    [ADD_To_CART](state,payload){
        payload.checked = true
        state.cartList.push(payload)
    }
}