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

// --- База популярных шрифтов Google Fonts с категориями ---
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

// --- Функция генерации случайной пары шрифтов ---
function generateRandomFontPair() {
    // Для заголовков берём шрифты с style 'display' или любые
    let headerCandidates = fontDatabase.filter(f => f.style === 'display' || f.category === 'display');
    if (headerCandidates.length === 0) headerCandidates = fontDatabase;
    
    // Для текста берём шрифты с style 'text' или serif/sans-serif
    let bodyCandidates = fontDatabase.filter(f => f.style === 'text');
    if (bodyCandidates.length === 0) bodyCandidates = fontDatabase;

    let header = headerCandidates[Math.floor(Math.random() * headerCandidates.length)];
    let body = bodyCandidates[Math.floor(Math.random() * bodyCandidates.length)];
    
    // Избегаем одинаковых
    let attempts = 0;
    while (header.name === body.name && attempts < 10) {
        body = bodyCandidates[Math.floor(Math.random() * bodyCandidates.length)];
        attempts++;
    }
    
    return { header: header.name, body: body.name };
}

// --- Элементы формы ---
const form = document.getElementById('promptForm');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const resultDiv = document.getElementById('result');
const promptOutput = document.getElementById('promptOutput');

// Вкладки
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// --- Контекст и цели ---
const siteTypeRadios = document.querySelectorAll('input[name="siteType"]');
const projectName = document.getElementById('projectName');
const targetAudience = document.getElementById('targetAudience');
const siteGoals = document.querySelectorAll('input[name="siteGoals"]');
const toneSelect = document.getElementById('tone');
const toneOther = document.getElementById('toneOther');

// --- Дизайн ---
const styleInput = document.getElementById('style');
const stylePreset = document.getElementById('stylePreset');
const references = document.getElementById('references');

// Цвета (три)
const colorPrimary = document.getElementById('colorPrimary');
const colorPrimaryHex = document.getElementById('colorPrimaryHex');
const colorPrimaryIgnore = document.getElementById('colorPrimaryIgnore');
const colorSecondary = document.getElementById('colorSecondary');
const colorSecondaryHex = document.getElementById('colorSecondaryHex');
const colorSecondaryIgnore = document.getElementById('colorSecondaryIgnore');
const colorAccent = document.getElementById('colorAccent');
const colorAccentHex = document.getElementById('colorAccentHex');
const colorAccentIgnore = document.getElementById('colorAccentIgnore');

// Типографика
const headerFont = document.getElementById('headerFont');
const bodyFont = document.getElementById('bodyFont');
const generateFontBtn = document.getElementById('generateFontPair');

// --- Структура ---
const blocksCheckboxes = document.querySelectorAll('input[name="blocks"]');
const blocksSortable = document.getElementById('blocks-sortable');
let sortableInstance = null;
let selectedBlocks = [];

// --- Анимации ---
const hoverButtons = document.querySelectorAll('input[name="hoverButtons"]');
const hoverCards = document.querySelectorAll('input[name="hoverCards"]');
const hoverImages = document.querySelectorAll('input[name="hoverImages"]');
const snapScrollingCheckbox = document.getElementById('snapScrolling');

// --- Дополнительно ---
const servicesTextarea = document.getElementById('services');
const companyDescTextarea = document.getElementById('companyDesc');
const hasLogoCheckbox = document.getElementById('hasLogo');
const extraWishes = document.getElementById('extraWishes');

// --- Переключение вкладок ---
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// --- Показ/скрытие поля "другой" для тона ---
toneSelect.addEventListener('change', () => {
    if (toneSelect.value === 'other') {
        toneOther.style.display = 'block';
    } else {
        toneOther.style.display = 'none';
    }
    saveFormState();
});

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

// --- Синхронизация пресета стилей ---
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

// --- Генератор шрифтов ---
generateFontBtn.addEventListener('click', () => {
    const pair = generateRandomFontPair();
    headerFont.value = pair.header;
    bodyFont.value = pair.body;
    saveFormState();
});

