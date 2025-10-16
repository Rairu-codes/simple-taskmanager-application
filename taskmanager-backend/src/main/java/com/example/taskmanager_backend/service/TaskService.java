package com.example.taskmanager_backend.service;

import com.example.taskmanager_backend.model.Task;
import com.example.taskmanager_backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

// @Service - Marks this class as a service layer component
// Indicates that this class contains business logic
@Service
public class TaskService {

    // @Autowired - Tells Spring to automatically inject the TaskRepository
    // Dependency injection - Spring will provide the repository instance
    @Autowired
    private TaskRepository taskRepository;

    //READ OPERATION TO GET ALL TASKS
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    //READ OPERATION TO GET TASKS BY ID
    public Task getTaskByID(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found."));
    }

    //CREATE OPERATION TO CREATE TASKS
    public Task createTask(Task task) {
        System.out.println("Creating task: " + task); // DEBUG LOG
        Task savedTask = taskRepository.save(task);
        System.out.println("Task created with ID: " + savedTask.getId()); // DEBUG LOG
        return savedTask;
    }

    //UPDATE OPERATION TO UPDATE TASKS
    public Task updateTask(Long id, Task taskDetails) {
        System.out.println("Service: Updating task " + id); // DEBUG LOG

        // First, find the existing task
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        // Update the fields
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setCompleted(taskDetails.isCompleted());

        System.out.println("Service: Saving updated task"); // DEBUG LOG

        // Save and return the updated task
        Task updatedTask = taskRepository.save(task);

        System.out.println("Service: Task updated successfully"); // DEBUG LOG
        return updatedTask;
    }

    //DELETE OPERATION TO DELETE A TASK
    public void deleteTask(Long id) {
        System.out.println("Service: Deleting task " + id); // DEBUG LOG

        // Check if task exists before deleting
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }

        taskRepository.deleteById(id);
        System.out.println("Service: Task deleted successfully"); // DEBUG LOG
    }
}

