// Константы с фиксированными требованиями
const MOBILE_REQUIREMENTS = `МОБИЛЬНАЯ ВЕРСИЯ
Меню: бургер
Порядок блоков: как на десктопе
Шрифты: адаптировать для идеального отображения`;

const TECH_REQUIREMENTS = `ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ
Платформа/стек: использовать
- React + TypeScript + Tailwind CSS
- Framer Motion для анимаций
- Мобильная адаптация с гамбургер-меню`;

const footer_requirements = `Footer/подвал:
- копирайт: создано и разработано в студии MegaGroup
- повтор меню + контакты
- политика конфиденциальности: ссылки на полные документы на скрытых страницах.`;

const STORAGE_KEY = 'lovablePromptBuilder';

// --- Элементы формы ---
const form = document.getElementById('promptForm');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const resultDiv = document.getElementById('result');
const promptOutput = document.getElementById('promptOutput');

// Обратная связь
const feedbackCheckbox = document.getElementById('feedbackCheckbox');
const feedbackFieldsDiv = document.getElementById('feedbackFields');

// Цвета
const colorPrimary = document.getElementById('colorPrimary');
const colorPrimaryHex = document.getElementById('colorPrimaryHex');
const colorPrimaryIgnore = document.getElementById('colorPrimaryIgnore');
const colorSecondary = document.getElementById('colorSecondary');
const colorSecondaryHex = document.getElementById('colorSecondaryHex');
const colorSecondaryIgnore = document.getElementById('colorSecondaryIgnore');
const colorAccent = document.getElementById('colorAccent');
const colorAccentHex = document.getElementById('colorAccentHex');
const colorAccentIgnore = document.getElementById('colorAccentIgnore');

// Материалы
const servicesTextarea = document.getElementById('services');
const companyDescTextarea = document.getElementById('companyDesc');

// Логотип
const hasLogoCheckbox = document.getElementById('hasLogo');

// Snap scrolling
const snapScrollingCheckbox = document.getElementById('snapScrolling');

// Стилистика
const styleInput = document.getElementById('style');
const stylePreset = document.getElementById('stylePreset');

// --- Элементы типографики (FontJoy) ---
const headerFontSelect = document.getElementById('headerFontStyle');
const bodyFontSelect = document.getElementById('bodyFontStyle');
let selectedFontPair = { header: '...', body: '...' };

// --- Элементы предпросмотра ---
const previewHeader = document.querySelector('.preview-header');
const previewBody = document.querySelector('.preview-body');
const regenerateBtn = document.getElementById('regenerateFonts');

// --- Данные шрифтов (загружаются из fonts-data.js) ---
let fontData = [];
let isFontDataLoaded = false;

// Загрузка данных шрифтов
function loadFontData() {
    if (typeof window.fontData !== 'undefined' && Array.isArray(window.fontData) && window.fontData.length > 0) {
        fontData = window.fontData;
        isFontDataLoaded = true;
        console.log(`✅ Загружено ${fontData.length} шрифтов`);

        // Если уже есть выбранная пара (например, из localStorage), обновим предпросмотр
        if (selectedFontPair.header !== '...' && selectedFontPair.body !== '...') {
            updateFontPreview(selectedFontPair);
        } else {
            // Иначе сгенерируем новую пару
            updateFontPair();
        }
    } else {
        console.error('❌ Данные шрифтов не найдены. Убедитесь, что fonts-data.js подключен.');
        // Заглушка на случай отсутствия (чтобы не было ошибок)
        fontData = [
            { name: 'Roboto', category: 'sans-serif', vector: [] },
            { name: 'Merriweather', category: 'serif', vector: [] }
        ];
        isFontDataLoaded = true;
        updateFontPair();
    }
}

