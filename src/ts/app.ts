import TaskBoard from './components/task-board/TaskBoard';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.task-container');
  if (container instanceof HTMLDivElement) {
    const board = new TaskBoard(container);
    board.init();
  }
});