// --- Обновление сортируемого списка блоков на основе чекбоксов ---
function updateBlocksList() {
    const checked = [];
    blocksCheckboxes.forEach(cb => {
        if (cb.checked) checked.push(cb.value);
    });
    
    const existingItems = Array.from(blocksSortable.children).map(li => li.textContent);
    const newOrder = selectedBlocks.filter(block => checked.includes(block));
    checked.forEach(block => {
        if (!newOrder.includes(block)) newOrder.push(block);
    });
    
    selectedBlocks = newOrder;
    renderSortableList();
}

function renderSortableList() {
    blocksSortable.innerHTML = '';
    selectedBlocks.forEach(block => {
        const li = document.createElement('li');
        li.textContent = block;
        blocksSortable.appendChild(li);
    });
}

function initSortable() {
    if (sortableInstance) sortableInstance.destroy();
    sortableInstance = new Sortable(blocksSortable, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function() {
            selectedBlocks = Array.from(blocksSortable.children).map(li => li.textContent);
            saveFormState();
        }
    });
}

// --- Сохранение состояния в localStorage ---
function saveFormState() {
    const siteType = document.querySelector('input[name="siteType"]:checked')?.value || 'Лендинг';
    const goals = [];
    siteGoals.forEach(cb => { if (cb.checked) goals.push(cb.value); });

    const hoverButtonsSelected = [];
    hoverButtons.forEach(cb => { if (cb.checked) hoverButtonsSelected.push(cb.value); });
    const hoverCardsSelected = [];
    hoverCards.forEach(cb => { if (cb.checked) hoverCardsSelected.push(cb.value); });
    const hoverImagesSelected = [];
    hoverImages.forEach(cb => { if (cb.checked) hoverImagesSelected.push(cb.value); });

    const formData = {
        siteType: siteType,
        projectName: projectName.value,
        targetAudience: targetAudience.value,
        siteGoals: goals,
        tone: toneSelect.value,
        toneOther: toneOther.value,
        style: styleInput.value,
        stylePreset: stylePreset ? stylePreset.value : '',
        references: references.value,
        colorPrimary: colorPrimary.value,
        colorPrimaryIgnore: colorPrimaryIgnore.checked,
        colorSecondary: colorSecondary.value,
        colorSecondaryIgnore: colorSecondaryIgnore.checked,
        colorAccent: colorAccent.value,
        colorAccentIgnore: colorAccentIgnore.checked,
        headerFont: headerFont.value,
        bodyFont: bodyFont.value,
        selectedBlocks: selectedBlocks,
        hoverButtons: hoverButtonsSelected,
        hoverCards: hoverCardsSelected,
        hoverImages: hoverImagesSelected,
        snapScrolling: snapScrollingCheckbox.checked,
        services: servicesTextarea.value,
        companyDesc: companyDescTextarea.value,
        hasLogo: hasLogoCheckbox.checked,
        extraWishes: extraWishes.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
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

        projectName.value = formData.projectName || '';
        targetAudience.value = formData.targetAudience || '';

        siteGoals.forEach(cb => {
            cb.checked = formData.siteGoals?.includes(cb.value) || false;
        });

        toneSelect.value = formData.tone || '';
        toneOther.value = formData.toneOther || '';
        if (toneSelect.value === 'other') toneOther.style.display = 'block';
        else toneOther.style.display = 'none';

        styleInput.value = formData.style || '';
        if (stylePreset && formData.stylePreset) stylePreset.value = formData.stylePreset;
        references.value = formData.references || '';

        if (formData.colorPrimary) {
            colorPrimary.value = formData.colorPrimary;
            colorPrimaryHex.value = formData.colorPrimary;
        }
        colorPrimaryIgnore.checked = formData.colorPrimaryIgnore || false;

        if (formData.colorSecondary) {
            colorSecondary.value = formData.colorSecondary;
            colorSecondaryHex.value = formData.colorSecondary;
        }
        colorSecondaryIgnore.checked = formData.colorSecondaryIgnore || false;

        if (formData.colorAccent) {
            colorAccent.value = formData.colorAccent;
            colorAccentHex.value = formData.colorAccent;
        }
        colorAccentIgnore.checked = formData.colorAccentIgnore || false;

        headerFont.value = formData.headerFont || '';
        bodyFont.value = formData.bodyFont || '';

        if (Array.isArray(formData.selectedBlocks)) {
            selectedBlocks = formData.selectedBlocks;
            blocksCheckboxes.forEach(cb => {
                cb.checked = selectedBlocks.includes(cb.value);
            });
        } else {
            selectedBlocks = [];
        }
        renderSortableList();

        hoverButtons.forEach(cb => {
            cb.checked = formData.hoverButtons?.includes(cb.value) || false;
        });
        hoverCards.forEach(cb => {
            cb.checked = formData.hoverCards?.includes(cb.value) || false;
        });
        hoverImages.forEach(cb => {
            cb.checked = formData.hoverImages?.includes(cb.value) || false;
        });

        snapScrollingCheckbox.checked = formData.snapScrolling || false;
        servicesTextarea.value = formData.services || '';
        companyDescTextarea.value = formData.companyDesc || '';
        hasLogoCheckbox.checked = formData.hasLogo || false;
        extraWishes.value = formData.extraWishes || '';

    } catch (e) {
        console.error('Ошибка загрузки из localStorage', e);
    }
}

