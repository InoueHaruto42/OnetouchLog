package com.example.onetouch.repository;

import com.example.onetouch.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // タスク名で検索するためのメソッド
    Optional<Task> findByName(String name);
}
