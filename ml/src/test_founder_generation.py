"""src/test_founder_generation.py
~~~~~~~~~~~~~~~~~~~~
Тестовый скрипт для генерации стартапов от фаундера.
"""
from __future__ import annotations

import json
import warnings
import random
from deep_translator import GoogleTranslator
from services.llm_service import (
    _get_generator,
    NICHES,
    NICHE_EXAMPLES,
    _sort_json_keys,
    generate_startup,
    generate_crisis,
    generate_conference
)
from src.models import Stage

# Инициализируем глобальный список для хранения результатов
results = []

# Фильтруем предупреждения о Sliding Window Attention
warnings.filterwarnings("ignore", message="Sliding Window Attention is enabled but not implemented for `sdpa`")

# Допустимые ниши для генерации
VALID_NICHES = ["IT", "GreenTech", "MedTech", "SpaceTech"]

def is_russian_text(text: str) -> bool:
    """Проверяет, является ли текст преимущественно русским."""
    # Подсчитываем количество русских букв
    russian_chars = sum(1 for c in text if ord('а') <= ord(c.lower()) <= ord('я'))
    # Подсчитываем общее количество букв
    total_chars = sum(1 for c in text if c.isalpha())
    # Если нет букв вообще, считаем что это не текст
    if total_chars == 0:
        return False
    # Если более 70% букв - русские, считаем что текст на русском
    return (russian_chars / total_chars) > 0.7

def clean_text(text: str) -> str:
    """Очищает текст от нежелательных символов, оставляя только русские буквы, цифры и знаки препинания."""
    # Разрешенные знаки препинания
    allowed_punctuation = '.,!?;:()[]{}«»""-–— '
    
    # Оставляем только русские буквы, цифры и разрешенные знаки препинания
    cleaned = ''.join(c for c in text if (
        ord('а') <= ord(c.lower()) <= ord('я') or  # русские буквы
        c.isdigit() or  # цифры
        c in allowed_punctuation  # разрешенные знаки препинания
    ))
    
    # Убираем множественные пробелы
    cleaned = ' '.join(cleaned.split())
    
    return cleaned

def translate_to_russian(text: str) -> str:
    """Переводит текст на русский язык используя Google Translate."""
    try:
        # Если текст уже преимущественно на русском, возвращаем его как есть
        if is_russian_text(text):
            return text
            
        # Разбиваем текст на предложения для лучшего перевода
        sentences = text.split('.')
        translated_sentences = []
        
        translator = GoogleTranslator(source='auto', target='ru')
        
        for sentence in sentences:
            if sentence.strip():
                try:
                    translated = translator.translate(sentence.strip())
                    translated_sentences.append(translated)
                except Exception as e:
                    print(f"Ошибка при переводе предложения: {e}")
                    translated_sentences.append(sentence.strip())
        
        # Собираем текст обратно
        result = '. '.join(translated_sentences)
        if result and not result.endswith('.'):
            result += '.'
            
        return result
    except Exception as e:
        print(f"Ошибка при переводе: {e}")
        return text

