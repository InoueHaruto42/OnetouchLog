package com.example.onetouch.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class WorkRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDate date;
    private String weekday;

    private LocalTime startTime;
    private LocalTime endTime;

    private long breakDuration; // 休憩時間（秒）
    private long duration; // 作業時間（秒）
    private Integer evaluation;
    private String memo;

    // ==== Getter & Setter ====

    public Long getId() {
        return id;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    // TaskName に直接アクセス
    public void setTaskName(String taskName) {
        if (this.task == null) {
            this.task = new Task();
        }
        this.task.setName(taskName);
    }

    public String getTaskName() {
        return this.task != null ? this.task.getName() : null;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getWeekday() {
        return weekday;
    }

    public void setWeekday(String weekday) {
        this.weekday = weekday;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public long getBreakDuration() {
        return breakDuration;
    }

    public void setBreakDuration(long breakDuration) {
        this.breakDuration = breakDuration;
    }

    public long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration == null ? 0L : duration;
    }

    public Integer getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(Integer evaluation) {
        this.evaluation = evaluation;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public void setDayOfWeek(String weekday) {
        this.weekday = weekday;
    }
}
