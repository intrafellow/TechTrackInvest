package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;
import java.util.List;

@Value
public class CrisisReadDto {
    String id;
    String name;
    String description;
    List<String> nichesId;
    List<SolutionReadDto> possibleSolutions;
}
