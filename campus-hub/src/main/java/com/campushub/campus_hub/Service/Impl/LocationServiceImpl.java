package com.campushub.campus_hub.Service.Impl;

import com.campushub.campus_hub.DTO.LocationDTO;
import com.campushub.campus_hub.Dao.CheckInDao;
import com.campushub.campus_hub.Dao.LocationDao;
import com.campushub.campus_hub.Entity.LocationEntity;
import com.campushub.campus_hub.Exceptions.LocationNotFoundException;
import com.campushub.campus_hub.Service.LocationService;
import com.campushub.campus_hub.util.EntityDTOConversion;
import com.campushub.campus_hub.util.UtilityData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {
    private final LocationDao locationDao;
    private final EntityDTOConversion entityDTOConversion;
    private final CheckInDao checkInDao;
    @Override
    public void registerLocation(LocationDTO location) {
        location.setLocation_id(UtilityData.generateLocation_id());
        locationDao.save(entityDTOConversion.toLocationEntity(location));

    }

    @Override
    public void updateLocation(String location_id, LocationDTO location) {
        Optional<LocationEntity> foundLocation = locationDao.findById(location_id);
        if(!foundLocation.isPresent()) {
            throw new LocationNotFoundException("Location Not found.");
        }
        foundLocation.get().setLocation_name(location.getLocation_name());

    }

    @Override
    public void deleteLocation(String location_id) {
        if(!locationDao.findById(location_id).isPresent()) {
            throw new LocationNotFoundException("Location Not found.");
        }
        locationDao.deleteById(location_id);

    }

    @Override
    public LocationDTO getLocationDetails(String locationId) {
        return locationDao.findById(locationId)
                .map(location -> entityDTOConversion.toLocationDTO(location))
                .orElseThrow(() -> new LocationNotFoundException("Location Not found."));
    }

    @Override
    public List<LocationDTO> getAllLocations() {
        return entityDTOConversion.toLocationDTOList(locationDao.findAll());
    }

    @Override
    public String calculateCrowdStatus(String locationId) {
        LocalDateTime hourAgo = LocalDateTime.now().minusHours(1);
        long activeCount = checkInDao.countRecentCheckIns(locationId, hourAgo);

        LocationEntity location = locationDao.findById(locationId).orElseThrow(() -> new LocationNotFoundException("Location Not found."));

        int capacity = location.getCapacity();

        double occupancyRate = (double) activeCount / capacity;

        if(occupancyRate > 0.9) return "Fully occupied";
        if(occupancyRate > 0.7) return "Bit Crowded";
        if(occupancyRate > 0.4) return "Moderate occupied";
        return "Quiet";
    }
}
