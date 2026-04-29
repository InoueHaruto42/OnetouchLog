package com.example.onetouch.controller;

import com.example.onetouch.entity.Task;
import com.example.onetouch.entity.WorkRecord;
import com.example.onetouch.repository.TaskRepository;
import com.example.onetouch.repository.WorkRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/record")
@CrossOrigin(origins = "*")
public class MainController {

    @Autowired
    private WorkRecordRepository workRecordRepository;

    @Autowired
    private TaskRepository taskRepository;

    // ===== 作業記録の開始 =====
    @PostMapping("/start")
    public Map<String, Object> startRecord() {
        WorkRecord record = new WorkRecord();

        LocalDate date = LocalDate.now();
        LocalTime time = LocalTime.now();
        record.setDate(date);
        record.setStartTime(time);
        record.setWeekday(getJapaneseDayOfWeek(date));

        WorkRecord saved = workRecordRepository.save(record);

        LocalDateTime dateTime = LocalDateTime.of(date, time);
        OffsetDateTime isoDateTime = dateTime.atZone(ZoneId.systemDefault()).toOffsetDateTime();

        Map<String, Object> response = new HashMap<>();
        response.put("id", saved.getId());
        response.put("startTime", isoDateTime.toString());

        return response;
    }

    // ===== 作業記録の完了 =====
    @PostMapping("/complete")
    public void completeRecord(@RequestBody Map<String, Object> payload) {
        try {
            Long rawId = Long.valueOf(payload.get("id").toString());

            String taskNameRaw = (String) payload.get("taskName");
            String resolvedTaskName = (taskNameRaw == null || taskNameRaw.trim().isEmpty()) ? "未設定" : taskNameRaw;

            System.out.println("resolved taskName: " + resolvedTaskName);
            System.out.println("endTime: " + payload.get("endTime"));
            System.out.println("duration: " + payload.get("duration"));
            System.out.println("breakDuration: " + payload.get("breakDuration"));
            System.out.println("memo: " + payload.get("memo"));
            System.out.println("evaluation: " + payload.get("evaluation"));

            Optional<WorkRecord> optional = workRecordRepository.findById(rawId);
            if (optional.isEmpty())
                throw new IllegalArgumentException("Record not found: id=" + rawId);

            WorkRecord record = optional.get();

            // === Taskの取得または作成 ===
            Task task = taskRepository.findByName(resolvedTaskName)
                    .orElseGet(() -> taskRepository.save(new Task(resolvedTaskName)));
            record.setTask(task);

            // === 日時の処理 ===
            OffsetDateTime offsetDateTime = OffsetDateTime.parse((String) payload.get("endTime"));
            record.setEndTime(offsetDateTime.atZoneSameInstant(ZoneId.systemDefault()).toLocalTime());

            // === 作業時間 ===
            Long duration = extractLong(payload.get("duration"));
            record.setDuration(duration == null ? 0L : duration);

            Long breakDuration = extractLong(payload.get("breakDuration"));
            record.setBreakDuration(breakDuration == null ? 0L : breakDuration);

            // === メモ・評価 ===
            record.setMemo((String) payload.get("memo"));
            record.setEvaluation(extractInteger(payload.get("evaluation")));

            // === 保存 ===
            workRecordRepository.save(record);
            System.out.println("作業記録を正常に保存しました");

        } catch (Exception e) {
            System.err.println("作業記録の保存に失敗:");
            e.printStackTrace();
            throw new RuntimeException("作業記録の完了に失敗しました: " + e.getMessage());
        }
    }

    // ===== 登録済みタスク一覧の取得 =====
    @GetMapping("/tasks")
    public List<Task> getTasks() {
        return taskRepository.findAll();
    }

    // ===== 作業記録一覧の取得 =====
    @GetMapping("/records")
    public Iterable<WorkRecord> getRecords() {
        return workRecordRepository.findAll();
    }

    // ===== 作業記録の削除 =====
    @DeleteMapping("/records/{id}")
    public void deleteRecord(@PathVariable Long id) {
        workRecordRepository.deleteById(id);
    }

    // ===== Utility =====
    private String getJapaneseDayOfWeek(LocalDate date) {
        return date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.JAPANESE);
    }

    private Long extractLong(Object value) {
        if (value == null)
            return null;
        if (value instanceof Number)
            return ((Number) value).longValue();
        return Long.valueOf(value.toString());
    }

    private Integer extractInteger(Object value) {
        if (value == null)
            return null;
        try {
            if (value instanceof Number)
                return ((Number) value).intValue();
            String str = value.toString().trim();
            if (str.isEmpty())
                return null;
            return Integer.valueOf(str.split("\\.")[0]);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
