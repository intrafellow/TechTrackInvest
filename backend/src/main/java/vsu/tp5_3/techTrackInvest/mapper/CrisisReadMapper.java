package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.CrisisReadDto;
import vsu.tp5_3.techTrackInvest.dto.SolutionReadDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.CrisisMongo;

import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class CrisisReadMapper implements Mapper<CrisisMongo, CrisisReadDto>{
    private final SolutionReadMapper solutionReadMapper;
    @Override
    public CrisisReadDto map(CrisisMongo object) {
        return new CrisisReadDto(
                object.getId(),
                object.getName(),
                object.getDescription(),
                object.getNichesId(),
                new ArrayList<>(
                        object.getPossibleSolutions()
                                .stream()
                                .map(solutionReadMapper::map)
                                .toList()
                )
        );
    }
}