def test_generation(prompt: str, max_attempts: int = 3) -> tuple[bool, dict | None]:
    """Общая функция для тестирования генерации.
    
    Returns:
        tuple[bool, dict | None]: (True, data) если JSON успешно сгенерирован, (False, None) в противном случае
    """
    global results  # Добавляем объявление глобальной переменной
    pipe = _get_generator()
    
    for attempt in range(max_attempts):
        if attempt > 0:
            print(f"\nПопытка генерации #{attempt + 1}...")
            
        response = pipe(prompt, max_new_tokens=500, do_sample=True, temperature=0.7)[0]["generated_text"]
        
        print("\nСырой ответ модели:")
        print("-" * 80)
        print(response)
        print("-" * 80)
        
        # Ищем JSON в ответе
        try:
            # Ищем первый валидный JSON в ответе
            start = response.find("{")
            if start == -1:
                print("JSON не найден в ответе")
                continue
                
            # Ищем конец первого JSON объекта
            end = start + 1
            brace_count = 1
            while brace_count > 0 and end < len(response):
                if response[end] == "{":
                    brace_count += 1
                elif response[end] == "}":
                    brace_count -= 1
                end += 1
                
            if brace_count > 0:
                print("Неполный JSON в ответе")
                continue
                
            json_str = response[start:end]
            try:
                data = json.loads(json_str)
            except json.JSONDecodeError:
                print("Ошибка парсинга JSON")
                continue
                
            # Если JSON вложенный (например, {"startup-IT-4": {...}} или {"startup": {...}}), извлекаем внутренний объект
            if len(data) == 1 and isinstance(next(iter(data.values())), dict):
                data = next(iter(data.values()))
            
            # Проверяем наличие всех обязательных полей
            required_fields = [
                "name", "description", "price", "uniqueProductOffer",
                "lastMonthRevenue", "expenses", "team", "budget", "product",
                "reputation", "level", "stage", "niche"
            ]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                print("\nОшибка: отсутствуют обязательные поля:", missing_fields)
                continue
                
            # Извлекаем нишу из prompt
            niche_name = None
            for line in prompt.split("\n"):
                if "startup-" in line and "-" in line:
                    # Находим оригинальный niche_name из VALID_NICHES
                    extracted_niche = line.split("startup-")[1].split("-")[0]
                    for valid_niche in VALID_NICHES:
                        if valid_niche.lower() == extracted_niche.lower():
                            niche_name = valid_niche
                            break
                    break
                    
            if not niche_name:
                print("Не удалось определить нишу из prompt")
                continue
                
            # Проверяем значение stage и преобразуем в верхний регистр
            valid_stages = [stage.value for stage in Stage]
            if data["stage"].upper() not in valid_stages:
                print(f"\nОшибка: недопустимое значение stage: {data['stage']}")
                print(f"Допустимые значения: {valid_stages}")
                continue
            data["stage"] = data["stage"].upper()
                
            # Проверяем значение niche и исправляем если неправильное
            if data["niche"] != niche_name:
                print(f"\nИсправляем значение niche с '{data['niche']}' на '{niche_name}'")
                data["niche"] = niche_name
                
            # Проверяем и переводим description если нужно
            if not is_russian_text(data["description"]):
                print("\nПереводим поле description на русский язык...")
                original_description = data["description"]
                data["description"] = translate_to_russian(data["description"])
                if not is_russian_text(data["description"]):
                    print("Ошибка: не удалось перевести description на русский язык")
                    print(f"Оригинальный текст: {original_description}")
                    print(f"Переведенный текст: {data['description']}")
                    continue
            # Очищаем текст от нежелательных символов
            data["description"] = clean_text(data["description"])
                    
            # Проверяем и переводим uniqueProductOffer если нужно
            if not is_russian_text(data["uniqueProductOffer"]):
                print("\nПереводим поле uniqueProductOffer на русский язык...")
                original_offer = data["uniqueProductOffer"]
                data["uniqueProductOffer"] = translate_to_russian(data["uniqueProductOffer"])
                if not is_russian_text(data["uniqueProductOffer"]):
                    print("Ошибка: не удалось перевести uniqueProductOffer на русский язык")
                    print(f"Оригинальный текст: {original_offer}")
                    print(f"Переведенный текст: {data['uniqueProductOffer']}")
                    continue
            # Очищаем текст от нежелательных символов
            data["uniqueProductOffer"] = clean_text(data["uniqueProductOffer"])
                
            # Проверяем на копирование из примеров
            is_copied = False
            for niche in VALID_NICHES:
                examples = NICHE_EXAMPLES[niche]
                if (data["name"] == examples["name"] or
                    data["description"] == examples["description"] or
                    data["uniqueProductOffer"] == examples["offer"]):
                    print(f"\nОбнаружено копирование из примеров для ниши {niche}, пробуем сгенерировать заново...")
                    is_copied = True
                    break
                    
            if is_copied:
                continue
                
            # Проверяем соответствие тематике для SpaceTech
            if niche_name == "SpaceTech":
                # Проверяем соответствие описания нише
                space_tech_keywords = ["космос", "спутник", "орбита", "ракета", "космический", "астрономия", "галактика", "звезда", "планета", "навигация", "данные", "технология", "исследование", "анализ"]
                if not any(keyword in data["description"].lower() for keyword in space_tech_keywords):
                    print("\nПредупреждение: описание может не полностью соответствовать нише SpaceTech, но продолжаем...")
                
                if not any(keyword in data["uniqueProductOffer"].lower() for keyword in space_tech_keywords):
                    print("\nПредупреждение: уникальное предложение может не полностью соответствовать нише SpaceTech, но продолжаем...")
            
            # Если все проверки пройдены успешно, выводим результат и завершаем функцию
            print("\nРаспарсенный JSON:")
            sorted_data = _sort_json_keys(data)
            # Добавляем пустой _id
            sorted_data["_id"] = ""
            print(json.dumps(sorted_data, indent=2, ensure_ascii=False))
            
            # Добавляем результат в список
            results.append(sorted_data)
            
            return True, sorted_data
            
        except Exception as e:
            print(f"\nНеожиданная ошибка: {e}")
            continue
            
    print(f"\nНе удалось сгенерировать корректный JSON после {max_attempts} попыток")
    return False, None

