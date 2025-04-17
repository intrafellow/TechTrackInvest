package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;

import java.util.List;

@Value
public class StartupListDto {
    List<StartupShortReadDto> purchasedStartups;
    List<StartupReadDto> availableStartups;
}
