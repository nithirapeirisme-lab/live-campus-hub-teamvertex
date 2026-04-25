package com.campushub.campus_hub.service.impl;

import com.campushub.campus_hub.dto.BusDTO;
import com.campushub.campus_hub.dao.BusDao;
import com.campushub.campus_hub.exceptions.BusNotFoundException;
import com.campushub.campus_hub.entity.BusEntity;
import com.campushub.campus_hub.service.BusService;
import com.campushub.campus_hub.util.EntityDTOConversion;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class BusServiceImpl implements BusService {
    private final BusDao busDao;
    private final EntityDTOConversion entityDTOConversion;
    @Override
    public void saveBus(BusDTO bus) {
        if (busDao.existsByBusNumber(bus.getBusNumber())) {
            throw new RuntimeException("Bus with id " + bus.getBusNumber() + " already exists!");
        }
        busDao.save(entityDTOConversion.toBusEntity(bus));
    }

    @Override
    public void updateBus(String busId, BusDTO bus) {
        Optional<BusEntity> foundBus = busDao.findById(busId);
        if (!foundBus.isPresent()) {
            throw new BusNotFoundException("Bus not found");
        }

        foundBus.get().setBus_id(bus.getBus_id());
        foundBus.get().setBusNumber(bus.getBusNumber());
        foundBus.get().setStatus(bus.getStatus());
        foundBus.get().setDeparture(bus.getDeparture());
        foundBus.get().setArrival(bus.getArrival());
        foundBus.get().setDeparture_time(bus.getDeparture_time());
        foundBus.get().setArrival_time(bus.getArrival_time());


    }

    @Override
    public void deleteBus(String busId) {
        Optional<BusEntity> foundBus = busDao.findById(busId);
        if(!foundBus.isPresent()) {
            throw new BusNotFoundException("Bus not found");
        }
        busDao.deleteById(busId);

    }

    @Override
    public List<BusDTO> getAllBuses() {
        List<BusEntity> allBuses = busDao.findAll();
        return entityDTOConversion.toBusDTOList(allBuses);
    }
}
