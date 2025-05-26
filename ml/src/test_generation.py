"""src/test_generation.py
~~~~~~~~~~~~~~~~~~~~
Тестовый скрипт для локального тестирования генерации данных.
"""
from __future__ import annotations

import json
import warnings
import random
from services.llm_service import _get_generator, NICHES, NICHE_EXAMPLES
from src.models import Stage

# Фильтруем предупреждения о Sliding Window Attention
warnings.filterwarnings("ignore", message="Sliding Window Attention is enabled but not implemented for `sdpa`")

def test_startup_generation():
    """Тестирует генерацию JSON для стартапа."""
    pipe = _get_generator()
    
    # Выбираем случайную нишу
    niche_id = random.choice(list(NICHES.keys()))
    niche_name = NICHES[niche_id]
    startup_number = random.randint(1, 100)  # Случайный номер для ID
    
    # Получаем список допустимых значений для stage
    valid_stages = [stage.value for stage in Stage]
    
    prompt = (
        "Ты — AI-генератор данных для игры про технологические стартапы. Твоя задача:\n"
        "1) Генерировать реалистичные профили технологических стартапов\n"
        "2) Создавать интересные кризисные ситуации с возможными решениями\n"
        "3) Придумывать технологические конференции с балансными наградами\n"
        "4) Убедиться, что все числовые значения реалистичны и сбалансированы\n"
        "5) Генерировать данные в строго заданном JSON формате\n"
        "6) Создавать уникальные и интересные описания\n\n"
        "Сгенерируй профиль технологического стартапа в формате JSON. ВАЖНО: все поля обязательны!\n"
        "Поля JSON:\n"
        "- _id: уникальный идентификатор в формате 'startup-{niche_name}-{number}'\n"
        "- name: название стартапа на английском языке, соответствующее нише {niche_name}\n"
        "- description: краткое описание на русском языке, соответствующее нише {niche_name}\n"
        "- price: стоимость в рублях (целое число)\n"
        "- uniqueProductOffer: уникальное торговое предложение на русском языке, соответствующее нише {niche_name}\n"
        "- lastMonthRevenue: доход за последний месяц (целое число)\n"
        "- expenses: общая сумма ежемесячных расходов (целое число)\n"
        "- team: общее количество сотрудников (целое число)\n"
        "- budget: текущий бюджет (целое число)\n"
        "- product: готовность продукта (целое число от 0 до 100)\n"
        "- reputation: репутация (целое число от 0 до 100)\n"
        "- level: уровень (целое число от 1 до 5)\n"
        "- stage: стадия (строго одно из значений: {valid_stages})\n"
        "- niche: ниша рынка (должна быть {niche_name})\n\n"
        "Важно:\n"
        "1) Все поля обязательны, нельзя пропускать ни одного поля\n"
        "2) Все числовые поля должны быть простыми целыми числами, без вложенных объектов или массивов\n"
        "3) Поле name должно быть на английском языке и соответствовать нише {niche_name}\n"
        "4) Поля description и uniqueProductOffer должны быть на русском языке и соответствовать нише {niche_name}\n"
        "5) Используйте только кириллицу для русских текстов\n"
        "6) Проверьте, что все поля присутствуют в JSON перед отправкой\n"
        "7) Поле stage должно быть строго одним из значений: {valid_stages}\n"
        "8) Все текстовые поля должны соответствовать нише {niche_name}\n"
        "9) Поле niche должно быть строго равно '{niche_name}'\n"
        "10) Поле _id должно начинаться с 'startup-{niche_name}-'\n\n"
        "Примеры для ниши {niche_name}:\n"
        "- name: {examples[name]}\n"
        "- description: {examples[description]}\n"
        "- uniqueProductOffer: {examples[offer]}\n"
        "- price: {examples[price]}\n"
        "- lastMonthRevenue: {examples[lastMonthRevenue]}\n"
        "- expenses: {examples[expenses]}\n"
        "- team: {examples[team]}\n"
        "- budget: {examples[budget]}\n"
        "- product: {examples[product]}\n"
        "- reputation: {examples[reputation]}\n"
        "- level: {examples[level]}\n"
        "- stage: {examples[stage]}\n"
        "- niche: {niche_name}\n"
        "JSON:"
    ).format(
        niche_name=niche_name,
        number=startup_number,
        valid_stages=", ".join(valid_stages),
        examples=NICHE_EXAMPLES[niche_name]
    )
    
    print("\nТестирование генерации стартапа:")
    print("-" * 80)
    test_generation(prompt)

