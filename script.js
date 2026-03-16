// task list
let taskList = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM
const addButton = document.querySelector('.js-add-button');
const inputField = document.querySelector('.js-input-field');
const koriNoteImage = document.querySelector('.js-kori-note');

// save data
function saveData() {
  localStorage.setItem('tasks', JSON.stringify(taskList));
}

// add task
addButton.addEventListener('click', () => {
  const task = inputField.value;
  
  if (task.trim() === '' ) {
    return;
  }

  taskList.push({
    id: Date.now(),
    name: task,
    status: 'not done'
  })

  renderTaskList();
  
  inputField.value = '';

  saveData();
});

// render to do list
function renderTaskList() {
  if (taskList.length !== 0) {
    koriNoteImage.classList.add('hide-kori-note');
  } else {
    koriNoteImage.classList.remove('hide-kori-note');
  }

  let todoListHTML = '';
  
  taskList.forEach((task) => {
    todoListHTML += `
        <div class="task-container">
          <div class="checkmark js-checkmark-button ${task.status === "not done" ? "hide-checkmark" : "show-checkmark"}" data-task-id=${task.id}>
            <i class="fa-solid fa-circle-check"></i>
          </div>

          <div class="task">
            <div class="task-name js-task-name-${task.id}">
              <p class="task-name-text">${task.name}</p>
              <div class="task-icons js-task-icons-${task.id}">
                <i class="fa-solid fa-pen-to-square edit-button js-edit-button" data-task-id="${task.id}"></i>
                <i class="fa-solid fa-trash delete-button js-delete-button" data-task-id=${task.id}></i>
              </div>
            </div>

            <div class="task-name-editing js-task-name-editing-${task.id} hide-edit-input">
              <input class="edit-input js-edit-task-name-${task.id}">
              <div class="task-icons-editing js-task-icons-editing-${task.id} hide-task-icons-editing">
                <i class="fa-regular fa-circle-check save js-save-button js-save-${task.id}" data-task-id=${task.id}></i>
                <i class="fa-regular fa-circle-xmark discard js-discard-button js-discard-${task.id}"></i>
              </div>
            </div>
          </div>
          
        </div>
    `;
  });

  document.querySelector('.js-tasks-container')
    .innerHTML = todoListHTML;

  // mark as done (checkmark) button
  document.querySelectorAll('.js-checkmark-button')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const checkmark = document.querySelector('.js-checkmark-button');
        const id = Number(button.dataset.taskId);
        let task;

        taskList.forEach((taskItem) => {
          if (taskItem.id === id) {
            task = taskItem;
            
          }
        });

        if (task.status === "not done") {

          task.status = 'done';
        } else {

          task.status = "not done";
        }

        renderTaskList();
      });
    });

  // edit button
  document.querySelectorAll('.js-edit-button')
    .forEach((button) => {
      button.addEventListener('click', () => { 
        const id = Number(button.dataset.taskId);
        const editInputContainer = document.querySelector(`.js-task-name-editing-${id}`);
        const editInput = document.querySelector(`.js-edit-task-name-${id}`);
        const taskName = document.querySelector(`.js-task-name-${id}`);
        const taskIcons = document.querySelector(`.js-task-icons-${id}`);
        const taskIconsEditing = document.querySelector(`.js-task-icons-editing-${id}`);
        let taskNameValue = '';

        editInputContainer.classList.remove('hide-edit-input');
        taskName.classList.add('hide-task-name');
        taskIcons.classList.add('hide-task-icons');
        taskIconsEditing.classList.remove('hide-task-icons-editing');

        editInput.focus();  

        taskList.forEach((task) => {
          if (task.id === id) {
            taskNameValue = task.name;
          }
        });

        editInput.value = taskNameValue;
      });
    });

  // delete button
  document.querySelectorAll('.js-delete-button')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.taskId);
        
        deleteTask(id);
      });
    });

  // save changes button
  document.querySelectorAll('.js-save-button')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.taskId);
        const editInput = document.querySelector(`.js-edit-task-name-${id}`);

        taskList.forEach((task) => {
          if (task.id === id && editInput.value.trim() !== '') {
            task.name = editInput.value;
            renderTaskList();
          }
        });
      });
    });

  // discard changes button 
  document.querySelectorAll('.js-discard-button')
    .forEach((button) => {
      button.addEventListener('click', () => {
        renderTaskList();
      });
    });

  console.log('renderTaskList() was calledddddddddddddddddd');
  saveData();
  updateProgress();
}

// delete task
function deleteTask(id) {
  let newTaskList = [];

  taskList.forEach((task) => {
    if (id !== task.id) {
      newTaskList.push(task);
    }
  });

  taskList = newTaskList;
  renderTaskList();
}

// update progress
function updateProgress() {
  const progressFill = document.querySelector('.js-progress-fill');
  const motivationalCaption = document.querySelector('.js-motivational-caption');
  
  // label
  let totalTaskCount = 0;
  let totalTaskDoneCount = 0;

  taskList.forEach((task) => {
    totalTaskCount++

    if (task.status === 'done') {
      totalTaskDoneCount++;
    }
  });

  document.querySelector('.js-total-task-done').innerHTML = totalTaskDoneCount;
  document.querySelector('.js-total-task').innerHTML = totalTaskCount;

  let percentage = 0;
  // progress bar
  if (totalTaskCount > 0) {
    percentage = (totalTaskDoneCount / totalTaskCount) * 100;
  }

  progressFill.style.width = `${percentage}%`;

  console.log(percentage);

  if (percentage === 100) {
    motivationalCaption.innerHTML = 'All done!';
    addFadeInAnimation();
  } else if (percentage >= 65 && motivationalCaption.innerHTML !== 'Almost there!') {
    motivationalCaption.innerHTML = 'Almost there!';
    addFadeInAnimation();
  } else if (percentage < 65 && motivationalCaption.innerHTML !== 'Keep it up!') {
    motivationalCaption.innerHTML = 'Keep it up!';
    addFadeInAnimation();
  }

  document.querySelector('.js-progress-bar');

  console.log('updateProgress() was calledddddddddddddddd');
}

function addFadeInAnimation() {
  const motivationalCaption = document.querySelector('.js-motivational-caption');
  
  motivationalCaption.classList.remove('fade-in');
  void motivationalCaption.offsetWidth;
  motivationalCaption.classList.add('fade-in');
}

// render to do list automatically
renderTaskList();
