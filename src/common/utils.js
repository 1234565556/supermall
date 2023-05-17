export function debounce(func, delay){
    let timer = null
    return function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

// 防抖，解决refresh()频繁刷新的
// 防抖函数起作用的过程：如果直接执行refresh，那么refresh函数会被执行30次。可以将refresh函数传入到debounce函数中，生成一个新的函数。
// 之后在调用非常频繁的时候，就使用新生成的函数，并不会频繁的调用，如果下一次执行来的非常快，那么就将上一次取消掉


// 正则表达式是干什么的？ 字符串匹配 利器
// + 表示至少一个，多了不限；* 表示可有可无，多了不限；? 表示可有可无，至多一个
export function formatDate(date, fmt) {
    // 1.获取年份
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    // 2.获取
    // M+ -> 正则表达式中的一个规则   
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
};
