$(function () {
  // 点击去注册
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  })
  //点击去登录
  $("#link_login").on("click", function () {
    $(".login-box").show();
    $(".reg-box").hide();
  })
  // 从layui 中获取form对象
  var form = layui.form;
  // 获取内置模块
  var layer = layui.layer;
  // 通过 form.verify()函数之定义校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 校验两次密码是否一致的规则
    repwd: function (value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败,则return一个提示消息即可
      var pwd = $(".reg-box [name=password]").val()
      if (pwd !== value) {
        return "两次密码不一致"
      }
    }
  })
  // 监听注册表单的提交事件
  $("#form_reg").on("submit", function (e) {
    e.preventDefault();
    // 获取输入的input的值
    var data = {
      username: $("#form_reg [name=username]").val(),
      password: $("#form_reg [name=password]").val()
    }
    $.post("/api/reguser", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg("注册成功！")
      // 当注册成功的时候手动点击切换
      $("#link_login").click();
    })
  })

  // 监听登录列表的事件
  $("#form_login").on("submit", function (e) {
    e.preventDefault();
    // 提交
    $.ajax({
      url: "/api/login",
      method: "POST",
      // 当前所有表单的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          return layer.msg("登录失败！")
        };
        layer.msg("登录成功！");
        // 将登录成功得到的 token 字符串，保存到 localStorage 中
        // 因为下次登录还需要验证身份，所以要先本地存储
        localStorage.setItem('token', res.token);
        // 跳转到后台主页
        location.href = '/index.html'
      }
    })
  })
})
