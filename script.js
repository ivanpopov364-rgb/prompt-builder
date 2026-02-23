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

// --- Встроенная база популярных шрифтов Google Fonts с категориями ---
const fontDatabase = [
    // С засечками (serif)
    { name: 'Merriweather', category: 'serif', style: 'text' },
    { name: 'Playfair Display', category: 'serif', style: 'display' },
    { name: 'PT Serif', category: 'serif', style: 'text' },
    { name: 'Lora', category: 'serif', style: 'text' },
    { name: 'Cormorant Garamond', category: 'serif', style: 'display' },
    { name: 'Roboto Slab', category: 'serif', style: 'text' },
    // Без засечек (sans-serif)
    { name: 'Roboto', category: 'sans-serif', style: 'text' },
    { name: 'Open Sans', category: 'sans-serif', style: 'text' },
    { name: 'Montserrat', category: 'sans-serif', style: 'display' },
    { name: 'Lato', category: 'sans-serif', style: 'text' },
    { name: 'Poppins', category: 'sans-serif', style: 'display' },
    { name: 'Oswald', category: 'sans-serif', style: 'display' },
    { name: 'Raleway', category: 'sans-serif', style: 'display' },
    { name: 'Inter', category: 'sans-serif', style: 'text' },
    { name: 'Source Sans Pro', category: 'sans-serif', style: 'text' },
    // Акцидентные (display) и рукописные
    { name: 'Lobster', category: 'display', style: 'display' },
    { name: 'Abril Fatface', category: 'display', style: 'display' },
    { name: 'Bebas Neue', category: 'display', style: 'display' },
    { name: 'Pacifico', category: 'handwriting', style: 'display' },
    { name: 'Dancing Script', category: 'handwriting', style: 'display' },
    { name: 'Comfortaa', category: 'display', style: 'display' }
];

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

// --- Элементы типографики ---
const headerFontSelect = document.getElementById('headerFontStyle');
const bodyFontSelect = document.getElementById('bodyFontStyle');
let selectedFontPair = { header: '...', body: '...' };

// --- Элементы предпросмотра ---
const previewHeader = document.querySelector('.preview-header');
const previewBody = document.querySelector('.preview-body');
const regenerateBtn = document.getElementById('regenerateFonts');

// --- Функция подбора пары шрифтов (без векторов) ---
function findFontPair(headerPref, bodyPref) {
    // Фильтруем кандидатов для заголовков
    let headerCandidates = fontDatabase.filter(f => {
        if (headerPref === 'serif' && f.category === 'serif' && f.style === 'display') return true;
        if (headerPref === 'sans-serif' && f.category === 'sans-serif' && f.style === 'display') return true;
        if (headerPref === 'display' && f.category === 'display') return true;
        if (headerPref === 'handwriting' && f.category === 'handwriting') return true;
        if (headerPref === 'any' && (f.style === 'display' || f.category === 'display')) return true;
        return false;
    });
    if (headerCandidates.length === 0) {
        // Запасной вариант: все, у которых style display
        headerCandidates = fontDatabase.filter(f => f.style === 'display');
    }
    if (headerCandidates.length === 0) headerCandidates = fontDatabase;

    // Фильтруем кандидатов для основного текста
    let bodyCandidates = fontDatabase.filter(f => {
        if (bodyPref === 'serif' && f.category === 'serif' && f.style === 'text') return true;
        if (bodyPref === 'sans-serif' && f.category === 'sans-serif' && f.style === 'text') return true;
        if (bodyPref === 'any' && f.style === 'text') return true;
        return false;
    });
    if (bodyCandidates.length === 0) {
        bodyCandidates = fontDatabase.filter(f => f.style === 'text');
    }
    if (bodyCandidates.length === 0) bodyCandidates = fontDatabase;

    // Выбираем случайные, но чтобы не совпадали
    let header = headerCandidates[Math.floor(Math.random() * headerCandidates.length)];
    let body = bodyCandidates[Math.floor(Math.random() * bodyCandidates.length)];
    
    let attempts = 0;
    while (header.name === body.name && attempts < 10) {
        body = bodyCandidates[Math.floor(Math.random() * bodyCandidates.length)];
        attempts++;
    }
    
    return { header: header.name, body: body.name };
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
}

