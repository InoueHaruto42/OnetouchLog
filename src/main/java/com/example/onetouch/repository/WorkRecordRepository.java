package com.example.onetouch.repository;

import com.example.onetouch.entity.WorkRecord;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkRecordRepository extends CrudRepository<WorkRecord, Long> {
    // JpaRepositoryでも可：List系メソッドなどが追加される
}
