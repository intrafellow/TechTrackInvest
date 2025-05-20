package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.SolutionReadDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.Solution;
@Component
@RequiredArgsConstructor
public class SolutionReadMapper implements Mapper<Solution, SolutionReadDto>{
    @Override
    public SolutionReadDto map(Solution object) {
        return new SolutionReadDto(
                object.getId(),
                object.getTitle(),
                object.getDescription(),
                object.getEffect(),
                object.getUserEffect()
        );
    }
}