def test_founder_startup_generation():
    """Тестирует генерацию JSON для стартапов от фаундера."""
    pipe = _get_generator()
    
    # Получаем список допустимых значений для stage
    valid_stages = [stage.value for stage in Stage]
    
    # Создаем список для хранения результатов
    results = []
    
    # Генерируем стартап для каждой ниши
    for niche_id, niche_name in NICHES.items():
        startup_number = random.randint(1, 100)
        
        prompt = (
            "Привет! Ты - Опытнейший и очень успешный фаундер стартапов, все твои идеи обречены на успех, "
            "если не случится что-то крайне глобальное и непредвиденное событие, или даже их череда. "
            "Твоя задача:\n"
            "1) Генерировать реалистичные профили стартапов из наших ниш\n"
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
            "- niche: ниша рынка (должна быть СТРОГО {niche_name}, другие ниши НЕДОПУСТИМЫ)\n\n"
            "КРИТИЧЕСКИ ВАЖНО:\n"
            "1) Все поля обязательны, нельзя пропускать ни одного поля\n"
            "2) Все числовые поля должны быть простыми целыми числами, без вложенных объектов или массивов\n"
            "3) Поле name должно быть на английском языке и соответствовать нише {niche_name}\n"
            "4) Поля description и uniqueProductOffer ОБЯЗАТЕЛЬНО должны быть на русском языке и соответствовать нише {niche_name}\n"
            "5) Используйте ТОЛЬКО кириллицу для русских текстов\n"
            "6) Проверьте, что все поля присутствуют в JSON перед отправкой\n"
            "7) Поле stage должно быть строго одним из значений: {valid_stages}\n"
            "8) Все текстовые поля должны соответствовать нише {niche_name}\n"
            "9) Поле niche должно быть СТРОГО равно '{niche_name}', другие ниши НЕДОПУСТИМЫ\n"
            "10) Поле _id должно начинаться с 'startup-{niche_name}-'\n"
            "11) НЕ используйте английский язык в полях description и uniqueProductOffer\n"
            "12) НЕ копируйте примеры из NICHE_EXAMPLES, создавайте уникальный контент\n"
            "13) НЕ используйте другие ниши кроме {niche_name}\n"
            "14) Создавайте АБСОЛЮТНО УНИКАЛЬНЫЙ контент, не используйте примеры как шаблон\n"
            "15) В полях description и uniqueProductOffer ЗАПРЕЩЕНО использовать английский язык\n"
            "16) В полях description и uniqueProductOffer ОБЯЗАТЕЛЬНО используйте ТОЛЬКО русский язык\n"
            "17) В полях description и uniqueProductOffer НЕДОПУСТИМО использовать латинские буквы\n"
            "18) В полях description и uniqueProductOffer ЗАПРЕЩЕНО использовать иероглифы и другие не-кириллические символы\n"
            "19) В полях description и uniqueProductOffer ДОПУСТИМЫ ТОЛЬКО русские буквы, цифры и знаки препинания\n"
            "20) В полях description и uniqueProductOffer НЕДОПУСТИМО использовать транслитерацию\n\n"
            "Примеры для ниши {niche_name} (НЕ КОПИРУЙТЕ ИХ, они только для понимания формата):\n"
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
        
        print(f"\nТестирование генерации стартапа для ниши {niche_name}:")
        print("-" * 80)
        success, data = test_generation(prompt)
        if success:
            print(f"\nУспешно сгенерирован JSON для ниши {niche_name}, переходим к следующей нише...")
            # Добавляем результат в список
            results.append(data)
            continue
        else:
            print(f"\nНе удалось сгенерировать JSON для ниши {niche_name}, пробуем следующую нишу...")
            continue
    
    # Сохраняем результаты в файл
    if results:
        output_file = "generated_startups.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"\nРезультаты сохранены в файл: {output_file}")
    else:
        print("\nНет результатов для сохранения")
            
    return None

def test_mt5_generation():
    """Тестирует генерацию текста с использованием MT5."""
    print("\nТестирование генерации текста с MT5:")
    print("-" * 80)
    
    # Используем тот же промпт, что и в основном генераторе
    prompt = (
        "Привет! Ты - Опытнейший и очень успешный фаундер стартапов, все твои идеи обречены на успех, "
        "если не случится что-то крайне глобальное и непредвиденное событие, или даже их череда. "
        "Твоя задача:\n"
        "1) Генерировать реалистичные профили стартапов из наших ниш\n"
        "2) Создавать интересные кризисные ситуации с возможными решениями\n"
        "3) Придумывать технологические конференции с балансными наградами\n"
        "4) Убедиться, что все числовые значения реалистичны и сбалансированы\n"
        "5) Генерировать данные в строго заданном JSON формате\n"
        "6) Создавать уникальные и интересные описания\n\n"
        "Сгенерируй профиль технологического стартапа в формате JSON. ВАЖНО: все поля обязательны!\n"
        "Поля JSON:\n"
        "- _id: уникальный идентификатор в формате 'startup-IT-{number}'\n"
        "- name: название стартапа на английском языке, соответствующее нише IT\n"
        "- description: краткое описание на русском языке, соответствующее нише IT\n"
        "- price: стоимость в рублях (целое число)\n"
        "- uniqueProductOffer: уникальное торговое предложение на русском языке, соответствующее нише IT\n"
        "- lastMonthRevenue: доход за последний месяц (целое число)\n"
        "- expenses: общая сумма ежемесячных расходов (целое число)\n"
        "- team: общее количество сотрудников (целое число)\n"
        "- budget: текущий бюджет (целое число)\n"
        "- product: готовность продукта (целое число от 0 до 100)\n"
        "- reputation: репутация (целое число от 0 до 100)\n"
        "- level: уровень (целое число от 1 до 5)\n"
        "- stage: стадия (строго одно из значений: {valid_stages})\n"
        "- niche: ниша рынка (должна быть СТРОГО IT, другие ниши НЕДОПУСТИМЫ)\n\n"
        "КРИТИЧЕСКИ ВАЖНО:\n"
        "1) Все поля обязательны, нельзя пропускать ни одного поля\n"
        "2) Все числовые поля должны быть простыми целыми числами, без вложенных объектов или массивов\n"
        "3) Поле name должно быть на английском языке и соответствовать нише IT\n"
        "4) Поля description и uniqueProductOffer ОБЯЗАТЕЛЬНО должны быть на русском языке и соответствовать нише IT\n"
        "5) Используйте ТОЛЬКО кириллицу для русских текстов\n"
        "6) Проверьте, что все поля присутствуют в JSON перед отправкой\n"
        "7) Поле stage должно быть строго одним из значений: {valid_stages}\n"
        "8) Все текстовые поля должны соответствовать нише IT\n"
        "9) Поле niche должно быть СТРОГО равно 'IT', другие ниши НЕДОПУСТИМЫ\n"
        "10) Поле _id должно начинаться с 'startup-IT-'\n"
        "11) НЕ используйте английский язык в полях description и uniqueProductOffer\n"
        "12) НЕ копируйте примеры из NICHE_EXAMPLES, создавайте уникальный контент\n"
        "13) НЕ используйте другие ниши кроме IT\n"
        "14) Создавайте АБСОЛЮТНО УНИКАЛЬНЫЙ контент, не используйте примеры как шаблон\n"
        "15) В полях description и uniqueProductOffer ЗАПРЕЩЕНО использовать английский язык\n"
        "16) В полях description и uniqueProductOffer ОБЯЗАТЕЛЬНО используйте ТОЛЬКО русский язык\n"
        "17) В полях description и uniqueProductOffer НЕДОПУСТИМО использовать латинские буквы\n"
        "18) В полях description и uniqueProductOffer ЗАПРЕЩЕНО использовать иероглифы и другие не-кириллические символы\n"
        "19) В полях description и uniqueProductOffer ДОПУСТИМЫ ТОЛЬКО русские буквы, цифры и знаки препинания\n"
        "20) В полях description и uniqueProductOffer НЕДОПУСТИМО использовать транслитерацию\n\n"
        "JSON:"
    ).format(
        number=random.randint(1, 100),
        valid_stages=", ".join([stage.value for stage in Stage])
    )
    
    try:
        result = generate_mt5(prompt)
        print("\nРезультат генерации MT5:")
        print(result)
        return True
    except Exception as e:
        print(f"\nОшибка при генерации MT5: {e}")
        return False

def test_qwen_generation():
    """Тестирует генерацию текста с использованием Qwen."""
    try:
        pipe = get_qwen_generator()
        prompt = (
            "Привет! Ты - Опытнейший и очень успешный фаундер стартапов, все твои идеи обречены на успех, "
            "если не случится что-то крайне глобальное и непредвиденное событие, или даже их череда. "
            "Твоя задача:\n"
            "1) Генерировать реалистичные профили стартапов из наших ниш\n"
            "2) Создавать интересные кризисные ситуации с возможными решениями\n"
            "3) Придумывать технологические конференции с балансными наградами\n"
            "4) Убедиться, что все числовые значения реалистичны и сбалансированы\n"
            "5) Генерировать данные в строго заданном JSON формате\n"
            "6) Создавать уникальные и интересные описания\n\n"
            "Сгенерируй профиль технологического стартапа в формате JSON. ВАЖНО: все поля обязательны!\n"
            "Поля JSON:\n"
            "- _id: уникальный идентификатор в формате 'startup-IT-{number}'\n"
            "- name: название стартапа на английском языке, соответствующее нише IT\n"
            "- description: краткое описание на русском языке, соответствующее нише IT\n"
            "- price: стоимость в рублях (целое число)\n"
            "- uniqueProductOffer: уникальное торговое предложение на русском языке, соответствующее нише IT\n"
            "- lastMonthRevenue: доход за последний месяц (целое число)\n"
            "- expenses: общая сумма ежемесячных расходов (целое число)\n"
            "- team: общее количество сотрудников (целое число)\n"
            "- budget: текущий бюджет (целое число)\n"
            "- product: готовность продукта (целое число от 0 до 100)\n"
            "- reputation: репутация (целое число от 0 до 100)\n"
            "- level: уровень (целое число от 1 до 5)\n"
            "- stage: стадия (строго одно из значений: {valid_stages})\n"
            "- niche: ниша рынка (должна быть СТРОГО IT, другие ниши НЕДОПУСТИМЫ)\n\n"
            "КРИТИЧЕСКИ ВАЖНО:\n"
            "1) Все поля обязательны, нельзя пропускать ни одного поля\n"
            "2) Все числовые поля должны быть простыми целыми числами, без вложенных объектов или массивов\n"
            "3) Поле name должно быть на английском языке и соответствовать нише IT\n"
            "4) Поля description и uniqueProductOffer ОБЯЗАТЕЛЬНО должны быть на русском языке и соответствовать нише IT\n"
            "5) Используйте ТОЛЬКО кириллицу для русских текстов\n"
            "6) Проверьте, что все поля присутствуют в JSON перед отправкой\n"
            "7) Поле stage должно быть строго одним из значений: {valid_stages}\n"
            "8) Все текстовые поля должны соответствовать нише IT\n"
            "9) Поле niche должно быть СТРОГО равно 'IT', другие ниши НЕДОПУСТИМЫ\n"
            "10) Поле _id должно начинаться с 'startup-IT-'\n"
            "11) НЕ используйте английский язык в полях description и uniqueProductOffer\n"
            "12) НЕ копируйте примеры из NICHE_EXAMPLES, создавайте уникальный контент\n"
            "13) НЕ используйте другие ниши кроме IT\n"
            "14) Создавайте АБСОЛЮТНО УНИКАЛЬНЫЙ контент, не используйте примеры как шаблон\n"
            "15) В полях description и uniqueProductOffer ЗАПРЕЩЕНО использовать английский язык\n"
            "16) В полях description и uniqueProductOffer ОБЯЗАТЕЛЬНО используйте ТОЛЬКО русский язык\n"
            "17) В полях description и uniqueProductOffer НЕДОПУСТИМО использовать латинские буквы\n"
            "18) В полях description и uniqueProductOffer ЗАПРЕЩЕНО использовать иероглифы и другие не-кириллические символы\n"
            "19) В полях description и uniqueProductOffer ДОПУСТИМЫ ТОЛЬКО русские буквы, цифры и знаки препинания\n"
            "20) В полях description и uniqueProductOffer НЕДОПУСТИМО использовать транслитерацию\n\n"
            "JSON:"
        ).format(
            number=random.randint(1, 100),
            valid_stages=", ".join([stage.value for stage in Stage])
        )
        
        response = pipe(prompt, max_new_tokens=500, do_sample=True, temperature=0.7)[0]["generated_text"]
        print("\nСырой ответ модели:")
        print("-" * 80)
        print(response)
        print("-" * 80)
        return True
    except Exception as e:
        print(f"Ошибка при генерации Qwen: {e}")
        return False

if __name__ == "__main__":
    test_founder_startup_generation()
    #test_mt5_generation()
    #test_qwen_generation() 