$(function () {
    var layer = layui.layer

    var form = layui.form
    // 调用函数渲染界面
    initArtCateList()
    // 获取图书库
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // 使用模板引擎渲染表格数据到页面
                var htmlStr = template("tpl-tabel", res)
                //加载到tbody中
                $("tbody").html(htmlStr)
            }
        })
    }
    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    // open内置：返回一个当前层索引  indexAdd
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            // 通过id把弹出成内容渲染到页面
            content: $('#dialog-add').html()
        })
    })
    // 动态添加的元素 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            // 所有表单的值
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                // 从新渲染界面
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    var indexEdit = null
    // 通过代理的形式，为btn绑定
    $("tbody").on("click", ".btn-edit", function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        // 添加自定义属性,获取到id
        var id = $(this).attr("data-id")
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res);
                // 通过id获取到当前书的name和alias 赋值给弹出框
                form.val("form-edit", res.data)
            }
        })
    })
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })
    $("tbody").on('click', ".btn-delete", function () {
        var id = $(this).attr("data-id")
        layer.confirm('确认删除?', { icon: 3, title: '提示' },
            function (index) {
                $.ajax({
                    method: "GET",
                    url: '/my/article/deletecate/' + id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg('删除分类失败！')
                        }
                        layer.msg('删除分类成功！')
                        layer.close(index)
                        initArtCateList()
                    }
                })
            })
    })
})