// --- Загрузка состояния из localStorage ---
function loadFormState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
        const formData = JSON.parse(saved);

        if (formData.siteType) {
            const radio = document.querySelector(`input[name="siteType"][value="${formData.siteType}"]`);
            if (radio) radio.checked = true;
        }

        document.getElementById('theme').value = formData.theme || '';
        if (styleInput) styleInput.value = formData.style || '';
        if (stylePreset && formData.stylePreset) stylePreset.value = formData.stylePreset;

        if (Array.isArray(formData.blocks)) {
            document.querySelectorAll('input[name="blocks"]').forEach(cb => {
                cb.checked = formData.blocks.includes(cb.value);
            });
        }

        if (snapScrollingCheckbox) snapScrollingCheckbox.checked = formData.snapScrolling || false;

        if (Array.isArray(formData.feedbackFields)) {
            document.querySelectorAll('input[name="feedbackFields"]').forEach(cb => {
                cb.checked = formData.feedbackFields.includes(cb.value);
            });
        }

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

        if (headerFontSelect && formData.headerFontPref) headerFontSelect.value = formData.headerFontPref;
        if (bodyFontSelect && formData.bodyFontPref) bodyFontSelect.value = formData.bodyFontPref;

        if (formData.suggestedHeaderFont && formData.suggestedBodyFont) {
            selectedFontPair = {
                header: formData.suggestedHeaderFont,
                body: formData.suggestedBodyFont
            };
            updateFontPreview(selectedFontPair);
        } else {
            updateFontPair();
        }

        toggleFeedbackFields();
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

    let colorsText = '';
    if (!colorPrimaryIgnore.checked || !colorSecondaryIgnore.checked || !colorAccentIgnore.checked) {
        colorsText = 'Цветовая схема:\n';
        if (!colorPrimaryIgnore.checked) colorsText += `- Основной цвет: ${colorPrimary.value}\n`;
        if (!colorSecondaryIgnore.checked) colorsText += `- Второстепенный цвет: ${colorSecondary.value}\n`;
        if (!colorAccentIgnore.checked) colorsText += `- Акцентный цвет: ${colorAccent.value}\n`;
    } else {
        colorsText = 'Цветовые предпочтения не заданы (разработчик может выбрать сам).\n';
    }

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

    const logoText = hasLogoCheckbox.checked
        ? 'Есть логотип. Проанализируй прикрепленный логотип, выдели дизайн систему и используй ее для сайта.'
        : 'Логотип не предоставлен.';

    if (selectedFontPair.header === '...') {
        updateFontPair();
    }

    const fontsText = `Рекомендуемая пара шрифтов (на основе FontJoy):
- Для заголовков: ${selectedFontPair.header}
- Для основного текста: ${selectedFontPair.body}
(Подобрано с использованием популярных пар Google Fonts.)`;

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

        if (headerFontSelect) headerFontSelect.value = 'any';
        if (bodyFontSelect) bodyFontSelect.value = 'any';
        updateFontPair();

        localStorage.removeItem(STORAGE_KEY);
        resultDiv.style.display = 'none';
        if (feedbackFieldsDiv) feedbackFieldsDiv.style.display = 'none';

        saveFormState();
    }
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
    loadFormState();
    toggleFeedbackFields();
    setupColorSync();
    setupStyleSync();

    if (headerFontSelect && bodyFontSelect) {
        headerFontSelect.addEventListener('change', updateFontPair);
        bodyFontSelect.addEventListener('change', updateFontPair);
    }

    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', updateFontPair);
    }

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
