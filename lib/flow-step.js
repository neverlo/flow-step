/**
 * flow-step.js
 * @author rex_mark
 */
module.exports = function (option){
    let that = this
    let trace = ''
    let processQueue = [] //队列顺序
    let queueMap = {} //执行信息
    let endHandler = null //异常回调
    let processData = {} //流程缓存数据

    function startStep(list, index) {
        function start() {
            if(index < list.length) {
                let curKey = list[index]
                let item = queueMap[curKey]
                index ++
        
                if(item.wait) {
                    item.fun(function(err, json, processJson) {
                        if(processJson) processData[curKey] = processJson
                        if(err && endHandler) endHandler(err, json) 
                        else startStep(list, index)
                    })
                }else{
                    item.fun()
                    startStep(list, index)
                }
            }
        }

        start()
    }

    this.next = function(step) {
        processQueue.push(step)
        trace = step

        let params = { wait: false }

        if(option[step]) params.fun = option[step].bind(that)
        else throw new Error(`function is not find: ${step}`)

        queueMap[step] = params
        return that
    }

    this.then = function() {
        queueMap[trace].wait = true
        return that
    }

    this.end = function(cb) {
        endHandler = cb
        startStep(processQueue, 0)
    }

    this.get = function(key) {
        return processData[key]
    }

    option.init.apply(this)
}