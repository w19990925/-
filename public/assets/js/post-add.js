$(function () {
    // 查询分类列表
    $.ajax({
        type: 'get',
        url: '/categories',
        success: function (response) {
            // console.log(response);
            var html = template('categoryTpl', { data: response });
            $('#category').html(html);
        }
    });

    // 图片上传功能
    $('#feature').on('change', function () {
        var formData = new FormData();
        formData.append('cover', this.files[0]);

        $.ajax({
            url: '/upload',
            type: 'post',
            // 告诉ajax请求不要解析参数
            processData: false,
            // 告诉ajax请求不要设置参数类型 
            contentType: false,
            data: formData,
            success: function (response) {
                // console.log(response);
                $('#hiddenIpt').val(response[0].cover);
            }
        });
    });

    // 文章发布功能  给form绑定提交事件
    $('#addForm').on('submit', function () {
        // 获取文章内容
        var formData = $(this).serialize();

        $.ajax({
            url: '/posts',
            type: 'post',
            data: formData,
            success: function (response) {
                location.href = 'posts.html'
            }
        });

        // 阻止默认提交
        return false;
    });
});