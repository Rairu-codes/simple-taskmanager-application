package com.example.taskmanager_backend.repository;

import com.example.taskmanager_backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// @Repository - Marks this interface as a Spring Data repository
@Repository
public interface TaskRepository extends JpaRepository<Task,Long> {

}