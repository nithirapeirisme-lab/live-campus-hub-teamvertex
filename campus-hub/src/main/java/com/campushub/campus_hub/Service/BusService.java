package com.campushub.campus_hub.Service;

import com.campushub.campus_hub.DTO.BusDTO;

import java.util.List;

public interface BusService {
    void saveBus(BusDTO bus);
    void updateBus(String busId, BusDTO bus);
    void deleteBus(String busId);
    List<BusDTO> getAllBuses();
}
