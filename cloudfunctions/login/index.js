const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
    traceUser: true
})
const db = cloud.database()

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async(event, context) => {
  
    console.log(event)
    console.log(context)

    // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
    const wxContext = cloud.getWXContext();
    const openId = wxContext.OPENID;

    const res = await db.collection('users').where({
        _openid: openId
    }).orderBy('updateTime', 'desc').limit(1).get();
    return res.data.length ? res.data[0] : null;
}