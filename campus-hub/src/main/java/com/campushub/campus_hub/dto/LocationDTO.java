package com.campushub.campus_hub.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LocationDTO {
    @NotBlank(message = "Location Id cannot be blank")
    private String location_id;

    @NotBlank(message = "Location name cannot be blank")
    private String locationName;

    private int capacity;
}
