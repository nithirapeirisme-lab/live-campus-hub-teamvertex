package com.campushub.campus_hub.Dao;

import com.campushub.campus_hub.Entity.DepartmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentDao extends JpaRepository<DepartmentEntity,String> {
}
