$(function () {
    $('#logout').on('click', function() {
      // 使用confirm弹框 询问用户是否退出
      // 点击确认 返回值是true
      var isConfirm = confirm('确定退出?');

      // 如果返回值是true 则发送ajax请求
      if (isConfirm) {
        $.ajax({
          url: '/logout',
          type: 'post',
          success: function(response) {
            location.href = 'login.html';
          },
          error: function () {
            alert('退出失败');
          }
        })
      }
    });
  });