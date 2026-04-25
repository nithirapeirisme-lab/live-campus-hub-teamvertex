package com.campushub.campus_hub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ClubDTO {
    private String clubId;
    private String clubName;
    private boolean status;
}
