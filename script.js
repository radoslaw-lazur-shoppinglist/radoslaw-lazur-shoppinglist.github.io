$(document).ready(function() {

  var apiRoot = 'https://obscure-garden-52288.herokuapp.com/v1/shoppingList/products/';
  var datatableRowTemplate = $('[data-datatable-row-template]').children()[0];
  var tasksContainer = $('[data-tasks-container]');

  // init
  getAllTasks();

  function createElement(data) {
    var element = $(datatableRowTemplate).clone();

    element.attr('data-task-id', data.id);
    element.find('[data-task-name-section] [data-task-name-paragraph]').text(data.title);
    element.find('[data-task-name-section] [data-task-name-input]').val(data.title);



    return element;
  }

  function handleDatatableRender(data) {
    tasksContainer.empty();
    data.forEach(function(task) {
      createElement(task).appendTo(tasksContainer);
    });
  }

  function getAllTasks() {
    var requestUrl = apiRoot + 'getProducts';

    $.ajax({
      url: requestUrl,
      method: 'GET',
      success: handleDatatableRender
    });
  }

  function handleTaskUpdateRequest() {
    var parentEl = $(this).parent().parent();
    var productId = parentEl.attr('data-task-id');
    var taskTitle = parentEl.find('[data-task-name-input]').val();
    
    var requestUrl = apiRoot + 'updateProduct';

    $.ajax({
      url: requestUrl,
      method: "PUT",
      processData: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify({
        id: productId,
        title: taskTitle,
        
      }),
      success: function(data) {
        parentEl.attr('data-task-id', data.id).toggleClass('datatable__row--editing');
        parentEl.find('[data-task-name-paragraph]').text(taskTitle);
        
      }
    });
  }

  function handleTaskDeleteRequest() {
    var parentEl = $(this).parent().parent();
    var productId = parentEl.attr('data-task-id');
    var requestUrl = apiRoot + 'deleteProduct';

    $.ajax({
      url: requestUrl + '/?' + $.param({
        productId: productId
      }),
      method: 'DELETE',
      success: function() {
        parentEl.slideUp(400, function() { parentEl.remove(); });
      }
    })
  }

  function handleTaskSubmitRequest(event) {
    event.preventDefault();

    var taskTitle = $(this).find('[name="title"]').val();
   

    var requestUrl = apiRoot + 'createProduct';

    $.ajax({
      url: requestUrl,
      method: 'POST',
      processData: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify({
        title: taskTitle,
       
      }),
      complete: function(data) {
        if(data.status === 200) {
          getAllTasks();
        }
      }
    });
  }

  function toggleEditingState() {
    var parentEl = $(this).parent().parent();
    parentEl.toggleClass('datatable__row--editing');

    var taskTitle = parentEl.find('[data-task-name-paragraph]').text();
   

    parentEl.find('[data-task-name-input]').val(taskTitle);
   
  }

  $('[data-task-add-form]').on('submit', handleTaskSubmitRequest);

  tasksContainer.on('click','[data-task-edit-button]', toggleEditingState);
  tasksContainer.on('click','[data-task-edit-abort-button]', toggleEditingState);
  tasksContainer.on('click','[data-task-submit-update-button]', handleTaskUpdateRequest);
  tasksContainer.on('click','[data-task-delete-button]', handleTaskDeleteRequest);
});