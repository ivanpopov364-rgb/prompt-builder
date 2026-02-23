// Константы с фиксированными требованиями (всегда добавляются в промпт)
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

// Вкладки
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// --- Контекст и цели ---
const projectName = document.getElementById('projectName');
const targetAudience = document.getElementById('targetAudience');
const siteGoals = document.querySelectorAll('input[name="siteGoals"]');
const toneSelect = document.getElementById('tone');
const toneOther = document.getElementById('toneOther');

// --- Дизайн ---
const styleInput = document.getElementById('style');
const stylePreset = document.getElementById('stylePreset');
const references = document.getElementById('references');

// Цвета
const colorPrimary = document.getElementById('colorPrimary');
const colorPrimaryHex = document.getElementById('colorPrimaryHex');
const colorPrimaryIgnore = document.getElementById('colorPrimaryIgnore');
const colorSecondary = document.getElementById('colorSecondary');
const colorSecondaryHex = document.getElementById('colorSecondaryHex');
const colorSecondaryIgnore = document.getElementById('colorSecondaryIgnore');
const colorBgPrimary = document.getElementById('colorBgPrimary');
const colorBgPrimaryHex = document.getElementById('colorBgPrimaryHex');
const colorBgSecondary = document.getElementById('colorBgSecondary');
const colorBgSecondaryHex = document.getElementById('colorBgSecondaryHex');
const colorTextHeaders = document.getElementById('colorTextHeaders');
const colorTextHeadersHex = document.getElementById('colorTextHeadersHex');
const colorTextBody = document.getElementById('colorTextBody');
const colorTextBodyHex = document.getElementById('colorTextBodyHex');
const gradients = document.getElementById('gradients');
const headerFont = document.getElementById('headerFont');
const bodyFont = document.getElementById('bodyFont');

// --- Структура ---
const blocksCheckboxes = document.querySelectorAll('input[name="blocks"]');
const blocksSortable = document.getElementById('blocks-sortable');
let sortableInstance = null;

// --- Анимации ---
const hoverButtons = document.querySelectorAll('input[name="hoverButtons"]');
const hoverCards = document.querySelectorAll('input[name="hoverCards"]');
const hoverImages = document.querySelectorAll('input[name="hoverImages"]');
const hoverButtonsSections = document.getElementById('hoverButtonsSections');
const hoverCardsSections = document.getElementById('hoverCardsSections');
const hoverImagesSections = document.getElementById('hoverImagesSections');

// --- Дополнительно ---
const servicesTextarea = document.getElementById('services');
const companyDescTextarea = document.getElementById('companyDesc');
const hasLogoCheckbox = document.getElementById('hasLogo');
const snapScrollingCheckbox = document.getElementById('snapScrolling');
const extraWishes = document.getElementById('extraWishes');

// --- Вспомогательные переменные ---
let selectedBlocks = []; // массив выбранных блоков в текущем порядке

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

    colorBgPrimary.addEventListener('input', () => {
        colorBgPrimaryHex.value = colorBgPrimary.value;
        saveFormState();
    });
    colorBgPrimaryHex.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(colorBgPrimaryHex.value)) {
            colorBgPrimary.value = colorBgPrimaryHex.value;
        }
        saveFormState();
    });

    colorBgSecondary.addEventListener('input', () => {
        colorBgSecondaryHex.value = colorBgSecondary.value;
        saveFormState();
    });
    colorBgSecondaryHex.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(colorBgSecondaryHex.value)) {
            colorBgSecondary.value = colorBgSecondaryHex.value;
        }
        saveFormState();
    });

    colorTextHeaders.addEventListener('input', () => {
        colorTextHeadersHex.value = colorTextHeaders.value;
        saveFormState();
    });
    colorTextHeadersHex.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(colorTextHeadersHex.value)) {
            colorTextHeaders.value = colorTextHeadersHex.value;
        }
        saveFormState();
    });

    colorTextBody.addEventListener('input', () => {
        colorTextBodyHex.value = colorTextBody.value;
        saveFormState();
    });
    colorTextBodyHex.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(colorTextBodyHex.value)) {
            colorTextBody.value = colorTextBodyHex.value;
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

// --- Обновление сортируемого списка блоков на основе чекбоксов ---
function updateBlocksList() {
    const checked = [];
    blocksCheckboxes.forEach(cb => {
        if (cb.checked) checked.push(cb.value);
    });
    
    // Сохраняем текущий порядок, но добавляем новые блоки в конец
    const existingItems = Array.from(blocksSortable.children).map(li => li.textContent);
    // Удаляем те, что больше не выбраны
    const newOrder = selectedBlocks.filter(block => checked.includes(block));
    // Добавляем новые блоки (которых ещё нет в порядке)
    checked.forEach(block => {
        if (!newOrder.includes(block)) newOrder.push(block);
    });
    
    selectedBlocks = newOrder;
    renderSortableList();
    updateHoverSectionsOptions();
}

// Отрисовка списка для сортировки
function renderSortableList() {
    blocksSortable.innerHTML = '';
    selectedBlocks.forEach(block => {
        const li = document.createElement('li');
        li.textContent = block;
        blocksSortable.appendChild(li);
    });
}

// Инициализация Sortable
function initSortable() {
    if (sortableInstance) sortableInstance.destroy();
    sortableInstance = new Sortable(blocksSortable, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function() {
            // Обновить порядок
            selectedBlocks = Array.from(blocksSortable.children).map(li => li.textContent);
            saveFormState();
            updateHoverSectionsOptions();
        }
    });
}