def test_crisis_generation():
    """Тестирует генерацию JSON для кризиса."""
    pipe = _get_generator()
    
    # Выбираем случайную нишу
    niche_id = "2"  # Для теста используем GreenTech
    niche_name = NICHES[niche_id]
    
    prompt = (
        "Ты — AI-генератор данных для игры про технологические стартапы. Твоя задача:\n"
        "1) Генерировать реалистичные профили технологических стартапов\n"
        "2) Создавать интересные кризисные ситуации с возможными решениями\n"
        "3) Придумывать технологические конференции с балансными наградами\n"
        "4) Убедиться, что все числовые значения реалистичны и сбалансированы\n"
        "5) Генерировать данные в строго заданном JSON формате\n"
        "6) Создавать уникальные и интересные описания\n\n"
        "Сгенерируй кризисную ситуацию в формате JSON со следующими полями:\n"
        "- id: уникальный идентификатор\n"
        "- name: название кризиса\n"
        "- description: описание ситуации\n"
        "- type: тип кризиса (global/local)\n"
        "- danger: уровень опасности (1-5)\n"
        "- niche: ниша (для локального кризиса, должна быть {niche_name})\n"
        "- possibleSolutions: список возможных решений\n\n"
        "JSON:"
    ).format(niche_name=niche_name)
    
    print("\nТестирование генерации кризиса:")
    print("-" * 80)
    test_generation(prompt)

def test_conference_generation():
    """Тестирует генерацию JSON для конференции."""
    pipe = _get_generator()
    
    # Выбираем случайную нишу
    niche_id = "3"  # Для теста используем MedTech
    
    prompt = (
        "Ты — AI-генератор данных для игры про технологические стартапы. Твоя задача:\n"
        "1) Генерировать реалистичные профили технологических стартапов\n"
        "2) Создавать интересные кризисные ситуации с возможными решениями\n"
        "3) Придумывать технологические конференции с балансными наградами\n"
        "4) Убедиться, что все числовые значения реалистичны и сбалансированы\n"
        "5) Генерировать данные в строго заданном JSON формате\n"
        "6) Создавать уникальные и интересные описания\n\n"
        "Сгенерируй технологическую конференцию в формате JSON со следующими полями:\n"
        "- id: уникальный идентификатор\n"
        "- name: название конференции\n"
        "- description: описание\n"
        "- nicheId: ID ниши (должен быть {niche_id})\n"
        "- enrollPrice: стоимость участия\n"
        "- gainedReputation: получаемая репутация\n"
        "- expertiseChanges: изменения в экспертизе\n\n"
        "JSON:"
    ).format(niche_id=niche_id)
    
    print("\nТестирование генерации конференции:")
    print("-" * 80)
    test_generation(prompt)

def test_generation(prompt: str) -> None:
    """Общая функция для тестирования генерации."""
    pipe = _get_generator()
    response = pipe(prompt, max_new_tokens=500, do_sample=True, temperature=0.7)[0]["generated_text"]
    
    print("\nСгенерированный текст:")
    print("-" * 80)
    print(response)
    print("-" * 80)
    
    # Пытаемся найти JSON в ответе
    try:
        # Ищем начало JSON (первая {)
        start = response.find("{")
        if start == -1:
            print("JSON не найден в ответе")
            return
            
        # Ищем конец JSON (последняя })
        end = response.rfind("}") + 1
        if end == 0:
            print("JSON не найден в ответе")
            return
            
        json_str = response[start:end]
        data = json.loads(json_str)
        
        # Проверяем наличие всех обязательных полей
        required_fields = [
            "_id", "name", "description", "price", "uniqueProductOffer",
            "lastMonthRevenue", "expenses", "team", "budget", "product",
            "reputation", "level", "stage", "niche"
        ]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            print("\nОшибка: отсутствуют обязательные поля:", missing_fields)
            return
            
        # Проверяем значение stage
        valid_stages = [stage.value for stage in Stage]
        if data["stage"] not in valid_stages:
            print(f"\nОшибка: недопустимое значение stage: {data['stage']}")
            print(f"Допустимые значения: {valid_stages}")
            return
            
        # Проверяем соответствие ниши
        expected_niche = data["_id"].split("-")[1]
        if data["niche"] != expected_niche:
            print(f"\nОшибка: несоответствие ниши в _id и поле niche")
            print(f"_id указывает на нишу: {expected_niche}")
            print(f"Поле niche содержит: {data['niche']}")
            return
            
        # Проверяем язык описания и предложения
        def is_russian_text(text: str) -> bool:
            # Проверяем наличие русских букв
            has_russian = any(ord('а') <= ord(c) <= ord('я') or ord('А') <= ord(c) <= ord('Я') for c in text)
            # Проверяем отсутствие латинских букв
            has_latin = any(ord('a') <= ord(c) <= ord('z') or ord('A') <= ord(c) <= ord('Z') for c in text)
            return has_russian and not has_latin
            
        if not is_russian_text(data["description"]):
            print("\nОшибка: описание должно быть на русском языке и не содержать английский текст")
            return
            
        if not is_russian_text(data["uniqueProductOffer"]):
            print("\nОшибка: уникальное предложение должно быть на русском языке и не содержать английский текст")
            return
            
        print("\nРаспарсенный JSON:")
        print(json.dumps(data, indent=2, ensure_ascii=False))
    except json.JSONDecodeError as e:
        print(f"\nОшибка парсинга JSON: {e}")
        print("Сырой JSON:")
        print(json_str)

if __name__ == "__main__":
    test_startup_generation()
    test_crisis_generation()
    test_conference_generation() 