package vsu.tp5_3.techTrackInvest.configs;

import lombok.Data;
import org.springframework.stereotype.Component;

@Data
@Component
public class GameBalanceConfig {
    // Базовые значения
    private int baseRevenue = 5000;
    private int baseExpenses = 2000;

    //значения для минимального порога изменения показателей
    private int minChangeStart = 5;
    private int maxChangeStart = 10;
    private int minChangeEnd = 15;
    private int maxChangeEnd = 25;

    // Весовые коэффициенты доходов
    private double revenueTeamMultiplierBase = 0.4;
    private double revenueTeamMultiplierScale = 1.6;
    private double revenueReputationMultiplierBase = 0.5;
    private double revenueReputationMultiplierScale = 1.0;
    private double revenueProgressMultiplierBase = 0.2;
    private double revenueProgressMultiplierScale = 1.8;

    // Весовые коэффициенты расходов
    private double expensesTeamBase = 1.2;
    private double expensesTeamScale = -0.4;
    private double expensesReputationBase = 1.0;
    private double expensesReputationScale = 0.5;
    private double expensesProgressBase = 0.8;
    private double expensesProgressScale = 0.7;

    // Весовые коэффициенты стоимости
    private double valueRevenueWeight = 1.2;
    private double valueProgressWeight = 100.0 * 1.5;
    private double valueTeamWeight = 50.0 * 1.0;
    private double valueReputationWeight = 50.0 * 1.0;

    // Ограничения изменения при естественном росте
    private double minChangeFactor = 0.65;
    private double maxChangeFactor = 1.35;

    // Волатильность роста
    private double volatilityBase = 0.25;
    private double volatilityPerTurn = 0.03;

    // Смещение вероятности роста/падения
    private double pseudoMaxTurn = 20.0;

    // Весовые коэффициенты при росте параметров
    private double teamGrowthWeight = 1.0;
    private double reputationGrowthWeight = 1.0;
    private double progressGrowthWeight = 1.0;

    // Границы параметров
    private int minStat = 0;
    private int maxStat = 100;
}
