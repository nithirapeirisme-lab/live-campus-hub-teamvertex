package com.campushub.campus_hub.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ClubDTO {
    private String club_id;
    private String student_id;
    private String ClubName;
    private Boolean status;
}
