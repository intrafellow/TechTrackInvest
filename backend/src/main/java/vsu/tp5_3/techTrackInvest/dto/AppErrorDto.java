package vsu.tp5_3.techTrackInvest.dto;

import lombok.Data;

import java.util.Date;

@Data
public class AppErrorDto {
    private int status;
    private String message;
    private Date timestamp;

    public AppErrorDto(int status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = new Date();
    }
}
