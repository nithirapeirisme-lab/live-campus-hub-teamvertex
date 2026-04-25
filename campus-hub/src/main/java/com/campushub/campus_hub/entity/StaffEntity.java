package com.campushub.campus_hub.entity;

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
    private String staff_id;
    private String staff_pwd;
    private String first_name;
    private String last_name;
    private String email;
    private Boolean is_admin;
    private String profileImageUrl;
}
