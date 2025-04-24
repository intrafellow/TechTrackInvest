-- Заполнение таблицы spp_user
INSERT INTO app_user (id, balance, email, level, password, registration_date, username) VALUES
(1, 1000.00, 'user1@example.com', 1, 'pass1', '2023-01-01', 'user1'),
(2, 2000.00, 'user2@example.com', 2, 'pass2', '2023-02-01', 'user2');

-- Заполнение таблицы session
INSERT INTO session (id, month_count, start_date, step_count, app_user_id) VALUES
(1, 2, '2023-01-01 10:00:00', 2, 1);

-- Заполнение таблицы step
INSERT into step (id, cash, reputation, sequence_number, session_id) VALUES
(1, 1000, 50, 1, 1),
(2, 1500, 60, 2, 1);

-- Заполнение таблицы expertise
INSERT INTO expertise (id, expertise_resource_id, expertise_value, step_id) VALUES
(1, 'niche-1', 75, 1),
(2, 'niche-2', 85, 2);

-- Заполнение таблицы conference
INSERT INTO conference (resource_conference_id, conference_time, session_id) VALUES
('conf-1', 1, 1);

-- Заполнение таблицы crisis_bistory
INSERT INTO crisis_history (crysis_resource_id, session_id) VALUES
('crisis-1', 1);

-- Заполнение таблицы current_crisis пока пусатя кризиса нет
-- INSERT INTO current_crisis (crisis_resource_id, session_id) VALUES
-- ('CURRENT_CRISIS001', 1),
-- ('CURRENT_CRISIS002', 2);

-- Заполнение таблицы startup
INSERT INTO startup (startup_resource_id, budget, expenses, last_month_revenue, progress, reputation, sale_price, stage, team, session_id) VALUES
('startup-1', 15000, 3000, 10000, 50, 80, 100000, 'MVP', 5, 1);
