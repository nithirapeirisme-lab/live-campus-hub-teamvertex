package com.campushub.campus_hub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity

@Table(name = "departments")
public class DepartmentEntity {
    @Id
    @Column(name = "department_id", nullable = false)
    private String department_id;

    @Column(name = "department_name", nullable = false)
    private String department_Name;
}
