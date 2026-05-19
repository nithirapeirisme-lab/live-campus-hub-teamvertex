package com.campushub.campus_hub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity

@Table(name = "staff")
public class StaffEntity {
    @Id
    @Column(name = "staff_id", nullable = false)
    private String staff_id;

    @Column(name = "staff_pwd", nullable = false)
    private String staff_pwd;

    @Column(name = "first_name", nullable = false)
    private String first_name;

    @Column(name = "last_name", nullable = false)
    private String last_name;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "is_admin", nullable = false)
    private Boolean is_admin;
    private String profileImageUrl;
}
