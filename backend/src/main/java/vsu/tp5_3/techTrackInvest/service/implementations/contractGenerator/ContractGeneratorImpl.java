package vsu.tp5_3.techTrackInvest.service.implementations.contractGenerator;

import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.entities.mongo.Contract;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;
import vsu.tp5_3.techTrackInvest.service.interfaces.ContractGenerator;

import java.util.concurrent.ThreadLocalRandom;

@Component
public class ContractGeneratorImpl implements ContractGenerator {
    //Будем генерить контракт. +20% -20% от цены. Рандомные значения изменения характеристик от 0 до 10
    @Override
    public Contract generateContract(StartupMongo startupMongo) {
       Contract contract = new Contract();

       int startupPrice = startupMongo.getPrice();
       int minContractPrice = (int) Math.max(startupPrice * 0.8, 0);
       int maxContractPrice = (int) (startupPrice * 1.2);

       int teamEffect = ThreadLocalRandom.current().nextInt(11);
       int reputationEffect = ThreadLocalRandom.current().nextInt(11);

       contract.setStartupId(startupMongo.getId());
       contract.setMinPrice(minContractPrice);
       contract.setMaxPrice(maxContractPrice);
       contract.setTeamEffect(teamEffect);
       contract.setReputationEffect(reputationEffect);
       return contract;
    }
}
