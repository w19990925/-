$(function () {
  // 添加分类
  $('#categoriesForm').on('submit', function () {
    // 获取表单输入的值
    var formData = $(this).serialize();
    // console.log(formData);

    $.ajax({
      url: '/categories',
      type: 'post',
      data: formData,
      success: function (response) {
        location.reload()
      },
      error: function () {
        alert('添加失败')
      }
    })
    // 阻止默认行为
    return false;
  });

  // 在页面中显示分类
  $.ajax({
    type: 'get',
    url: '/categories',
    success: function (response) {
      var html = template('cateTpl', { data: response });
      $('#cateBody').html(html);
    }
  });

  // 点击编辑按钮让数据在左边显示
  $('#cateBody').on('click', '.edit', function () {
    // 获取当前点击的id  用id查询数据
    var id = $(this).attr('data-id');

    $.ajax({
      type: 'get',
      url: '/categories/' + id,
      success: function (response) {
        // 调用模板方法
        var html = template('editTpl', response);
        // 渲染页面
        $('#cateBox').html(html);
      }
    });
  });

  // 点击修改按钮 修改数据
  $('#cateBox').on('submit', '#editForm', function () {
    // 获取修改过的表单数据
    var formData = $(this).serialize();
    // 获取id 当前要修改的
    var id = $(this).attr('data-id');

    $.ajax({
      type: 'put',
      url: '/categories/' + id,
      data: formData,
      success: function (response) {
        location.reload()
      }
    });
  });

  // 点击删除功能
  $('#cateBody').on('click', '.delete', function () {
    // 获取id 当前要删除的
    var id = $(this).attr('data-id');

    // 判断用户点击的是不是确定 确定则发送ajax请求删除数据
    if (confirm('你确定要删除吗')) {
      $.ajax({
        type: 'delete',
        url: '/categories/' + id,
        success: function (response) {
          location.reload();
        }
      });
    }
  });

  // 批量删除
  var checkedAll = $('#checkedAll');
  var deleteAll = $('#deleteAll');
  // 点击全选按钮
  checkedAll.on('change', function () {
    // 获取全选框的选中状态
    var status = $(this).prop('checked');
    // 让全选框的状态和单选框相等
    $('#cateBody').find('.checkedOne').prop('checked', status);

    // 判断全选框状态选中 让批量删除显示
    if (status) {
      deleteAll.show();
    } else {
      deleteAll.hide();
    }
  });

  // 点击单选按钮
  $('#cateBody').on('change', '.checkedOne', function () {
    // 获取所有用户
    var inputs = $('#cateBody').find('.checkedOne');

    // 判断用户的总数 如果和选中的总数相等 那么全选框也选中 
    if (inputs.length === inputs.filter(':checked').length) {
      checkedAll.prop('checked', true);
    } else {
      checkedAll.prop('checked', false);
    }

    if (inputs.filter(':checked').length > 0) {
      deleteAll.show();
    } else {
      deleteAll.hide();
    }
  });

  // 点击批量删除
  deleteAll.on('click', function () {
    // 获取所用选中的分类
    var inputs = $('#cateBody').find('.checkedOne').filter(':checked');
    // 创建一个空数组
    var idArr = [];

    // 遍历所有选中的分类
    inputs.each(function (index, dom) {
      // 把遍历的id 添加到空数组中
      idArr.push($(this).attr('data-id'));
    });

    $.ajax({
      type: 'delete',
      url: '/categories/' + idArr.join('-'), // 每个id要用-拼接
      success: function (response) {
        location.reload()
      }
    })
  });
});