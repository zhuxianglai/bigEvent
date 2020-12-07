$(function () {
    getUserInfo()
    // 调用layui的内置函数
    var layer = layui.layer
    // 点击按钮实现退出功能
    $("#btnLogout").on("click", function () {
        layer.confirm('确认退出登录？', { icon: 3, title: '提示' },
            function (index) {
                // 清空本地存储的token
                localStorage.removeItem('token')
                // 从新跳转到登陆界面
                location.href = "/login.html"
                //关闭confirm询问框
                layer.close(index);
            });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function (res) {
            if (res.status != 0) {
                return layui.layer.msg("获取用户信息失败！")
            }
            //调用渲染用户的头像
            renderAvatar(res.data)
        }
    })
}
// 渲染用户的头像
function renderAvatar(user) {
    // 获取用户的昵称和登录名字（如果没有昵称就用登录名字）
    var name = user.nickname || user.username;
    // 设置欢迎文本
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name)
    if (user.user_pic != null) {
        // 如果用户有user_pic属性，就渲染出图片头像
        $('.layui-nav-img').prop("src", user.user_pic).show()
        $(".text-avatar").hide()
    } else {
        //如果么有头像，就隐藏图片头像，用name的第一个字母大写作为头像内容
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar')
            .html(first)
            .show()
    }
}
