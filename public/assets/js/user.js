$(function () {
    // 添加提交事件
    $('#userAdd').on('submit', function () {
      // 获取表单的用户输入的值
      var formData = $(this).serialize();

      $.ajax({
        url: '/users',
        type: 'post',
        data: formData,
        success: function (response) {
          // console.log(response);
          // 刷新页面
          location.reload();
        },
        error: function () {
          alert('添加失败');
        }
      });

      // 边写边测
      // console.log(formData);
      // 阻止默认提交事件
      return false;
    });

    // 添加change事件
    $('#userBox').on('change', '#avatar', function () {
      // 通过formData获得文件信息  
      var formData = new FormData();
      // 使用下标获取具体的图片信息  files[0]
      formData.append('avatar', this.files[0]);

      // 发送ajax请求
      $.ajax({
        url: '/upload',
        type: 'post',
        data: formData,
        // 告诉ajax请求不要解析参数
        processData: false,
        // 告诉ajax请求不要设置参数类型 
        contentType: false,
        success: function (response) {
          // console.log(response[0].avatar); 图片的路径
          // 让图片显示在页面中
          $('#avatarImg').attr('src', response[0].avatar);
          // 把路径存储给隐藏域 让数据库得到路径
          $('#hiddenAvatar').val(response[0].avatar);
        },
        error: function () {
          alert('图片添加失败');
        }
      });
    });

    // 获取用户列表
    $.ajax({
      type: 'get',
      url: '/users',
      success: function (response) {
        // console.log(response);
        var html = template('userTpl', { data: response });
        $('#userBody').html(html);
      },
    });

    // 修改用户信息  点击编辑后 给左边的表单添加要修改的数据
    $('#userBody').on('click', '.edit', function () {
      // 获取要修改的id
      var id = $(this).attr('data-id');
      // console.log(id);
      $.ajax({
        type: 'put',
        url: `/users/${id}`,
        success: function (response) {
          var html = template('modifyTpl', response);
          // console.log(html);
          // 渲染页面
          $('#userBox').html(html);
        }
      })
    });

    // 提交表单把修改后的用户数据添加到页面中
    $('#userBox').on('submit', '#modifyForm', function () {
      var formData = $(this).serialize();
      var id = $(this).attr('data-id');

      $.ajax({
        type: 'put',
        url: `/users/${id}`,
        data: formData,
        success: function (response) {
          // console.log(response);
          location.reload();
        }
      });

      // 阻止默认提交
      return false;
    });

    // 删除用户
    $('#userBody').on('click', '.delete', function () {
      // 判断用户是否点击了确认
      if (confirm('确定删除')) {
        // 获取当前用户的id
        var id = $(this).attr('data-id');

        $.ajax({
          type: 'delete',
          url: `/users/${id}`,
          success: function (response) {
            location.reload();
          }
        });
      }
    });

    // 批量删除
    // 获取全选的按钮
    var checkedAll = $('#checkedAll');
    // 获取批量删除按钮
    var deleteAll = $('#deleteAll');

    // 给全选按钮绑定事件
    checkedAll.on('change', function () {
      // 获取全选框的 选中状态
      var status = $(this).prop('checked');
      // 把全选框的选中状态 同步到单选框
      $('#userBody').find('.checkedOne').prop('checked', status);
      // console.log(status);

      // 判断全选框是否选中 选中显示 没选隐藏
      if (status) {
        deleteAll.show();
      } else {
        deleteAll.hide();
      }

    });

    // 使用事件委托给没个小复选框绑定事件
    $('#userBody').on('change', '.checkedOne', function () {
      // 获取所有的用户
      var inputs = $('#userBody').find('.checkedOne');

      // 当选框选中的数量和用户的数量一样那么就是全选
      // 判断相不相等 相等全选选中 不相等则不选中
      if (inputs.length === inputs.filter(':checked').length) {
        checkedAll.prop('checked', true);
      } else {
        checkedAll.prop('checked', false);
      }

      // 如果用户复选框被选中 批量删除按钮也显示
      if (inputs.filter(':checked').length > 0) {
        deleteAll.show();
      } else {
        deleteAll.hide();
      }
    });

    // 批量删除功能
    deleteAll.on('click', function () {
      // 获取所有的用户
      var inputs = $('#userBody').find('.checkedOne').filter(':checked');
      // 声明一个空数组 接收用户的id合集
      var idArr = [];

      // 遍历用户合集
      inputs.each(function (index, dom) {
        // 把遍历的id 添加到空数组中
        idArr.push($(dom).attr('data-id'));
      });

      $.ajax({
        type: 'delete',
        url: '/users/' + idArr.join('-'),
        success: function (response) {
          location.reload()
        }
      });
    });
  });