// Обновление списков секций в ховер-эффектах
function updateHoverSectionsOptions() {
    const sections = selectedBlocks;
    
    function populateSelect(select) {
        select.innerHTML = '';
        sections.forEach(section => {
            const option = document.createElement('option');
            option.value = section;
            option.textContent = section;
            select.appendChild(option);
        });
    }
    
    populateSelect(hoverButtonsSections);
    populateSelect(hoverCardsSections);
    populateSelect(hoverImagesSections);
}

// --- Сохранение состояния в localStorage ---
function saveFormState() {
    // Цели сайта
    const goals = [];
    siteGoals.forEach(cb => { if (cb.checked) goals.push(cb.value); });

    // Ховер-эффекты
    const hoverButtonsSelected = [];
    hoverButtons.forEach(cb => { if (cb.checked) hoverButtonsSelected.push(cb.value); });
    const hoverCardsSelected = [];
    hoverCards.forEach(cb => { if (cb.checked) hoverCardsSelected.push(cb.value); });
    const hoverImagesSelected = [];
    hoverImages.forEach(cb => { if (cb.checked) hoverImagesSelected.push(cb.value); });

    const formData = {
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
        colorBgPrimary: colorBgPrimary.value,
        colorBgSecondary: colorBgSecondary.value,
        colorTextHeaders: colorTextHeaders.value,
        colorTextBody: colorTextBody.value,
        gradients: gradients.value,
        headerFont: headerFont.value,
        bodyFont: bodyFont.value,
        selectedBlocks: selectedBlocks,
        hoverButtons: hoverButtonsSelected,
        hoverCards: hoverCardsSelected,
        hoverImages: hoverImagesSelected,
        hoverButtonsSections: Array.from(hoverButtonsSections.selectedOptions).map(o => o.value),
        hoverCardsSections: Array.from(hoverCardsSections.selectedOptions).map(o => o.value),
        hoverImagesSections: Array.from(hoverImagesSections.selectedOptions).map(o => o.value),
        services: servicesTextarea.value,
        companyDesc: companyDescTextarea.value,
        hasLogo: hasLogoCheckbox.checked,
        snapScrolling: snapScrollingCheckbox.checked,
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

        projectName.value = formData.projectName || '';
        targetAudience.value = formData.targetAudience || '';

        // Цели сайта
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

        // Цвета
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

        if (formData.colorBgPrimary) {
            colorBgPrimary.value = formData.colorBgPrimary;
            colorBgPrimaryHex.value = formData.colorBgPrimary;
        }
        if (formData.colorBgSecondary) {
            colorBgSecondary.value = formData.colorBgSecondary;
            colorBgSecondaryHex.value = formData.colorBgSecondary;
        }
        if (formData.colorTextHeaders) {
            colorTextHeaders.value = formData.colorTextHeaders;
            colorTextHeadersHex.value = formData.colorTextHeaders;
        }
        if (formData.colorTextBody) {
            colorTextBody.value = formData.colorTextBody;
            colorTextBodyHex.value = formData.colorTextBody;
        }

        gradients.value = formData.gradients || '';
        headerFont.value = formData.headerFont || '';
        bodyFont.value = formData.bodyFont || '';

        // Блоки
        if (Array.isArray(formData.selectedBlocks)) {
            selectedBlocks = formData.selectedBlocks;
            // Отметить чекбоксы
            blocksCheckboxes.forEach(cb => {
                cb.checked = selectedBlocks.includes(cb.value);
            });
        } else {
            selectedBlocks = [];
        }
        renderSortableList();

        // Ховер-эффекты
        if (Array.isArray(formData.hoverButtons)) {
            hoverButtons.forEach(cb => {
                cb.checked = formData.hoverButtons.includes(cb.value);
            });
        }
        if (Array.isArray(formData.hoverCards)) {
            hoverCards.forEach(cb => {
                cb.checked = formData.hoverCards.includes(cb.value);
            });
        }
        if (Array.isArray(formData.hoverImages)) {
            hoverImages.forEach(cb => {
                cb.checked = formData.hoverImages.includes(cb.value);
            });
        }

        // Привязка к секциям
        if (Array.isArray(formData.hoverButtonsSections)) {
            Array.from(hoverButtonsSections.options).forEach(o => {
                o.selected = formData.hoverButtonsSections.includes(o.value);
            });
        }
        if (Array.isArray(formData.hoverCardsSections)) {
            Array.from(hoverCardsSections.options).forEach(o => {
                o.selected = formData.hoverCardsSections.includes(o.value);
            });
        }
        if (Array.isArray(formData.hoverImagesSections)) {
            Array.from(hoverImagesSections.options).forEach(o => {
                o.selected = formData.hoverImagesSections.includes(o.value);
            });
        }

        servicesTextarea.value = formData.services || '';
        companyDescTextarea.value = formData.companyDesc || '';
        hasLogoCheckbox.checked = formData.hasLogo || false;
        snapScrollingCheckbox.checked = formData.snapScrolling || false;
        extraWishes.value = formData.extraWishes || '';

        updateHoverSectionsOptions();

    } catch (e) {
        console.error('Ошибка загрузки из localStorage', e);
    }
}

