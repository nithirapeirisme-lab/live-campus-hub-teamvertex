package com.campushub.campus_hub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.io.Serializable;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentsClubDTO implements Serializable {
    private String Student_id;
    private String Club_id;
    private LocalDate joined_date;
    private Boolean active_status;
}
