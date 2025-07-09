import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { FaTrash } from 'react-icons/fa';

interface Task {
  id: number;
  content: string;
  column_id: number;
  company_id: number;
}

interface Column {
  id: number;
  title: string;
  company_id: number;
  taskIds: number[];
}

const API_URL = 'https://brandgenie-backend-ene6c9htgcauegg3.westeurope-01.azurewebsites.net/api/trello';


const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Record<number, Column>>({});
  const [tasks, setTasks] = useState<Record<number, Task>>({});
  const [newTaskContent, setNewTaskContent] = useState('');
  const [newColumnTitle, setNewColumnTitle] = useState('');

  // Load columns and tasks
  useEffect(() => {
    const fetchColumnsAndTasks = async () => {
      const colRes = await fetch(`${API_URL}/columns`);
      const colData = await colRes.json();
      const newCols: Record<number, Column> = {};
      const newTasks: Record<number, Task> = {};

      for (const col of colData) {
        const taskRes = await fetch(`${API_URL}/columns/${col.id}/tasks`);
        const taskData: Task[] = await taskRes.json();
        newCols[col.id] = {
          ...col,
          taskIds: taskData.map((t) => t.id),
        };
        taskData.forEach((t) => (newTasks[t.id] = t));
      }

      setColumns(newCols);
      setTasks(newTasks);
    };

    fetchColumnsAndTasks();
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const startCol = columns[parseInt(source.droppableId)];
    const endCol = columns[parseInt(destination.droppableId)];
    const draggedId = parseInt(draggableId);

    if (startCol.id === endCol.id) {
      const newTaskIds = Array.from(startCol.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggedId);
      setColumns({ ...columns, [startCol.id]: { ...startCol, taskIds: newTaskIds } });
    } else {
      const startTaskIds = Array.from(startCol.taskIds).filter((id) => id !== draggedId);
      const endTaskIds = Array.from(endCol.taskIds);
      endTaskIds.splice(destination.index, 0, draggedId);

      const updatedTask = { ...tasks[draggedId], column_id: endCol.id };
      setTasks({ ...tasks, [draggedId]: updatedTask });
      setColumns({
        ...columns,
        [startCol.id]: { ...startCol, taskIds: startTaskIds },
        [endCol.id]: { ...endCol, taskIds: endTaskIds },
      });

      fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
    }
  };

  const handleAddTask = async (columnId: number) => {
    if (!newTaskContent.trim()) return;

    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newTaskContent, column_id: columnId, company_id: 1 }),
    });

    const newTask: Task = await res.json();
    setTasks({ ...tasks, [newTask.id]: newTask });
    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        taskIds: [...columns[columnId].taskIds, newTask.id],
      },
    });

    setNewTaskContent('');
  };

  const handleDeleteTask = async (taskId: number, columnId: number) => {
    await fetch(`${API_URL}/tasks/${taskId}`, { method: 'DELETE' });

    const updatedTasks = { ...tasks };
    delete updatedTasks[taskId];
    setTasks(updatedTasks);

    const updatedTaskIds = columns[columnId].taskIds.filter((id) => id !== taskId);
    setColumns({
      ...columns,
      [columnId]: { ...columns[columnId], taskIds: updatedTaskIds },
    });
  };

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) return;

    const res = await fetch(`${API_URL}/columns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newColumnTitle, company_id: 1 }),
    });

    const newCol = await res.json();
    setColumns({ ...columns, [newCol.id]: { ...newCol, taskIds: [] } });
    setNewColumnTitle('');
  };

  const columnColors: Record<string, string> = {
    'To Do': 'bg-blue-600',
    'In Progress': 'bg-yellow-600',
    'Done': 'bg-green-600',
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-6 space-y-6">
      <div className="flex space-x-4">
        <input
          className="px-4 py-2 rounded bg-gray-700 text-white"
          placeholder="New column title"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
        />
        <button className="bg-blue-600 px-4 py-2 rounded" onClick={handleAddColumn}>Add Column</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto h-[calc(100vh-150px)]">
          {Object.values(columns).map((column) => (
            <Droppable droppableId={column.id.toString()} key={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`rounded-md p-4 w-80 flex-shrink-0 shadow-md h-full overflow-y-auto ${
                    columnColors[column.title] || 'bg-gray-800'
                  }`}
                >
                  <h2 className="text-lg font-bold mb-3">{column.title}</h2>
                  {column.taskIds.map((taskId, index) => {
                    const task = tasks[taskId];
                    return (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white text-black p-2 mb-2 rounded shadow flex justify-between items-center"
                          >
                            <span>{task.content}</span>
                            <button
                              onClick={() => handleDeleteTask(task.id, column.id)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}

                  <div className="mt-4">
                    <input
                      className="w-full text-sm px-2 py-1 rounded bg-gray-100 text-black"
                      placeholder="New task"
                      value={newTaskContent}
                      onChange={(e) => setNewTaskContent(e.target.value)}
                    />
                    <button
                      onClick={() => handleAddTask(column.id)}
                      className="w-full mt-2 bg-yellow-300 text-gray-800 py-1 rounded text-sm font-medium"
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
