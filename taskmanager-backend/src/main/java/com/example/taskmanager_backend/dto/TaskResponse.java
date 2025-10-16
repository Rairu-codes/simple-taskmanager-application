package com.example.taskmanager_backend.dto;

import lombok.Setter;

import java.time.LocalDateTime;

public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;
    private String status; // NEW: "on-time", "late", "completed-on-time", "completed-late"

    // Constructor
    public TaskResponse(Long id, String title, String description, boolean completed,
                        LocalDateTime deadline, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.deadline = deadline;
        this.createdAt = createdAt;
        this.status = calculateStatus();
    }

    // Calculate status based on deadline and completion
    private String calculateStatus() {
        // No deadline set
        if (deadline == null) {
            return completed ? "completed" : "pending";
        }

        LocalDateTime now = LocalDateTime.now();

        if (completed) {
            // Task is completed
            // Check if it was completed before deadline
            // For simplicity, we check if deadline has passed
            if (now.isBefore(deadline)) {
                return "completed-on-time";
            } else {
                return "completed-late";
            }
        } else {
            // Task not completed yet
            if (now.isAfter(deadline)) {
                return "late";
            } else {
                return "on-time";
            }
        }
    }

    // Getters and Setters
    public Long getId() { return id; }

    public String getTitle() { return title; }

    public String getDescription() { return description; }

    public boolean isCompleted() { return completed; }

    public LocalDateTime getDeadline() { return deadline; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public String getStatus() { return status; }
}