// --- Генерация промпта ---
function generatePrompt() {
    // Проверка обязательного поля
    if (!projectName.value.trim()) {
        alert('Пожалуйста, введите название проекта.');
        projectName.focus();
        return;
    }

    let prompt = `# ПРОЕКТ: ${projectName.value.trim()}\n\n`;

    // 1. КОНТЕКСТ И ЦЕЛИ
    prompt += `## 1. КОНТЕКСТ И ЦЕЛИ\n`;
    prompt += `Тип сайта: ${document.querySelector('input[name="siteType"]:checked')?.value || 'Лендинг'}\n`;
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
    if (!colorPrimaryIgnore.checked) prompt += `Акцентный цвет 1: ${colorPrimary.value}\n`;
    if (!colorSecondaryIgnore.checked && colorSecondary.value !== '#2ecc71') prompt += `Акцентный цвет 2: ${colorSecondary.value}\n`;
    prompt += `Основной фон: ${colorBgPrimary.value}\n`;
    if (colorBgSecondary.value !== '#f4f7f6') prompt += `Вторичный фон: ${colorBgSecondary.value}\n`;
    prompt += `Цвет заголовков: ${colorTextHeaders.value}\n`;
    prompt += `Цвет основного текста: ${colorTextBody.value}\n`;
    if (gradients.value.trim()) prompt += `Градиенты/текстуры: ${gradients.value.trim()}\n`;
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

    // Ховер-эффекты для кнопок
    const hoverButtonsSelected = [];
    hoverButtons.forEach(cb => { if (cb.checked) hoverButtonsSelected.push(cb.value); });
    if (hoverButtonsSelected.length > 0) {
        const sections = Array.from(hoverButtonsSections.selectedOptions).map(o => o.value);
        prompt += `Ховер-эффекты для кнопок: ${hoverButtonsSelected.join(', ')}`;
        if (sections.length > 0) prompt += ` (применяется к секциям: ${sections.join(', ')})`;
        prompt += '\n';
    }

    const hoverCardsSelected = [];
    hoverCards.forEach(cb => { if (cb.checked) hoverCardsSelected.push(cb.value); });
    if (hoverCardsSelected.length > 0) {
        const sections = Array.from(hoverCardsSections.selectedOptions).map(o => o.value);
        prompt += `Ховер-эффекты для карточек: ${hoverCardsSelected.join(', ')}`;
        if (sections.length > 0) prompt += ` (применяется к секциям: ${sections.join(', ')})`;
        prompt += '\n';
    }

    const hoverImagesSelected = [];
    hoverImages.forEach(cb => { if (cb.checked) hoverImagesSelected.push(cb.value); });
    if (hoverImagesSelected.length > 0) {
        const sections = Array.from(hoverImagesSections.selectedOptions).map(o => o.value);
        prompt += `Ховер-эффекты для изображений: ${hoverImagesSelected.join(', ')}`;
        if (sections.length > 0) prompt += ` (применяется к секциям: ${sections.join(', ')})`;
        prompt += '\n';
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

// --- Копирование в буфер ---
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
        // Дополнительные сбросы
        toneOther.style.display = 'none';
        selectedBlocks = [];
        renderSortableList();
        updateHoverSectionsOptions();
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
    updateHoverSectionsOptions();

    // События для блоков
    blocksCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            updateBlocksList();
            saveFormState();
        });
    });

    // События для ховер-эффектов (сохранение)
    hoverButtons.forEach(cb => cb.addEventListener('change', saveFormState));
    hoverCards.forEach(cb => cb.addEventListener('change', saveFormState));
    hoverImages.forEach(cb => cb.addEventListener('change', saveFormState));
    hoverButtonsSections.addEventListener('change', saveFormState);
    hoverCardsSections.addEventListener('change', saveFormState);
    hoverImagesSections.addEventListener('change', saveFormState);

    // Сохраняем при любых изменениях в полях
    form.addEventListener('input', saveFormState);
    form.addEventListener('change', saveFormState);

    generateBtn.addEventListener('click', generatePrompt);
    copyBtn.addEventListener('click', copyToClipboard);
    addResetButton();
});