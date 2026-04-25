package com.campushub.campus_hub.service;

import com.campushub.campus_hub.dto.DepartmentDTO;

import java.util.List;

public interface DepartmentService {
    void saveDepartment(DepartmentDTO department);
    void updateDepartment(String department_id, DepartmentDTO department);
    void deleteDepartment(String department_id);
    DepartmentDTO getDepartment(String department_id);
    List<DepartmentDTO> getAllDepartment();
}
