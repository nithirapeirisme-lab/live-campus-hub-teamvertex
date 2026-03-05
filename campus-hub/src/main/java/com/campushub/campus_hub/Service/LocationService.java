package com.campushub.campus_hub.Service;

import com.campushub.campus_hub.DTO.LocationDTO;

import java.util.List;

public interface LocationService {
    void registerLocation(String location_id, String location_name);
    void updateLocation(String location_id, String location_name);
    void deleteLocation(String location_id);
    void getLocationDetails(String location_id);
    List<LocationDTO> getAllLocations();
}