// --- Генерация промпта ---
function generatePrompt() {
    if (!projectName.value.trim()) {
        alert('Пожалуйста, введите название проекта.');
        projectName.focus();
        return;
    }

    const siteType = document.querySelector('input[name="siteType"]:checked')?.value || 'Лендинг';
    let prompt = `# ПРОЕКТ: ${projectName.value.trim()}\n\n`;

    // 1. КОНТЕКСТ И ЦЕЛИ
    prompt += `## 1. КОНТЕКСТ И ЦЕЛИ\n`;
    prompt += `Тип сайта: ${siteType}\n`;
    if (targetAudience.value.trim()) prompt += `Целевая аудитория: ${targetAudience.value.trim()}\n`;
    
    const goals = [];
    siteGoals.forEach(cb => { if (cb.checked) goals.push(cb.value); });
    if (goals.length > 0) prompt += `Главная цель сайта: ${goals.join(', ')}\n`;
    
    let tone = toneSelect.value;
    if (tone === 'other' && toneOther.value.trim()) tone = toneOther.value.trim();
    if (tone && tone !== 'other') prompt += `Тон коммуникации: ${tone}\n`;
    prompt += '\n';

    // 2. ВИЗУАЛЬНАЯ ЭСТЕТИКА
    prompt += `## 2. ВИЗУАЛЬНАЯ ЭСТЕТИКА\n`;
    if (styleInput.value.trim()) prompt += `Стиль направления: ${styleInput.value.trim()}\n`;
    if (references.value.trim()) prompt += `Референсы: ${references.value.trim()}\n`;
    prompt += '\n';

    // 3. ЦВЕТОВАЯ ПАЛИТРА
    prompt += `## 3. ЦВЕТОВАЯ ПАЛИТРА\n`;
    if (!colorPrimaryIgnore.checked) prompt += `Основной цвет: ${colorPrimary.value}\n`;
    if (!colorSecondaryIgnore.checked) prompt += `Второстепенный цвет: ${colorSecondary.value}\n`;
    if (!colorAccentIgnore.checked) prompt += `Акцентный цвет: ${colorAccent.value}\n`;
    prompt += '\n';

    // 4. ТИПОГРАФИКА
    prompt += `## 4. ТИПОГРАФИКА\n`;
    if (headerFont.value.trim()) prompt += `Шрифт заголовков: ${headerFont.value.trim()}\n`;
    if (bodyFont.value.trim()) prompt += `Шрифт основного текста: ${bodyFont.value.trim()}\n`;
    prompt += '\n';

    // 5. СТРУКТУРА И СЕКЦИИ
    prompt += `## 5. СТРУКТУРА И СЕКЦИИ (ПО ПОРЯДКУ)\n`;
    if (selectedBlocks.length > 0) {
        selectedBlocks.forEach((block, index) => {
            prompt += `${index+1}. ${block}\n`;
        });
    } else {
        prompt += `Блоки не выбраны.\n`;
    }
    prompt += '\n';

    // 6. ИНТЕРАКТИВНОСТЬ И АНИМАЦИИ
    prompt += `## 6. ИНТЕРАКТИВНОСТЬ И АНИМАЦИИ\n`;

    const hoverButtonsSelected = [];
    hoverButtons.forEach(cb => { if (cb.checked) hoverButtonsSelected.push(cb.value); });
    if (hoverButtonsSelected.length > 0) {
        prompt += `Ховер-эффекты для кнопок: ${hoverButtonsSelected.join(', ')}\n`;
    }

    const hoverCardsSelected = [];
    hoverCards.forEach(cb => { if (cb.checked) hoverCardsSelected.push(cb.value); });
    if (hoverCardsSelected.length > 0) {
        prompt += `Ховер-эффекты для карточек: ${hoverCardsSelected.join(', ')}\n`;
    }

    const hoverImagesSelected = [];
    hoverImages.forEach(cb => { if (cb.checked) hoverImagesSelected.push(cb.value); });
    if (hoverImagesSelected.length > 0) {
        prompt += `Ховер-эффекты для изображений: ${hoverImagesSelected.join(', ')}\n`;
    }

    if (snapScrollingCheckbox.checked) prompt += `Особенности верстки: snap scrolling\n`;
    prompt += '\n';

    // 7. МОБИЛЬНАЯ ВЕРСИЯ
    prompt += `## 7. МОБИЛЬНАЯ ВЕРСИЯ\n`;
    prompt += MOBILE_REQUIREMENTS + '\n\n';

    // 8. ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ
    prompt += `## 8. ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ\n`;
    prompt += TECH_REQUIREMENTS + '\n\n';

    // 9. ДОПОЛНИТЕЛЬНЫЕ ПОЖЕЛАНИЯ
    prompt += `## 9. ДОПОЛНИТЕЛЬНЫЕ ПОЖЕЛАНИЯ\n`;
    if (servicesTextarea.value.trim()) {
        prompt += `Материалы заказчика (услуги/товары):\n${servicesTextarea.value.trim()}\n`;
    }
    if (companyDescTextarea.value.trim()) {
        prompt += `Описание компании: ${companyDescTextarea.value.trim()}\n`;
    }
    if (hasLogoCheckbox.checked) {
        prompt += `Есть логотип. Проанализируй его и используй дизайн-систему.\n`;
    }
    if (extraWishes.value.trim()) {
        prompt += `Дополнительно: ${extraWishes.value.trim()}\n`;
    }
    prompt += `\nПожалуйста, сгенерируй код сайта, учитывая все указанные требования. При разработке дизайна опирайся на предоставленную дизайн-систему и, если есть, на стиль логотипа. Используй материалы заказчика для наполнения контентом.`;

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
        toneOther.style.display = 'none';
        selectedBlocks = [];
        renderSortableList();
        localStorage.removeItem(STORAGE_KEY);
        resultDiv.style.display = 'none';
        saveFormState();
    }
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
    loadFormState();
    initSortable();
    setupColorSync();
    setupStyleSync();

    blocksCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            updateBlocksList();
            saveFormState();
        });
    });

    // Сохранение при изменениях
    [hoverButtons, hoverCards, hoverImages].forEach(group => {
        group.forEach(cb => cb.addEventListener('change', saveFormState));
    });
    snapScrollingCheckbox.addEventListener('change', saveFormState);
    
    form.addEventListener('input', saveFormState);
    form.addEventListener('change', saveFormState);

    generateBtn.addEventListener('click', generatePrompt);
    copyBtn.addEventListener('click', copyToClipboard);
    addResetButton();
});