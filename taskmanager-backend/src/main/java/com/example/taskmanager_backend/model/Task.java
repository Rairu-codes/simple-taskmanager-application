package com.example.taskmanager_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

//@Entity - JPA Entity (Database Table)
//Spring will create a table based on this class structure
@Entity

// @Table - Specifies the table name in the database
// Without this, table name would default to class name
@Table(name = "tasks")


@Data

public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private boolean completed;

    // NEW: Deadline for the task
    @Column(name = "deadline")
    private LocalDateTime deadline;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

}
