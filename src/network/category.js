import {request} from './request'

export function getCategory(){
    return request({
        url:'/category'
    })
}

export function getSubcategory(){
    return request({
        url:'/subcategory',
        params:{
            maitkey
        }
    })
}

export function getCategoryDetail(miniWallkey,type){
    return request ({
        url:'/subcategory/detail',
        params:{
            miniWallkey,
            type
        }
    })
}