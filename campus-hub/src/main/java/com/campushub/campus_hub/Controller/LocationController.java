package com.campushub.campus_hub.Controller;

import com.campushub.campus_hub.DTO.LocationDTO;
import com.campushub.campus_hub.Service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/locations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LocationController {
    private final LocationService locationService;

    @PostMapping
    public ResponseEntity<LocationDTO> registerLocation(@RequestBody LocationDTO locationDTO){
        locationService.registerLocation(locationDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();

    }

    @GetMapping
    public ResponseEntity<List<LocationDTO>> getAllLocations(){
        return ResponseEntity.ok(locationService.getAllLocations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocationDTO> getLocationById(@RequestParam("location_id") String location_id){
        return ResponseEntity.ok(locationService.getLocationDetails(location_id));
    }

    @PutMapping
    public ResponseEntity<LocationDTO> updateLocation(@RequestBody LocationDTO locationDTO){
        locationService.updateLocation(locationDTO.getLocation_id(), locationDTO);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<LocationDTO> deleteLocation(@RequestBody LocationDTO locationDTO){
        locationService.deleteLocation(locationDTO.getLocation_id());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