// --- Функция подбора пары шрифтов на основе векторов ---
function findFontPair(headerPref, bodyPref) {
    if (!isFontDataLoaded || fontData.length === 0) {
        return { header: 'Roboto', body: 'Merriweather' };
    }

    // Фильтрация кандидатов для заголовков
    let headerCandidates = fontData.filter(f => {
        const cat = (f.category || '').toLowerCase();
        if (headerPref === 'serif' && (cat.includes('serif') || cat.includes('display'))) return true;
        if (headerPref === 'sans-serif' && (cat.includes('sans') || cat.includes('display'))) return true;
        if (headerPref === 'display' && cat.includes('display')) return true;
        if (headerPref === 'handwriting' && (cat.includes('hand') || cat.includes('script'))) return true;
        return headerPref === 'any';
    });
    if (headerCandidates.length === 0) headerCandidates = fontData;

    // Фильтрация для текста
    let bodyCandidates = fontData.filter(f => {
        const cat = (f.category || '').toLowerCase();
        if (bodyPref === 'serif' && cat.includes('serif')) return true;
        if (bodyPref === 'sans-serif' && cat.includes('sans')) return true;
        return bodyPref === 'any';
    });
    if (bodyCandidates.length === 0) bodyCandidates = fontData;

    // Поиск лучшей пары по метрике split cosine
    let bestPair = { header: headerCandidates[0].name, body: bodyCandidates[0].name };
    let bestScore = -Infinity;
    const maxAttempts = 500;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const h = headerCandidates[Math.floor(Math.random() * headerCandidates.length)];
        const b = bodyCandidates[Math.floor(Math.random() * bodyCandidates.length)];
        if (!h.vector || !b.vector || h.vector.length === 0 || b.vector.length === 0) continue;

        let posSum = 0, negSum = 0;
        for (let i = 0; i < h.vector.length; i++) {
            const diff = h.vector[i] - b.vector[i];
            if (diff > 0) posSum += diff;
            else negSum -= diff;
        }
        const score = posSum * negSum;
        if (score > bestScore) {
            bestScore = score;
            bestPair = { header: h.name, body: b.name };
        }
    }
    return bestPair;
}

