package com.campushub.campus_hub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ClubDTO {
    private String clubId;

    @NotBlank(message = "Club name cannot be blank")
    private String clubName;

    @NotNull(message = "Club status is required")
    private boolean status;
}
