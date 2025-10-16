package com.example.taskmanager_backend.controller;

import com.example.taskmanager_backend.model.Task;
import com.example.taskmanager_backend.dto.TaskResponse;
import com.example.taskmanager_backend.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

// @RestController - Combines @Controller and @ResponseBody
// Marks this class as a REST API controller
// All methods return data (JSON) instead of views (HTML pages)
@RestController

// @RequestMapping - Base URL path for all endpoints in this controller
// All endpoints will start with /api/tasks
@RequestMapping("/api/tasks")

// @CrossOrigin - Enables Cross-Origin Resource Sharing (CORS)
// Allows frontend (running on localhost:3000) to make requests to backend
// Without this, browser would block requests due to CORS policy
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TaskController {
    @Autowired
    private TaskService taskService;

    // @GetMapping - Maps HTTP GET requests to this method
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        try {
            List<Task> tasks = taskService.getAllTasks();
            List<TaskResponse> responses = tasks.stream()
                    .map(task -> new TaskResponse(
                            task.getId(),
                            task.getTitle(),
                            task.getDescription(),
                            task.isCompleted(),
                            task.getDeadline(),
                            task.getCreatedAt()
                    ))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // @GetMapping - Maps HTTP GET requests to this method
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        try {
            Task task = taskService.getTaskByID(id);
            TaskResponse response = new TaskResponse(
                    task.getId(),
                    task.getTitle(),
                    task.getDescription(),
                    task.isCompleted(),
                    task.getDeadline(),
                    task.getCreatedAt()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // @PostMapping - Maps HTTP POST requests (CREATE operation)
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody Task task) {
        try {
            Task createdTask = taskService.createTask(task);
            TaskResponse response = new TaskResponse(
                    createdTask.getId(),
                    createdTask.getTitle(),
                    createdTask.getDescription(),
                    createdTask.isCompleted(),
                    createdTask.getDeadline(),
                    createdTask.getCreatedAt()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // @PutMapping - Maps HTTP PUT requests (UPDATE operation)
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id, @RequestBody Task task) {
        try {
            Task updatedTask = taskService.updateTask(id, task);
            TaskResponse response = new TaskResponse(
                    updatedTask.getId(),
                    updatedTask.getTitle(),
                    updatedTask.getDescription(),
                    updatedTask.isCompleted(),
                    updatedTask.getDeadline(),
                    updatedTask.getCreatedAt()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Error updating task: " + e.getMessage()); // DEBUG LOG
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage()); // DEBUG LOG
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // @DeleteMapping - Maps HTTP DELETE requests (DELETE operation)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        try {
            System.out.println("Deleting task with ID: " + id); // DEBUG LOG
            taskService.deleteTask(id);
            System.out.println("Task deleted successfully"); // DEBUG LOG
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            System.err.println("Error deleting task: " + e.getMessage()); // DEBUG LOG
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage()); // DEBUG LOG
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is working!");
    }
}