// --- Функция для загрузки шрифта через Google Fonts ---
function loadGoogleFont(fontName) {
    if (!fontName || fontName === '...') return;
    const family = fontName.replace(/ /g, '+');
    const existingLink = document.querySelector(`link[href*="${family}"]`);
    if (!existingLink) {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;700&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
}

// --- Функция обновления предпросмотра ---
function updateFontPreview(pair) {
    if (!pair || !pair.header || !pair.body || pair.header === '...' || pair.body === '...') {
        return;
    }

    loadGoogleFont(pair.header);
    loadGoogleFont(pair.body);

    previewHeader.style.fontFamily = `'${pair.header}', 'Times New Roman', serif`;
    previewBody.style.fontFamily = `'${pair.body}', Arial, sans-serif`;

    previewHeader.textContent = `Заголовок (${pair.header}): Пример заголовка`;
    previewBody.textContent = `Основной текст (${pair.body}): Здесь будет пример текста, набранного основным шрифтом. Посмотрите, как он читается.`;
}

// Обновление выбранной пары и сохранение
function updateFontPair() {
    if (!isFontDataLoaded) return;
    selectedFontPair = findFontPair(headerFontSelect.value, bodyFontSelect.value);
    updateFontPreview(selectedFontPair);
    saveFormState();
    console.log('🔄 Пара обновлена:', selectedFontPair);
}

// --- Сохранение состояния в localStorage ---
function saveFormState() {
    const blocks = [];
    document.querySelectorAll('input[name="blocks"]:checked').forEach(cb => blocks.push(cb.value));

    const feedbackFields = [];
    document.querySelectorAll('input[name="feedbackFields"]:checked').forEach(cb => feedbackFields.push(cb.value));

    const formData = {
        siteType: document.querySelector('input[name="siteType"]:checked')?.value || 'Лендинг',
        theme: document.getElementById('theme').value,
        style: styleInput.value,
        stylePreset: stylePreset ? stylePreset.value : '',
        blocks: blocks,
        snapScrolling: snapScrollingCheckbox ? snapScrollingCheckbox.checked : false,
        feedbackFields: feedbackFields,
        colorPrimary: colorPrimary.value,
        colorPrimaryIgnore: colorPrimaryIgnore ? colorPrimaryIgnore.checked : false,
        colorSecondary: colorSecondary.value,
        colorSecondaryIgnore: colorSecondaryIgnore ? colorSecondaryIgnore.checked : false,
        colorAccent: colorAccent.value,
        colorAccentIgnore: colorAccentIgnore ? colorAccentIgnore.checked : false,
        services: servicesTextarea.value,
        companyDesc: companyDescTextarea.value,
        hasLogo: hasLogoCheckbox ? hasLogoCheckbox.checked : false,
        headerFontPref: headerFontSelect ? headerFontSelect.value : 'any',
        bodyFontPref: bodyFontSelect ? bodyFontSelect.value : 'any',
        suggestedHeaderFont: selectedFontPair.header,
        suggestedBodyFont: selectedFontPair.body
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    console.log('💾 Сохранено в localStorage');
}

// --- Загрузка состояния из localStorage ---
function loadFormState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
        const formData = JSON.parse(saved);

        // Тип сайта
        if (formData.siteType) {
            const radio = document.querySelector(`input[name="siteType"][value="${formData.siteType}"]`);
            if (radio) radio.checked = true;
        }

        document.getElementById('theme').value = formData.theme || '';
        if (styleInput) styleInput.value = formData.style || '';
        if (stylePreset && formData.stylePreset) stylePreset.value = formData.stylePreset;

        // Блоки
        if (Array.isArray(formData.blocks)) {
            document.querySelectorAll('input[name="blocks"]').forEach(cb => {
                cb.checked = formData.blocks.includes(cb.value);
            });
        }

        if (snapScrollingCheckbox) snapScrollingCheckbox.checked = formData.snapScrolling || false;

        // Поля формы
        if (Array.isArray(formData.feedbackFields)) {
            document.querySelectorAll('input[name="feedbackFields"]').forEach(cb => {
                cb.checked = formData.feedbackFields.includes(cb.value);
            });
        }

        // Цвета
        if (formData.colorPrimary) {
            colorPrimary.value = formData.colorPrimary;
            colorPrimaryHex.value = formData.colorPrimary;
        }
        if (colorPrimaryIgnore) colorPrimaryIgnore.checked = formData.colorPrimaryIgnore || false;

        if (formData.colorSecondary) {
            colorSecondary.value = formData.colorSecondary;
            colorSecondaryHex.value = formData.colorSecondary;
        }
        if (colorSecondaryIgnore) colorSecondaryIgnore.checked = formData.colorSecondaryIgnore || false;

        if (formData.colorAccent) {
            colorAccent.value = formData.colorAccent;
            colorAccentHex.value = formData.colorAccent;
        }
        if (colorAccentIgnore) colorAccentIgnore.checked = formData.colorAccentIgnore || false;

        servicesTextarea.value = formData.services || '';
        companyDescTextarea.value = formData.companyDesc || '';
        if (hasLogoCheckbox) hasLogoCheckbox.checked = formData.hasLogo || false;

        // Шрифты: устанавливаем значения селектов
        if (headerFontSelect && formData.headerFontPref) headerFontSelect.value = formData.headerFontPref;
        if (bodyFontSelect && formData.bodyFontPref) bodyFontSelect.value = formData.bodyFontPref;

        // Восстанавливаем сохранённую пару
        if (formData.suggestedHeaderFont && formData.suggestedBodyFont) {
            selectedFontPair = {
                header: formData.suggestedHeaderFont,
                body: formData.suggestedBodyFont
            };
            // Если данные шрифтов уже загружены, сразу обновим предпросмотр
            if (isFontDataLoaded) {
                updateFontPreview(selectedFontPair);
            }
        }

        toggleFeedbackFields();
        console.log('↩️ Загружено из localStorage');
    } catch (e) {
        console.error('Ошибка загрузки из localStorage', e);
    }
}

// --- Синхронизация цветов ---
function setupColorSync() {
    colorPrimary.addEventListener('input', () => {
        colorPrimaryHex.value = colorPrimary.value;
        saveFormState();
    });
    colorPrimaryHex.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(colorPrimaryHex.value)) {
            colorPrimary.value = colorPrimaryHex.value;
        }
        saveFormState();
    });

    colorSecondary.addEventListener('input', () => {
        colorSecondaryHex.value = colorSecondary.value;
        saveFormState();
    });
    colorSecondaryHex.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(colorSecondaryHex.value)) {
            colorSecondary.value = colorSecondaryHex.value;
        }
        saveFormState();
    });

    colorAccent.addEventListener('input', () => {
        colorAccentHex.value = colorAccent.value;
        saveFormState();
    });
    colorAccentHex.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(colorAccentHex.value)) {
            colorAccent.value = colorAccentHex.value;
        }
        saveFormState();
    });
}

