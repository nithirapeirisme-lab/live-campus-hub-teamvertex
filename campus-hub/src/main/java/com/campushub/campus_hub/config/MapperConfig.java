package com.campushub.campus_hub.config;

import com.campushub.campus_hub.dto.StudentRewardDTO;
import com.campushub.campus_hub.entity.StudentRewardEntity;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT);

        modelMapper.typeMap(StudentRewardEntity.class, StudentRewardDTO.class).addMappings(mapper -> {
            mapper.map(src -> src.getId().getStudentId(), StudentRewardDTO::setStudent_id);
            mapper.map(src -> src.getId().getRewardId(), StudentRewardDTO::setReward_id);
            mapper.map(StudentRewardEntity::getPoints, StudentRewardDTO::setPoints);
        });

        return modelMapper;
    }
}
