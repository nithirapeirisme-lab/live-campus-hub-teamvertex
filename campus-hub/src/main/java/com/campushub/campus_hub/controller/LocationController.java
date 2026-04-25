package com.campushub.campus_hub.controller;

import com.campushub.campus_hub.dto.LocationDTO;
import com.campushub.campus_hub.dao.LocationDao;
import com.campushub.campus_hub.exceptions.LocationNotFoundException;
import com.campushub.campus_hub.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/locations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LocationController {
    private final LocationService locationService;
    private final LocationDao locationDao;

    @PostMapping
    public ResponseEntity<String> registerLocation(@RequestBody LocationDTO locationDTO){
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

    @DeleteMapping("/{locationId}")
    public ResponseEntity<Void> deleteLocation(@PathVariable String locationId){
        try{
            locationService.deleteLocation(locationId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch(LocationNotFoundException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

    }

    @GetMapping("/{locationId}/status")
    public ResponseEntity<Map<String, String>> getLocationStatus(@PathVariable String locationId){
        String status = locationService.calculateCrowdStatus(locationId);

        return ResponseEntity.ok(Map.of("locationId", locationId, "status", status));
    }

    @GetMapping("/all-status")
    public ResponseEntity<Map<String, String>> getAllFacilityStatuses(){

        return ResponseEntity.ok(Map.of(
                "GYM_01", locationService.calculateCrowdStatus("GYM_01"),
                "LIB_MAIN", locationService.calculateCrowdStatus("LIB_MAIN"),
                "MAIN_CANTEEN", locationService.calculateCrowdStatus("MAIN_CANTEEN")));
    }
}
