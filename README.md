## flow-step介绍
为了让业务逻辑写起来更加简洁清晰，所以设计了这个轻量的框架，它只是提供一个最基本的约束，让大家都可以去遵守它，从而形成套相对美观的代码结构。

## 简单运用
    const flow-step = require('flow-step')

    flow-step({
        //设定流程执行步骤
        init: function() {
            this.next('getUserInfo', {name: 'cat'}).then() //获取用户信息（异步）
                .next('updateUserInfo').then() //更新用户信息（异步）
                .next('sendSMS') //发送短信消息（同步）
                .end((err, data) => {
                    //todo
                })
        },
        getUserInfo: function(needles, callback) {
            //needles is => {name: 'cat'}
            setTimeout(() => {
                callback && callback(null, null, {name: 'tom'})
            }, 1000)
        },
        updateUserInfo: function(callback) {
            setTimeout(() => {
                //可获取前面所有步骤的指定执行结果
                let name = this.get('getUserInfo').name

                //callback error的时候，当前流程将立即结束
                //callback({msg:'执行异常'})
                callback && callback()
            }, 1000)
        },
        sendSMS: function() {
            console.log('send')
        }
    })