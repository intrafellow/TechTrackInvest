package vsu.tp5_3.techTrackInvest.service.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.configs.GameBalanceConfig;
import vsu.tp5_3.techTrackInvest.entities.enums.Stage;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;
import vsu.tp5_3.techTrackInvest.entities.postgre.Startup;
import vsu.tp5_3.techTrackInvest.entities.postgre.Step;
import vsu.tp5_3.techTrackInvest.service.interfaces.SessionService;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UpdateStartupService {
    private final SessionService sessionService;
    private final StepService stepService;
    private final GameBalanceConfig config;
    private final Random random = new Random();

    @Transactional
    public void updateStartupsSpecs() {
        //1. Получить сессию и ход
        //2. Получить все стартапы
        //3. Начать итерироваться по стартапам, сразу пропуская те, что разорились
        //4. Применить к ним случайный рост показателей команды, прогресса, репутации
        //5. Изменить тип
        //6. Пересчитать расходы
        //7. Пересчитать доходы
        //8. Пересчитать стоимость стартапа
        //9. Отнять деньги. Если не хватает их, то сделать стартап "проговревшим"
        Session session = sessionService.getCurrentSession();
        Step currentStep = stepService.getCurrentStep(session);
        List<Startup> allBoughtStartups = session.getStartups();

        for (Startup startup : allBoughtStartups) {
            //пропускает мёртвые стартапы, пока игрок их сам не удалит
            if (startup.getSalePrice() == 0) continue;

            applyNaturalGrowth(startup, currentStep.getSequenceNumber());

            int newRevenue = calculateRevenue(startup);
            int newExpenses = calculateExpenses(startup);

            startup.setLastMonthRevenue(newRevenue);
            startup.setExpenses(newExpenses);

            int newSalePrice = calculateSalePrice(startup);
            startup.setSalePrice(newSalePrice);

            applyProfitOrLoss(startup, currentStep);
        }
    }


    private void applyNaturalGrowth(Startup startup, int turn) {
        int minDelta = getMinDeltaForTurn(turn);
        int maxDelta = getMaxDeltaForTurn(turn);

        // Прогресс — только рост или без изменений
        int newProgress = applyOneWayNaturalGrowth(startup.getProgress(),
                config.getProgressGrowthWeight(), minDelta, maxDelta, turn);
        startup.setProgress(clampInt(newProgress, config.getMinStat(), config.getMaxStat()));

        // Репутация — рост или падение
        int newReputation = applySignedNaturalStatChange(startup.getReputation(),
                config.getReputationGrowthWeight(), minDelta, maxDelta, turn);
        startup.setReputation(clampInt(newReputation, config.getMinStat(), config.getMaxStat()));

        // Команда — рост или падение
        int newTeam = applySignedNaturalStatChange(startup.getTeam(),
                config.getTeamGrowthWeight(), minDelta, maxDelta, turn);
        startup.setTeam(clampInt(newTeam, config.getMinStat(), config.getMaxStat()));

        startup.setStage(getCurrentStageBasedOnProgress(startup.getProgress()));
    }

    private int applyOneWayNaturalGrowth(int currentValue, double weight, int minDelta, int maxDelta, int turn) {
        double growthChance = getGrowthProbabilityForTurn(turn);
        boolean shouldGrow = random.nextDouble() < growthChance;

        if (!shouldGrow) {
            return currentValue; // оставляем как есть
        }

        int delta = random.nextInt(maxDelta - minDelta + 1) + minDelta;
        return (int) Math.round(currentValue + delta * weight);
    }

    private int applySignedNaturalStatChange(int currentValue, double weight, int minDelta, int maxDelta, int turn) {
        int delta = random.nextInt(maxDelta - minDelta + 1) + minDelta;

        double growthChance = getGrowthProbabilityForTurn(turn);
        boolean isPositive = random.nextDouble() < growthChance;

        int signedDelta = isPositive ? delta : -delta;
        return (int) Math.round(currentValue + signedDelta * weight);
    }

    private double getGrowthProbabilityForTurn(int turn) {
        double progress = Math.min(1.0, (double) turn / config.getPseudoMaxTurn());
        return 1.0 - progress * 0.8; // от 1.0 до 0.2
    }

    private int calculateRevenue(Startup startup) {
        double teamMultiplier = config.getRevenueTeamMultiplierBase() + startup.getTeam() / 100.0 *
                config.getRevenueTeamMultiplierScale();         // от 0.6 до 1.4
        double reputationMultiplier = config.getRevenueReputationMultiplierBase() + startup.getReputation() / 100.0 *
                config.getRevenueReputationMultiplierScale();   // от 0.5 до 1.5
        double progressMultiplier = config.getRevenueProgressMultiplierBase() + startup.getProgress() / 100.0 *
                config.getRevenueProgressMultiplierScale(); // от 0.3 до 1.5

        return (int) Math.round(config.getBaseRevenue() * teamMultiplier * reputationMultiplier * progressMultiplier);
    }


    private int calculateExpenses(Startup startup) {
        double teamSizeEffect = config.getExpensesTeamBase() + startup.getTeam() / 100.0 * config.getExpensesTeamScale();  // от 1.0 до 3.0
        double reputationEffect = config.getExpensesReputationBase() + (100 - startup.getReputation()) / 100.0 *
                config.getExpensesReputationScale(); // низкая репутация увеличивает расходы
        double progressEffect = config.getExpensesProgressBase() + startup.getProgress() / 100.0 *
                config.getExpensesProgressScale();

        return (int) Math.round(config.getBaseExpenses() * teamSizeEffect * reputationEffect * progressEffect);
    }


    private int calculateSalePrice(Startup startup) {

        double value = startup.getLastMonthRevenue() * config.getValueRevenueWeight()
                + startup.getProgress() * config.getValueProgressWeight()
                + startup.getTeam() * config.getValueTeamWeight()
                + startup.getReputation() * config.getValueReputationWeight();

        return (int) Math.round(value);
    }

    // Ограничение int
    private int clampInt(int val, int min, int max) {
        return Math.max(min, Math.min(max, val));
    }

    private void applyProfitOrLoss(Startup startup, Step currentStep) {
        int revenue = startup.getLastMonthRevenue();
        int expenses = startup.getExpenses();
        int budget = startup.getBudget();

        int profitLoss = revenue - expenses;

        if (profitLoss >= 0) {
            // Добавляем прибыль в бюджет
            startup.setBudget(budget + profitLoss);
        } else {
            // Убыток: сначала из бюджета, затем из денег игрока
            int lossAbs = Math.abs(profitLoss);
            if (budget >= lossAbs) {
                startup.setBudget(budget - lossAbs);
            } else {
                int deficit = lossAbs - budget;
                startup.setBudget(0);

                int playerMoney = currentStep.getCash();
                if (playerMoney >= deficit) {
                    currentStep.setCash(playerMoney - deficit);
                } else {
                    // Игрок не может покрыть убытки — стартап «прогорел»
                    startup.setSalePrice(0);
                    startup.setLastMonthRevenue(0);
                    startup.setExpenses(0);
                    startup.setTeam(0);
                    startup.setProgress(0);
                    startup.setReputation(0);
                    startup.setBudget(0);
                    startup.setStage(Stage.IDEA);
                }
            }
        }
    }

    private Stage getCurrentStageBasedOnProgress(int progress) {
        if (progress < 25) {
            return Stage.IDEA;
        }
        if (progress < 50) {
            return Stage.MVP;
        }
        if (progress < 75) {
            return Stage.MARKET;
        }
        return Stage.SCALE;
    }

    private int getMinDeltaForTurn(int turn) {
        double progress = (double) turn / config.getPseudoMaxTurn();
        return (int) Math.round(config.getMinChangeStart() + (config.getMinChangeEnd() - config.getMinChangeStart()) * progress);
    }

    private int getMaxDeltaForTurn(int turn) {
        double progress = (double) turn / config.getPseudoMaxTurn();
        return (int) Math.round(config.getMaxChangeStart() + (config.getMaxChangeEnd() - config.getMaxChangeStart()) * progress);
    }
}