// --- Синхронизация стилей ---
function setupStyleSync() {
    if (!stylePreset || !styleInput) return;
    stylePreset.addEventListener('change', function() {
        if (this.value && this.value !== 'custom') {
            styleInput.value = this.value;
        }
        saveFormState();
    });
    styleInput.addEventListener('input', function() {
        const currentVal = this.value;
        let matched = false;
        for (let opt of stylePreset.options) {
            if (opt.value === currentVal && opt.value !== 'custom') {
                matched = true;
                break;
            }
        }
        if (!matched && stylePreset.value !== 'custom') {
            stylePreset.value = 'custom';
        }
        saveFormState();
    });
}

// --- Показать/скрыть поля формы обратной связи ---
function toggleFeedbackFields() {
    if (feedbackCheckbox && feedbackFieldsDiv) {
        feedbackFieldsDiv.style.display = feedbackCheckbox.checked ? 'block' : 'none';
    }
}

// --- Генерация промпта ---
function generatePrompt() {
    const siteType = document.querySelector('input[name="siteType"]:checked')?.value || 'Лендинг';
    const theme = document.getElementById('theme').value.trim();
    if (!theme) {
        alert('Пожалуйста, введите тематику сайта.');
        return;
    }

    const blockCheckboxes = document.querySelectorAll('input[name="blocks"]:checked');
    const blocks = [];
    blockCheckboxes.forEach(cb => blocks.push(cb.value));
    const blocksText = blocks.length > 0 ? blocks.join(', ') : 'не выбраны';

    const style = styleInput.value.trim();
    if (!style) {
        alert('Пожалуйста, опишите стилистику.');
        return;
    }

    const snapScrolling = snapScrollingCheckbox.checked ? 'Да' : 'Нет';

    // Поля формы обратной связи
    let feedbackFieldsText = '';
    if (blocks.includes('Форма обратной связи')) {
        const feedbackFields = [];
        document.querySelectorAll('input[name="feedbackFields"]:checked').forEach(cb => feedbackFields.push(cb.value));
        if (feedbackFields.length > 0) {
            feedbackFieldsText = `Поля формы: ${feedbackFields.join(', ')}.`;
        } else {
            feedbackFieldsText = 'Поля формы не указаны (возможно, нужны поля по умолчанию).';
        }
    }

    // Цвета
    let colorsText = '';
    if (!colorPrimaryIgnore.checked || !colorSecondaryIgnore.checked || !colorAccentIgnore.checked) {
        colorsText = 'Цветовая схема:\n';
        if (!colorPrimaryIgnore.checked) colorsText += `- Основной цвет: ${colorPrimary.value}\n`;
        if (!colorSecondaryIgnore.checked) colorsText += `- Второстепенный цвет: ${colorSecondary.value}\n`;
        if (!colorAccentIgnore.checked) colorsText += `- Акцентный цвет: ${colorAccent.value}\n`;
    } else {
        colorsText = 'Цветовые предпочтения не заданы (разработчик может выбрать сам).\n';
    }

    // Материалы
    let materialsText = '';
    if (servicesTextarea.value.trim() || companyDescTextarea.value.trim()) {
        materialsText = 'Материалы заказчика:\n';
        if (servicesTextarea.value.trim()) {
            materialsText += `- Услуги/товары:\n${servicesTextarea.value.trim()}\n`;
        }
        if (companyDescTextarea.value.trim()) {
            materialsText += `- Описание компании: ${companyDescTextarea.value.trim()}\n`;
        }
    }

    // Логотип
    const logoText = hasLogoCheckbox.checked
        ? 'Есть логотип. Проанализируй прикрепленный логотип, выдели дизайн систему и используй ее для сайта.'
        : 'Логотип не предоставлен.';

    // Шрифты – если пара ещё не выбрана, генерируем
    if (selectedFontPair.header === '...' && isFontDataLoaded) {
        updateFontPair();
    }

    const fontsText = `Рекомендуемая пара шрифтов (на основе FontJoy):
- Для заголовков: ${selectedFontPair.header}
- Для основного текста: ${selectedFontPair.body}
(Подобрано с использованием реальных векторных данных из FontJoy.)`;

    // Сборка промпта
    let prompt = `Создай сайт для lovable.dev.\n\n`;
    prompt += `Тип сайта: ${siteType}.\n`;
    prompt += `Тематика: ${theme}.\n`;
    prompt += `Блоки на главной: ${blocksText}.\n`;
    if (feedbackFieldsText) {
        prompt += `\nДетали для формы обратной связи: ${feedbackFieldsText}\n`;
    }
    prompt += `Стилистика: ${style}.\n`;
    prompt += `Особенности верстки: ${snapScrolling === 'Да' ? 'использовать snap scrolling (прокрутка по секциям)' : 'без snap scrolling'}.\n\n`;

    prompt += `🎨 ДИЗАЙН СИСТЕМА:\n${colorsText}\n`;
    if (materialsText) prompt += `📄 МАТЕРИАЛЫ ЗАКАЗЧИКА:\n${materialsText}\n`;
    prompt += `🖼️ ЛОГОТИП: ${logoText}\n\n`;
    prompt += `🔤 ТИПОГРАФИКА:\n${fontsText}\n\n`;

    prompt += MOBILE_REQUIREMENTS + '\n\n';
    prompt += TECH_REQUIREMENTS + '\n\n';
    prompt += footer_requirements + '\n\n';
    prompt += `Пожалуйста, сгенерируй код сайта, учитывая все указанные требования. При разработке дизайна опирайся на предоставленную дизайн-систему и, если есть, на стиль логотипа. Используй материалы заказчика для наполнения контентом.`;

    promptOutput.value = prompt;
    resultDiv.style.display = 'block';
}

