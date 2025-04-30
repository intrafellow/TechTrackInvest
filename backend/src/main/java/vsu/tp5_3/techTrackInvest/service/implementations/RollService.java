package vsu.tp5_3.techTrackInvest.service.implementations;

import io.swagger.v3.oas.annotations.servers.ServerVariable;
import org.springframework.stereotype.Service;

import java.util.concurrent.ThreadLocalRandom;

@Service
public class RollService {
    //нужно реализовать логику ролла, чтобы мы получили случайное число от 1 до 20
    //определить какая будет финальная сумма стартапа из заданного диапазона
    //вернуть это значение на фронт, чтобы игрок могу купить или отказаться

    public int getDiceRollResult() {
        return ThreadLocalRandom.current().nextInt(1, 21);
    }


}
