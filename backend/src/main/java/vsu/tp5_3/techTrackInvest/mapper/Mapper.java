package vsu.tp5_3.techTrackInvest.mapper;

public interface Mapper<FROM, TO>{
    TO map(FROM object);
    default TO map(FROM fromObject, TO toObject) {
        return toObject;
    }
}