// --- Копирование ---
function copyToClipboard() {
    promptOutput.select();
    promptOutput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Скопировано!';
    setTimeout(() => {
        copyBtn.textContent = originalText;
    }, 2000);
}

// --- Кнопка сброса ---
function addResetButton() {
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.id = 'resetBtn';
    resetBtn.textContent = 'Сбросить форму';
    resetBtn.style.backgroundColor = '#e74c3c';
    resetBtn.style.marginLeft = '10px';
    generateBtn.insertAdjacentElement('afterend', resetBtn);
    resetBtn.addEventListener('click', resetForm);
}

function resetForm() {
    if (confirm('Вы уверены? Все введённые данные будут удалены.')) {
        form.reset();

        const defaultRadio = document.querySelector('input[name="siteType"][value="Лендинг"]');
        if (defaultRadio) defaultRadio.checked = true;

        // Сброс цветов
        colorPrimary.value = '#3498db';
        colorPrimaryHex.value = '#3498db';
        if (colorPrimaryIgnore) colorPrimaryIgnore.checked = false;
        colorSecondary.value = '#2ecc71';
        colorSecondaryHex.value = '#2ecc71';
        if (colorSecondaryIgnore) colorSecondaryIgnore.checked = false;
        colorAccent.value = '#e74c3c';
        colorAccentHex.value = '#e74c3c';
        if (colorAccentIgnore) colorAccentIgnore.checked = false;

        if (hasLogoCheckbox) hasLogoCheckbox.checked = false;
        if (snapScrollingCheckbox) snapScrollingCheckbox.checked = false;
        if (stylePreset) stylePreset.value = '';

        // Сброс шрифтов
        if (headerFontSelect) headerFontSelect.value = 'any';
        if (bodyFontSelect) bodyFontSelect.value = 'any';
        if (isFontDataLoaded) updateFontPair();

        localStorage.removeItem(STORAGE_KEY);
        resultDiv.style.display = 'none';
        if (feedbackFieldsDiv) feedbackFieldsDiv.style.display = 'none';

        saveFormState();
    }
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
    // Сначала пытаемся загрузить данные шрифтов
    loadFontData();

    // Затем загружаем состояние формы
    loadFormState();

    // Настраиваем остальное
    toggleFeedbackFields();
    setupColorSync();
    setupStyleSync();

    if (headerFontSelect && bodyFontSelect) {
        headerFontSelect.addEventListener('change', updateFontPair);
        bodyFontSelect.addEventListener('change', updateFontPair);
    }

    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', () => {
            updateFontPair();
        });
    }

    // Сохраняем при любых изменениях
    form.addEventListener('input', saveFormState);
    form.addEventListener('change', saveFormState);

    if (feedbackCheckbox) {
        feedbackCheckbox.addEventListener('change', function() {
            toggleFeedbackFields();
            saveFormState();
        });
    }

    generateBtn.addEventListener('click', generatePrompt);
    copyBtn.addEventListener('click', copyToClipboard);
    addResetButton();
});