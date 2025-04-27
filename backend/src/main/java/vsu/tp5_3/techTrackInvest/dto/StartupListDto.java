package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;

import java.util.List;

@Value
public class StartupListDto {
    List<StartupReadDto> purchasedStartups;
    List<StartupReadDto> availableStartups;
}
