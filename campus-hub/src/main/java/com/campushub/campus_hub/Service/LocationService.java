package com.campushub.campus_hub.Service;

import com.campushub.campus_hub.DTO.LocationDTO;

import java.util.List;

public interface LocationService {
    void registerLocation(LocationDTO location);
    void updateLocation(String location_id, LocationDTO location);
    void deleteLocation(String location_id);
    LocationDTO getLocationDetails(String location_id);
    List<LocationDTO> getAllLocations();
}
