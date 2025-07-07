import { ITab } from "@/models/ITab";

export const getStoreTabs = (persistOrder: boolean, initialTabs: ITab[]): ITab[] => {
  if (!persistOrder) return initialTabs;
  if (typeof window === 'undefined') return initialTabs;

  const storedTabState = sessionStorage.getItem('tabState'); // Зчитуємо новий ключ

  if (!storedTabState) return initialTabs;

  try {
    const parsedState: { id: string; pinned: boolean }[] = JSON.parse(storedTabState);

    // Створюємо мапу для швидкого доступу до збереженого стану pinned
    const pinnedStateMap = new Map(parsedState.map(item => [item.id, item.pinned]));

    // Оновлюємо initialTabs з збереженим pinned станом
    const updatedTabs = initialTabs.map(tab => ({
      ...tab,
      pinned: pinnedStateMap.get(tab.id) ?? tab.pinned // Використовуємо збережений pinned стан або початковий
    }));

    // Відновлюємо порядок на основі збережених id
    const orderedTabs = parsedState.map(storedItem => {
      const originalTab = updatedTabs.find(tab => tab.id === storedItem.id);
      return originalTab ? originalTab : null; // Повертаємо оригінальну вкладку з оновленим pinned
    }).filter(Boolean) as ITab[]; // Фільтруємо null значення

    // Додаємо вкладки, які могли з'явитися або змінитися після останнього збереження
    const newOrUnsavedTabs = updatedTabs.filter(tab => !parsedState.some(storedItem => storedItem.id === tab.id));

    return [...orderedTabs, ...newOrUnsavedTabs];

  } catch (error) {
    console.error("Failed to parse stored tab state:", error);
    return initialTabs;
  }
};