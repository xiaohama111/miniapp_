// pages/index/index.js
var app = getApp()
const config = require("../../config.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show_auth: false,
        avatarUrl: '',
        fileID: '',
        nickName: ''
    },

    /** 
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取用户信息
        this.login()
    },
    // login
    login() {
        wx.showLoading({
            title: '登录中...',
        });
        // 调用云函数
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                wx.hideLoading()
                console.log('login', res);
                if (res.result && res.result._openid) {
                    app.globalData.userId = res.result._openid
                    app.globalData.userInfo = {
                        avatarUrl: res.result.avatarUrl,
                        nickName: res.result.nickName,
                        openid: res.result._openid,
                        _openid: res.result._openid
                    }
                    wx.setStorageSync('openid', app.globalData.userId)
                    wx.setStorageSync('userInfo', app.globalData.userInfo)
                    wx.switchTab({
                        url: '/pages/home/index/index'
                    })
                } else {
                    wx.showToast({
                        title: '账号未注册，请先完成注册~',
                        icon: 'none',
                        duration: 1500
                    })
                    this.setData({
                        show_auth: true
                    })
                }
            },
            fail: err => {
                console.log(err)
            }
        })
    },

    // 上传头像
    onChooseAvatar(e) {
        const {
            avatarUrl
        } = e.detail;
        wx.showLoading({
            title: '上传头像...'
        })
        wx.cloud.uploadFile({
            cloudPath: `avatar/${new Date().getTime()}.png`,
            filePath: avatarUrl,
            success: res => {
                console.log(res.fileID)
                this.setData({
                    fileID: res.fileID,
                    avatarUrl: res.fileID
                })
            },
            fail: err => {
                console.log(err)
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },

    // 保存注册数据
    saveUsers() {
        if (!this.data.nickName || !this.data.fileID) {
            wx.showToast({
                title: '请完善注册信息~',
                icon: 'none',
                duration: 1500
            })
            return false;
        }

        wx.showLoading({
            title: '正在保存...'
        })
        const db = wx.cloud.database()
        db.collection('users').add({
            data: {
                avatarUrl: this.data.fileID,
                nickName: this.data.nickName,
                updateTime: new Date().getTime(),
            },
            success: (res) => {
                console.log(res, res.errMsg === "collection.add:ok")
                if (res.errMsg === 'collection.add:ok') {
                    this.login();
                }
            },
            fail: console.error,
            complete: () => {
                wx.hideLoading()
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})